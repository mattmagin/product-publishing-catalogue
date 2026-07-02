class ExecuteDueProductSchedulesJob < ApplicationJob
  queue_as :default

  def perform
    ProductSchedule.pending.where(scheduled_at: ..Time.current).find_each do |schedule|
      execute(schedule)
    end
  end

  private

  def execute(schedule)
    product = schedule.product

    product.with_lock do
      schedule.reload
      next unless schedule.pending?

      from_state = product.status
      to_state = apply_schedule(product:, schedule:)

      if to_state
        schedule.update!(status: ProductSchedule::STATUSES[:executed], executed_at: Time.current)
        record_event!(
          product:,
          from_state:,
          to_state:,
          event_type: ProductPublicationEvent::EVENT_TYPES[:published],
        )
      else
        # Product state no longer permits this schedule. Cancel it instead of
        # leaving it pending to be retried forever.
        schedule.update!(status: ProductSchedule::STATUSES[:cancelled])
        record_event!(product:, from_state:, to_state: from_state, event_type: ProductPublicationEvent::EVENT_TYPES[:schedule_cancelled])
      end
    end
  rescue => e
    Rails.logger.error(
      "ExecuteDueProductSchedulesJob failed for ProductSchedule##{schedule.id}: #{e.class}: #{e.message}",
    )
  end

  def apply_schedule(product:, schedule:)
    case schedule.action
    when ProductSchedule::ACTIONS[:publish]
      # NOTE: from_state is "scheduled" here, not "draft" — the pending publish
      # schedule being executed is itself what makes product.status "scheduled".
      # The real eligibility check is simply "not already published".
      return nil if product.published_at.present?

      product.update!(published_at: Time.current)
      Product::STATUSES[:published]
    end
  end

  def record_event!(product:, from_state:, to_state:, event_type:)
    product.publication_events.create!(
      event_type:,
      from_state:,
      to_state:,
      triggered_by: ProductPublicationEvent::TRIGGERED_BY[:system],
    )
  end
end
