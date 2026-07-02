require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    user = build_user

    assert user.valid?
  end

  test "requires name" do
    user = build_user(name: nil)

    assert_not user.valid?
    assert_includes user.errors[:name], "can't be blank"
  end

  test "requires email" do
    user = build_user(email: nil)

    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  test "requires unique email" do
    create_user(email: "operator@example.com")
    duplicate = build_user(email: "operator@example.com")

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:email], "has already been taken"
  end

  test "has many product publication events" do
    user = create_user
    product = Product.create!(
      sku: "PROD-1001",
      title: "Wireless Bluetooth Headphones",
      price: 129.99,
      image_url: "https://example.com/headphones.jpg",
    )
    event = ProductPublicationEvent.create!(
      product:,
      user:,
      event_type: "publish_scheduled",
      from_state: "draft",
      to_state: "scheduled",
      triggered_by: "operator",
    )

    assert_equal [ event ], user.product_publication_events.to_a
  end

  private

  def build_user(attributes = {})
    User.new(
      {
        name: "Operator",
        email: "operator@example.com"
      }.merge(attributes),
    )
  end

  def create_user(attributes = {})
    build_user(attributes).tap(&:save!)
  end
end
