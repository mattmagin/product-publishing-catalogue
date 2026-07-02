class Product < ApplicationRecord
  STATUSES = {
    draft: "draft",
    scheduled: "scheduled",
    published: "published"
  }.freeze

  validates :sku, :title, :price, :image_url, presence: true
  validates :sku, uniqueness: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validate :has_one_publication_state
  validate :scheduled_publish_at_is_in_the_future

  scope :draft, -> { where(published_at: nil, scheduled_publish_at: nil) }
  scope :published, -> { where.not(published_at: nil).where(scheduled_publish_at: nil) }
  scope :scheduled, -> { where(published_at: nil).where.not(scheduled_publish_at: nil) }

  def status
    return STATUSES[:published] if published_at.present?
    return STATUSES[:scheduled] if scheduled_publish_at.present?

    STATUSES[:draft]
  end

  private

  def has_one_publication_state
    return unless published_at.present? && scheduled_publish_at.present?

    errors.add(:base, "Product cannot be published and scheduled at the same time")
  end

  def scheduled_publish_at_is_in_the_future
    return if scheduled_publish_at.blank? || scheduled_publish_at.future?

    errors.add(:scheduled_publish_at, "must be in the future")
  end
end
