class ProductSchedule < ApplicationRecord
  ACTIONS = {
    publish: "publish"
  }.freeze

  STATUSES = {
    pending: "pending",
    executed: "executed",
    cancelled: "cancelled"
  }.freeze

  belongs_to :product
  belongs_to :created_by, class_name: "User"

  validates :action, inclusion: { in: ACTIONS.values }
  validates :status, inclusion: { in: STATUSES.values }
  validates :scheduled_at, presence: true
  validates :action, uniqueness: {
    scope: :product_id,
    conditions: -> { where(status: STATUSES[:pending]) },
    message: "already has a pending schedule for this product"
  }, if: :pending?
  validate :scheduled_at_is_in_the_future, on: :create
  validate :product_is_eligible_for_action, on: :create

  scope :pending, -> { where(status: STATUSES[:pending]) }
  scope :to_publish, -> { where(action: ACTIONS[:publish]) }

  def pending?
    status == STATUSES[:pending]
  end

  private

  def scheduled_at_is_in_the_future
    return if scheduled_at.blank? || scheduled_at.future?

    errors.add(:scheduled_at, "must be in the future")
  end

  # NOTE: this checks product.published_at directly rather than product.status.
  # Building this schedule via product.product_schedules.build already adds it
  # (unsaved, default status "pending") to the in-memory association, so
  # product.status would self-referentially report "scheduled" for a pending
  # publish schedule being validated for the very first time. published_at is
  # unaffected by that and reflects true persisted state either way.
  def product_is_eligible_for_action
    return if product.blank?

    case action
    when ACTIONS[:publish]
      if product.published_at.present?
        errors.add(:base, "Product must be a draft to schedule a publish")
      end
    end
  end
end
