require "test_helper"

class PublicationEventsControllerTest < ActionDispatch::IntegrationTest
  test "index returns publication events newest first" do
    product = create_product(sku: "PROD-1001")
    user = create_user
    older_event = create_publication_event(
      product:,
      user:,
      occurred_at: Time.zone.local(2026, 7, 1, 10, 0, 0),
    )
    newer_event = create_publication_event(
      product:,
      user:,
      event_type: "published",
      from_state: "scheduled",
      to_state: "published",
      occurred_at: Time.zone.local(2026, 7, 1, 11, 0, 0),
    )

    get publication_events_url

    assert_response :success

    events = response.parsed_body
    assert_equal [ newer_event.id, older_event.id ], events.pluck("id")

    first_event = events.first
    assert_equal product.id, first_event.fetch("product_id")
    assert_equal user.id, first_event.fetch("user_id")
    assert_equal "published", first_event.fetch("event_type")
    assert_equal "scheduled", first_event.fetch("from_state")
    assert_equal "published", first_event.fetch("to_state")
    assert_equal "operator", first_event.fetch("triggered_by")
    assert first_event.key?("occurred_at")
    assert first_event.key?("created_at")
    assert first_event.key?("updated_at")
    assert_not first_event.key?("product")
    assert_not first_event.key?("user")
  end

  test "index optionally filters by product id" do
    included_product = create_product(sku: "PROD-1001")
    excluded_product = create_product(sku: "PROD-1002")
    user = create_user
    included_event = create_publication_event(product: included_product, user:)
    create_publication_event(product: excluded_product, user:)

    get publication_events_url(product_id: included_product.id)

    assert_response :success
    assert_equal [ included_event.id ], response.parsed_body.pluck("id")
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

  def create_user(attributes = {})
    User.create!(
      {
        name: "Operator",
        email: "operator@example.com"
      }.merge(attributes),
    )
  end

  def create_publication_event(attributes = {})
    ProductPublicationEvent.create!(
      {
        event_type: "publish_scheduled",
        from_state: "draft",
        to_state: "scheduled",
        triggered_by: "operator",
        occurred_at: Time.current
      }.merge(attributes),
    )
  end
end
