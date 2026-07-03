class PublicationEventsController < ApplicationController
  def index
    events = ProductPublicationEvent.includes(:user, product: :product_schedules).order(occurred_at: :desc, id: :desc)
    events = events.where(product_id: params[:product_id]) if params[:product_id].present?

    render json: events.map { |event| serialize_publication_event(event) }
  end

  private

  def serialize_publication_event(event)
    user_name = event.user&.name if event.triggered_by == ProductPublicationEvent::TRIGGERED_BY[:user]

    event.as_json.merge(
      "user_name" => user_name,
      "scheduled_at" => scheduled_at_for(event),
    )
  end

  def scheduled_at_for(event)
    return unless scheduled_publish_event?(event)

    schedule = schedules_for(event).min_by do |candidate|
      (candidate_time(candidate, event) - event.occurred_at).abs
    end

    schedule&.scheduled_at
  end

  def scheduled_publish_event?(event)
    return true if event.event_type == ProductPublicationEvent::EVENT_TYPES[:publish_scheduled]
    return true if event.event_type == ProductPublicationEvent::EVENT_TYPES[:schedule_cancelled]

    event.event_type == ProductPublicationEvent::EVENT_TYPES[:published] &&
      event.from_state == Product::STATUSES[:scheduled]
  end

  def schedules_for(event)
    event.product.product_schedules.select do |schedule|
      schedule.action == ProductSchedule::ACTIONS[:publish]
    end
  end

  def candidate_time(schedule, event)
    case event.event_type
    when ProductPublicationEvent::EVENT_TYPES[:published]
      schedule.executed_at || schedule.updated_at
    else
      schedule.updated_at
    end
  end
end
