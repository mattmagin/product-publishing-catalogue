require "test_helper"

class ProductScheduleTest < ActiveSupport::TestCase
  test "requires scheduled_at to be in the future on create" do
    schedule = build_schedule(product: create_product, scheduled_at: 1.minute.ago)

    assert_not schedule.valid?
    assert_includes schedule.errors[:scheduled_at], "must be in the future"
  end

  test "allows a past scheduled_at when updating an already-persisted schedule" do
    product = create_product
    schedule = build_schedule(product:, action: "publish").tap(&:save!)

    schedule.scheduled_at = 1.minute.ago
    schedule.status = "executed"

    assert schedule.valid?
  end

  test "rejects a second pending schedule for the same action on the same product" do
    product = create_product
    build_schedule(product:, action: "publish").save!
    duplicate = build_schedule(product:, action: "publish")

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:action], "already has a pending schedule for this product"
  end

  test "allows a new pending schedule once the previous one is no longer pending" do
    product = create_product
    first = build_schedule(product:, action: "publish").tap(&:save!)
    first.update!(status: "cancelled")

    second = build_schedule(product:, action: "publish")

    assert second.valid?
  end

  test "requires the product to be a draft to schedule a publish" do
    product = create_product(published_at: 1.day.ago)
    schedule = build_schedule(product:, action: "publish")

    assert_not schedule.valid?
    assert_includes schedule.errors[:base], "Product must be a draft to schedule a publish"
  end

  test "does not allow scheduling an unpublish" do
    product = create_product(published_at: 1.day.ago)
    schedule = build_schedule(product:, action: "unpublish")

    assert_not schedule.valid?
    assert_includes schedule.errors[:action], "is not included in the list"
  end

  private

  def build_schedule(attributes = {})
    ProductSchedule.new(
      {
        action: "publish",
        scheduled_at: 1.day.from_now,
        status: "pending",
        created_by: create_user
      }.merge(attributes),
    )
  end

  def create_product(attributes = {})
    Product.create!(
      {
        sku: "PROD-#{SecureRandom.hex(4)}",
        title: "Wireless Bluetooth Headphones",
        price: 129.99,
        image_url: "https://example.com/headphones.jpg"
      }.merge(attributes),
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
