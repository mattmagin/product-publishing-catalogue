class ProductPublicationEvent < ApplicationRecord
  EVENT_TYPES = {
    publish_scheduled: "publish_scheduled",
    schedule_cancelled: "schedule_cancelled",
    published: "published",
    unpublished: "unpublished"
  }.freeze

  TRIGGERED_BY = {
    operator: "operator",
    system: "system"
  }.freeze

  belongs_to :product
  belongs_to :user, optional: true

  before_validation :default_occurred_at

  validates :event_type, inclusion: { in: EVENT_TYPES.values }
  validates :from_state, :to_state, inclusion: { in: Product::STATUSES.values }
  validates :triggered_by, inclusion: { in: TRIGGERED_BY.values }
  validate :operator_events_have_user

  # Publication events are intended to be append-only; v1 documents that contract
  # without enforcing update/delete restrictions in Rails or the database.

  private

  def default_occurred_at
    self.occurred_at ||= Time.current
  end

  def operator_events_have_user
    return unless triggered_by == TRIGGERED_BY[:operator] && user.blank?

    errors.add(:user, "must exist for operator-triggered events")
  end
end
