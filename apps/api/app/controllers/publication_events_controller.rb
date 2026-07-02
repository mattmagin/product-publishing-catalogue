class PublicationEventsController < ApplicationController
  def index
    events = ProductPublicationEvent.includes(:user).order(occurred_at: :desc, id: :desc)
    events = events.where(product_id: params[:product_id]) if params[:product_id].present?

    render json: events.map { |event| serialize_publication_event(event) }
  end

  private

  def serialize_publication_event(event)
    user_name = event.user&.name if event.triggered_by == ProductPublicationEvent::TRIGGERED_BY[:user]

    event.as_json.merge("user_name" => user_name)
  end
end
