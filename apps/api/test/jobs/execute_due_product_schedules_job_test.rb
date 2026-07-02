require "test_helper"

class ExecuteDueProductSchedulesJobTest < ActiveSupport::TestCase
  test "executes a due pending publish schedule" do
    product = create_product(sku: "PROD-JOB-PUBLISH")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.minute.ago)

    ExecuteDueProductSchedulesJob.perform_now

    product.reload
    assert_equal "published", product.status
    assert product.published_at.present?

    schedule.reload
    assert_equal "executed", schedule.status
    assert schedule.executed_at.present?

    event = ProductPublicationEvent.order(:id).last
    assert_equal "published", event.event_type
    assert_equal "scheduled", event.from_state
    assert_equal "published", event.to_state
    assert_equal "system", event.triggered_by
    assert_nil event.user
  end

  test "leaves a not-yet-due schedule untouched" do
    product = create_product(sku: "PROD-JOB-FUTURE")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.day.from_now)

    ExecuteDueProductSchedulesJob.perform_now

    product.reload
    assert_equal "scheduled", product.status

    schedule.reload
    assert_equal "pending", schedule.status
  end

  test "a failing row does not block a sibling due row from executing" do
    broken_product = create_product(sku: "PROD-JOB-BROKEN")
    broken_schedule = create_schedule(broken_product, action: "publish", scheduled_at: 1.minute.ago)
    # No known action matches "publish", so apply_schedule falls
    # through to the cancel branch, whose schedule.update! then fails the
    # (always-on, not on: :create) action inclusion validation — a clean way to
    # force a real exception inside the job without violating a DB constraint.
    broken_schedule.update_column(:action, "not-a-real-action")

    healthy_product = create_product(sku: "PROD-JOB-HEALTHY")
    healthy_schedule = create_schedule(healthy_product, action: "publish", scheduled_at: 1.minute.ago)

    ExecuteDueProductSchedulesJob.perform_now

    broken_schedule.reload
    assert_equal "pending", broken_schedule.status

    healthy_product.reload
    assert_equal "published", healthy_product.status
    healthy_schedule.reload
    assert_equal "executed", healthy_schedule.status
  end

  test "cancels a due schedule whose transition is no longer legal" do
    product = create_product(sku: "PROD-JOB-ILLEGAL")
    schedule = create_schedule(product, action: "publish", scheduled_at: 1.minute.ago)
    product.update_column(:published_at, 1.day.ago) # bypasses the controller's auto-cancel

    ExecuteDueProductSchedulesJob.perform_now

    schedule.reload
    assert_equal "cancelled", schedule.status

    event = ProductPublicationEvent.order(:id).last
    assert_equal "schedule_cancelled", event.event_type
    assert_equal "system", event.triggered_by
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
    # scheduled_at must be in the future to pass creation validation; create with
    # a valid future placeholder, then backdate directly to simulate a due schedule.
    schedule = product.product_schedules.create!(
      action:,
      scheduled_at: 1.day.from_now,
      created_by: create_user,
    )
    schedule.update_column(:scheduled_at, scheduled_at)
    schedule
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
