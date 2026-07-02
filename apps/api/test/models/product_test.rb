require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "reports draft status" do
    product = build_product

    assert_equal "draft", product.status
  end

  test "reports scheduled status when a pending publish schedule exists" do
    product = create_product
    create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_equal "scheduled", product.status
  end

  test "reports published status" do
    product = build_product(published_at: Time.current)

    assert_equal "published", product.status
  end

  test "executed and cancelled schedules do not make a product scheduled" do
    executed_product = create_product(sku: "PROD-1001")
    executed_schedule = create_schedule(executed_product, action: "publish", scheduled_at: 1.day.from_now)
    executed_schedule.update!(status: "executed")

    cancelled_product = create_product(sku: "PROD-1002")
    cancelled_schedule = create_schedule(cancelled_product, action: "publish", scheduled_at: 1.day.from_now)
    cancelled_schedule.update!(status: "cancelled")

    assert_equal "draft", executed_product.status
    assert_nil executed_product.scheduled_publish_at
    assert_equal "draft", cancelled_product.status
    assert_nil cancelled_product.scheduled_publish_at
  end

  test "computes scheduled_publish_at from a pending publish schedule" do
    product = create_product
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    assert_equal schedule.scheduled_at, product.scheduled_publish_at
  end

  test "filters by publication state" do
    draft = create_product(sku: "PROD-1001")
    scheduled = create_product(sku: "PROD-1002")
    create_schedule(scheduled, action: "publish", scheduled_at: 1.day.from_now)
    published = create_product(sku: "PROD-1003", published_at: Time.current)

    assert_equal [ draft ], Product.draft.to_a
    assert_equal [ scheduled ], Product.scheduled.to_a
    assert_equal [ published ], Product.published.to_a
  end

  private

  def build_product(attributes = {})
    Product.new(
      {
        sku: "PROD-1000",
        title: "Wireless Bluetooth Headphones",
        price: 129.99,
        image_url: "https://example.com/headphones.jpg"
      }.merge(attributes),
    )
  end

  def create_product(attributes = {})
    build_product(attributes).tap(&:save!)
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
        email: "matt-#{SecureRandom.hex(4)}@magin.com"
      }.merge(attributes),
    )
  end
end
