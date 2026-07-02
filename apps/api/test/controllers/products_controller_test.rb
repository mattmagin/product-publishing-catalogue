require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "index returns products with derived status and schedule fields" do
    published_product = create_product(
      sku: "PROD-1001",
      title: "Published Product",
      published_at: Time.zone.local(2026, 7, 1, 10, 0, 0),
    )
    scheduled_product = create_product(sku: "PROD-1002", title: "Scheduled Product")
    create_schedule(scheduled_product, action: "publish", scheduled_at: 1.day.from_now)

    get products_url

    assert_response :success

    products = response.parsed_body
    assert_equal 2, products.length

    first_product = products.first
    assert_equal published_product.id, first_product.fetch("id")
    assert_equal "PROD-1001", first_product.fetch("sku")
    assert_equal "Published Product", first_product.fetch("title")
    assert_equal "published", first_product.fetch("status")
    assert first_product.key?("scheduled_publish_at")

    second_product = products.second
    assert_equal "scheduled", second_product.fetch("status")
    assert second_product.fetch("scheduled_publish_at").present?
  end

  test "GET /products?status=published only returns published products" do
    older_product = create_product(
      sku: "PROD-STOREFRONT-PUBLISHED",
      title: "Published Storefront Product",
      published_at: 2.days.ago,
    )
    newer_product = create_product(
      sku: "PROD-STOREFRONT-NEWER",
      title: "Newer Storefront Product",
      published_at: 1.day.ago,
    )
    create_product(sku: "PROD-STOREFRONT-DRAFT")
    scheduled_product = create_product(sku: "PROD-STOREFRONT-SCHEDULED")
    create_schedule(scheduled_product, action: "publish", scheduled_at: 1.day.from_now)

    get products_url(status: "published")

    assert_response :success

    products = response.parsed_body
    assert_equal [ newer_product.id, older_product.id ], products.map { |product| product.fetch("id") }
    assert_equal [ "published", "published" ], products.map { |product| product.fetch("status") }

    product = products.second
    assert_equal "published", product.fetch("status")
  end

  test "publish now publishes a draft product and records an user event" do
    product = create_product(sku: "PROD-PUBLISH-DRAFT")

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      post publish_product_url(product)
    end

    assert_response :success

    product.reload
    assert_equal "published", product.status
    assert product.published_at.present?
    assert_nil product.scheduled_publish_at

    event = ProductPublicationEvent.order(:id).last
    assert_equal product, event.product
    assert_equal "published", event.event_type
    assert_equal "draft", event.from_state
    assert_equal "published", event.to_state
    assert_equal "user", event.triggered_by
    assert_equal "matt@magin.com", event.user.email
    assert_equal "published", response.parsed_body.fetch("status")
  end

  test "publish now publishes a scheduled product and cancels the schedule" do
    product = create_product(sku: "PROD-PUBLISH-SCHEDULED")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_difference -> { ProductPublicationEvent.count }, 2 do
      post publish_product_url(product)
    end

    assert_response :success

    product.reload
    assert_equal "published", product.status
    assert product.published_at.present?
    assert_nil product.scheduled_publish_at

    schedule.reload
    assert_equal "cancelled", schedule.status

    published_event, cancelled_event = ProductPublicationEvent.order(:id).last(2)
    assert_equal "published", published_event.event_type
    assert_equal "scheduled", published_event.from_state
    assert_equal "published", published_event.to_state

    assert_equal "schedule_cancelled", cancelled_event.event_type
  end

  test "publish now returns conflict for an already published product" do
    product = create_product(
      sku: "PROD-PUBLISH-CONFLICT",
      published_at: 1.day.ago,
    )

    assert_no_difference -> { ProductPublicationEvent.count } do
      post publish_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is already published" }, response.parsed_body)
  end

  test "unpublish now unpublishes a published product and records an user event" do
    product = create_product(
      sku: "PROD-UNPUBLISH-PUBLISHED",
      published_at: 1.day.ago,
    )

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      post unpublish_product_url(product)
    end

    assert_response :success

    product.reload
    assert_equal "draft", product.status
    assert_nil product.published_at
    assert_nil product.scheduled_publish_at

    event = ProductPublicationEvent.order(:id).last
    assert_equal product, event.product
    assert_equal "unpublished", event.event_type
    assert_equal "published", event.from_state
    assert_equal "draft", event.to_state
    assert_equal "user", event.triggered_by
    assert_equal "matt@magin.com", event.user.email
    assert_equal "draft", response.parsed_body.fetch("status")
  end

  test "unpublish now returns conflict for a draft product" do
    product = create_product(sku: "PROD-UNPUBLISH-DRAFT")

    assert_no_difference -> { ProductPublicationEvent.count } do
      post unpublish_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is not published" }, response.parsed_body)
  end

  test "unpublish now returns conflict for a scheduled product" do
    product = create_product(sku: "PROD-UNPUBLISH-SCHEDULED")
    create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_no_difference -> { ProductPublicationEvent.count } do
      post unpublish_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is not published" }, response.parsed_body)
  end

  test "publish later schedules a publish for a draft product" do
    product = create_product(sku: "PROD-SCHEDULE-PUBLISH")
    scheduled_at = 1.day.from_now

    assert_difference -> { ProductSchedule.count }, 1 do
      assert_difference -> { ProductPublicationEvent.count }, 1 do
        post publish_later_product_url(product), params: { scheduled_at: scheduled_at.iso8601 }, as: :json
      end
    end

    assert_response :success

    body = response.parsed_body
    assert_equal "scheduled", body.fetch("status")
    assert body.fetch("scheduled_publish_at").present?

    schedule = ProductSchedule.order(:id).last
    assert_equal "publish", schedule.action
    assert_equal "pending", schedule.status
    assert_equal product, schedule.product

    event = ProductPublicationEvent.order(:id).last
    assert_equal "publish_scheduled", event.event_type
    assert_equal "draft", event.from_state
    assert_equal "scheduled", event.to_state
    assert_equal "user", event.triggered_by
  end

  test "publish later returns conflict when a pending publish schedule already exists" do
    product = create_product(sku: "PROD-SCHEDULE-DUPLICATE")
    create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_no_difference -> { ProductSchedule.count } do
      post publish_later_product_url(product), params: { scheduled_at: 2.days.from_now.iso8601 }, as: :json
    end

    assert_response :conflict
  end

  test "publish later returns conflict for a non-draft product" do
    product = create_product(sku: "PROD-SCHEDULE-INVALID-PUBLISH", published_at: 1.day.ago)

    assert_no_difference -> { ProductSchedule.count } do
      post publish_later_product_url(product), params: { scheduled_at: 1.day.from_now.iso8601 }, as: :json
    end

    assert_response :conflict
  end

  test "publish later returns conflict when scheduled_at is in the past" do
    product = create_product(sku: "PROD-SCHEDULE-PAST")

    assert_no_difference -> { ProductSchedule.count } do
      post publish_later_product_url(product), params: { scheduled_at: 1.minute.ago.iso8601 }, as: :json
    end

    assert_response :conflict
  end

  test "cancel publish later cancels a pending publish schedule" do
    product = create_product(sku: "PROD-CANCEL-PUBLISH")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      delete publish_later_product_url(product)
    end

    assert_response :success

    body = response.parsed_body
    assert_equal "draft", body.fetch("status")

    schedule.reload
    assert_equal "cancelled", schedule.status

    event = ProductPublicationEvent.order(:id).last
    assert_equal "schedule_cancelled", event.event_type
    assert_equal "scheduled", event.from_state
    assert_equal "draft", event.to_state
  end

  test "cancel publish later returns conflict when there is no pending publish schedule" do
    product = create_product(sku: "PROD-CANCEL-NO-PUBLISH")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)
    schedule.update!(status: "executed")

    assert_no_difference -> { ProductPublicationEvent.count } do
      delete publish_later_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Schedule is not pending" }, response.parsed_body)
  end

  private

  def create_product(attributes = {})
    Product.create!(
      {
        sku: "PROD-1000",
        title: "Wireless Bluetooth Headphones",
        price: 129.99,
        image_url: "https://example.com/headphones.jpg"
      }.merge(attributes),
    )
  end

  def create_schedule(product, action:, scheduled_at:)
    product.product_schedules.create!(
      action:,
      scheduled_at:,
      created_by: create_user,
    )
  end

  def create_user(attributes = {})
    User.create!(
      {
        name: "Matt Magin",
        email: "matt@magin.com"
      }.merge(attributes),
    )
  end
end
