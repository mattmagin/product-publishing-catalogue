class PublicationEventsController < ApplicationController
  def index
    events = ProductPublicationEvent.order(occurred_at: :desc, id: :desc)
    events = events.where(product_id: params[:product_id]) if params[:product_id].present?

    render json: events
  end
end
