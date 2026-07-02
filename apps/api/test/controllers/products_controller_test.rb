require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "index returns products with rails-native fields and derived status" do
    published_product = create_product(
      sku: "PROD-1001",
      title: "Published Product",
      published_at: Time.zone.local(2026, 7, 1, 10, 0, 0),
    )
    create_product(
      sku: "PROD-1002",
      title: "Scheduled Product",
      scheduled_publish_at: 1.day.from_now,
    )

    get products_url

    assert_response :success

    products = response.parsed_body
    assert_equal 2, products.length

    first_product = products.first
    assert_equal published_product.id, first_product.fetch("id")
    assert_equal "PROD-1001", first_product.fetch("sku")
    assert_equal "Published Product", first_product.fetch("title")
    assert_equal "published", first_product.fetch("status")
    assert first_product.key?("image_url")
    assert first_product.key?("published_at")
    assert first_product.key?("scheduled_publish_at")
    assert first_product.key?("created_at")
    assert first_product.key?("updated_at")
  end

  test "show returns a product" do
    product = create_product(sku: "PROD-1001", scheduled_publish_at: 1.day.from_now)

    get product_url(product)

    assert_response :success

    response_product = response.parsed_body
    assert_equal product.id, response_product.fetch("id")
    assert_equal "PROD-1001", response_product.fetch("sku")
    assert_equal "scheduled", response_product.fetch("status")
  end

  test "show returns not found for missing product" do
    get product_url(123_456)

    assert_response :not_found
    assert_equal({ "error" => "Not found" }, response.parsed_body)
  end

  test "publish now publishes a draft product and records an operator event" do
    product = create_product(sku: "PROD-PUBLISH-DRAFT")

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      post publish_now_product_url(product)
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
    assert_equal "operator", event.triggered_by
    assert_equal "operator@example.com", event.user.email
    assert_equal "published", response.parsed_body.fetch("status")
  end

  test "publish now publishes a scheduled product and clears the schedule" do
    product = create_product(
      sku: "PROD-PUBLISH-SCHEDULED",
      scheduled_publish_at: 1.day.from_now,
    )

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      post publish_now_product_url(product)
    end

    assert_response :success

    product.reload
    assert_equal "published", product.status
    assert product.published_at.present?
    assert_nil product.scheduled_publish_at

    event = ProductPublicationEvent.order(:id).last
    assert_equal "published", event.event_type
    assert_equal "scheduled", event.from_state
    assert_equal "published", event.to_state
  end

  test "publish now returns conflict for an already published product" do
    product = create_product(
      sku: "PROD-PUBLISH-CONFLICT",
      published_at: 1.day.ago,
    )

    assert_no_difference -> { ProductPublicationEvent.count } do
      post publish_now_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is already published" }, response.parsed_body)
  end

  test "unpublish now unpublishes a published product and records an operator event" do
    product = create_product(
      sku: "PROD-UNPUBLISH-PUBLISHED",
      published_at: 1.day.ago,
    )

    assert_difference -> { ProductPublicationEvent.count }, 1 do
      post unpublish_now_product_url(product)
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
    assert_equal "operator", event.triggered_by
    assert_equal "operator@example.com", event.user.email
    assert_equal "draft", response.parsed_body.fetch("status")
  end

  test "unpublish now returns conflict for a draft product" do
    product = create_product(sku: "PROD-UNPUBLISH-DRAFT")

    assert_no_difference -> { ProductPublicationEvent.count } do
      post unpublish_now_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is not published" }, response.parsed_body)
  end

  test "unpublish now returns conflict for a scheduled product" do
    product = create_product(
      sku: "PROD-UNPUBLISH-SCHEDULED",
      scheduled_publish_at: 1.day.from_now,
    )

    assert_no_difference -> { ProductPublicationEvent.count } do
      post unpublish_now_product_url(product)
    end

    assert_response :conflict
    assert_equal({ "error" => "Product is not published" }, response.parsed_body)
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
end
