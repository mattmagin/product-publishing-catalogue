  # Publication events are intended to be add-only, however for this mvp we have not added any enforcement of this rule in the database

class ProductPublicationEvent < ApplicationRecord
  EVENT_TYPES = {
    publish_scheduled: "publish_scheduled",
    schedule_cancelled: "schedule_cancelled",
    published: "published",
    unpublished: "unpublished"
  }.freeze

  TRIGGERED_BY = {
    user: "user",
    system: "system"
  }.freeze

  belongs_to :product
  belongs_to :user, optional: true

  before_validation :default_occurred_at

  validates :event_type, inclusion: { in: EVENT_TYPES.values }
  validates :from_state, :to_state, inclusion: { in: Product::STATUSES.values }
  validates :triggered_by, inclusion: { in: TRIGGERED_BY.values }
  validate :user_events_have_user

  private

  def default_occurred_at
    self.occurred_at ||= Time.current
  end

  def user_events_have_user
    return unless triggered_by == TRIGGERED_BY[:user] && user.blank?

    errors.add(:user, "must exist for user-triggered events")
  end
end
