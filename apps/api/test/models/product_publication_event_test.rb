require "test_helper"

class ProductPublicationEventTest < ActiveSupport::TestCase
  test "defaults occurred at when blank" do
    event = build_publication_event(occurred_at: nil)

    assert event.valid?
    assert event.occurred_at.present?
  end

  test "requires user for user-triggered events" do
    event = build_publication_event(triggered_by: "user", user: nil)

    assert_not event.valid?
    assert_includes event.errors[:user], "must exist for user-triggered events"
  end

  test "allows system-triggered events without a user" do
    event = build_publication_event(triggered_by: "system", user: nil)

    assert event.valid?
  end

  private

  def build_publication_event(attributes = {})
    ProductPublicationEvent.new(
      {
        product: build_product,
        event_type: "publish_scheduled",
        from_state: "draft",
        to_state: "scheduled",
        triggered_by: "user",
        user: build_user,
        occurred_at: Time.current
      }.merge(attributes),
    )
  end

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

  def build_user(attributes = {})
    User.new(
      {
        name: "Matt Magin",
        email: "matt@magin.com"
      }.merge(attributes),
    )
  end
end
