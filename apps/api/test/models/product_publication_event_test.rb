require "test_helper"

class ProductPublicationEventTest < ActiveSupport::TestCase
  test "is valid with required attributes" do
    event = build_publication_event

    assert event.valid?
  end

  test "defaults occurred at when blank" do
    event = build_publication_event(occurred_at: nil)

    assert event.valid?
    assert event.occurred_at.present?
  end

  test "requires product" do
    event = build_publication_event(product: nil)

    assert_not event.valid?
    assert_includes event.errors[:product], "must exist"
  end

  test "requires known event type" do
    event = build_publication_event(event_type: "archived")

    assert_not event.valid?
    assert_includes event.errors[:event_type], "is not included in the list"
  end

  test "requires known from state" do
    event = build_publication_event(from_state: "hidden")

    assert_not event.valid?
    assert_includes event.errors[:from_state], "is not included in the list"
  end

  test "requires known to state" do
    event = build_publication_event(to_state: "hidden")

    assert_not event.valid?
    assert_includes event.errors[:to_state], "is not included in the list"
  end

  test "requires known triggered by value" do
    event = build_publication_event(triggered_by: "cron")

    assert_not event.valid?
    assert_includes event.errors[:triggered_by], "is not included in the list"
  end

  test "requires user for operator-triggered events" do
    event = build_publication_event(triggered_by: "operator", user: nil)

    assert_not event.valid?
    assert_includes event.errors[:user], "must exist for operator-triggered events"
  end

  test "allows system-triggered events without a user" do
    event = build_publication_event(triggered_by: "system", user: nil)

    assert event.valid?
  end

  test "belongs to product and user" do
    product = build_product
    user = build_user
    event = build_publication_event(product:, user:)

    assert_equal product, event.product
    assert_equal user, event.user
  end

  private

  def build_publication_event(attributes = {})
    ProductPublicationEvent.new(
      {
        product: build_product,
        event_type: "publish_scheduled",
        from_state: "draft",
        to_state: "scheduled",
        triggered_by: "operator",
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
        name: "Operator",
        email: "operator@example.com"
      }.merge(attributes),
    )
  end
end
