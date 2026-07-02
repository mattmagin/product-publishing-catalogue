require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    product = build_product

    assert product.valid?
  end

  test "requires sku" do
    product = build_product(sku: nil)

    assert_not product.valid?
    assert_includes product.errors[:sku], "can't be blank"
  end

  test "requires unique sku" do
    create_product(sku: "PROD-1001")
    duplicate = build_product(sku: "PROD-1001")

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:sku], "has already been taken"
  end

  test "requires title" do
    product = build_product(title: nil)

    assert_not product.valid?
    assert_includes product.errors[:title], "can't be blank"
  end

  test "requires image url" do
    product = build_product(image_url: nil)

    assert_not product.valid?
    assert_includes product.errors[:image_url], "can't be blank"
  end

  test "requires non-negative price" do
    product = build_product(price: -0.01)

    assert_not product.valid?
    assert_includes product.errors[:price], "must be greater than or equal to 0"
  end

  test "does not allow published and scheduled timestamps together" do
    product = build_product(
      published_at: Time.current,
      scheduled_publish_at: 1.day.from_now,
    )

    assert_not product.valid?
    assert_includes(
      product.errors[:base],
      "Product cannot be published and scheduled at the same time",
    )
  end

  test "requires scheduled publish time to be in the future" do
    product = build_product(scheduled_publish_at: 1.minute.ago)

    assert_not product.valid?
    assert_includes product.errors[:scheduled_publish_at], "must be in the future"
  end

  test "reports draft status" do
    product = build_product

    assert_equal "draft", product.status
  end

  test "reports scheduled status" do
    product = build_product(scheduled_publish_at: 1.day.from_now)

    assert_equal "scheduled", product.status
  end

  test "reports published status" do
    product = build_product(published_at: Time.current)

    assert_equal "published", product.status
  end

  test "filters by publication state" do
    draft = create_product(sku: "PROD-1001")
    scheduled = create_product(sku: "PROD-1002", scheduled_publish_at: 1.day.from_now)
    published = create_product(sku: "PROD-1003", published_at: Time.current)

    assert_equal [ draft ], Product.draft.to_a
    assert_equal [ scheduled ], Product.scheduled.to_a
    assert_equal [ published ], Product.published.to_a
  end

  test "has many publication events" do
    product = create_product(sku: "PROD-1001")
    user = User.create!(name: "Operator", email: "operator@example.com")
    event = ProductPublicationEvent.create!(
      product:,
      user:,
      event_type: "publish_scheduled",
      from_state: "draft",
      to_state: "scheduled",
      triggered_by: "operator",
    )

    assert_equal [ event ], product.publication_events.to_a
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
end
