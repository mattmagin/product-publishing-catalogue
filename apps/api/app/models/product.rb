class Product < ApplicationRecord
  has_many :publication_events,
    class_name: "ProductPublicationEvent"
  has_many :product_schedules

  STATUSES = {
    draft: "draft",
    scheduled: "scheduled",
    published: "published"
  }.freeze

  validates :sku, :title, :price, :image_url, presence: true
  validates :sku, uniqueness: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }

  scope :draft, -> { where(published_at: nil).where.not(id: ProductSchedule.pending.to_publish.select(:product_id)) }
  scope :published, -> { where.not(published_at: nil) }
  scope :scheduled, -> { where(published_at: nil).where(id: ProductSchedule.pending.to_publish.select(:product_id)) }

  def status
    return STATUSES[:published] if published_at.present?
    return STATUSES[:scheduled] if pending_publish_schedule.present?

    STATUSES[:draft]
  end

  def scheduled_publish_at
    pending_publish_schedule&.scheduled_at
  end

  private

  def pending_publish_schedule
    product_schedules.select { |s| s.status == ProductSchedule::STATUSES[:pending] && s.action == ProductSchedule::ACTIONS[:publish] }.first
  end
end
