class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def render_not_found
    render json: { error: "Not found" }, status: :not_found
  end

  def render_invalid_transition(message)
    render json: { error: message }, status: :conflict
  end

  def default_user
    User.find_or_create_by!(email: "matt@magin.com") do |user|
      user.name = "Matthew Magin"
    end
  end

  def create_publication_event!(product:, event_type:, from_state:, to_state:)
    product.publication_events.create!(
      event_type:,
      from_state:,
      to_state:,
      triggered_by: ProductPublicationEvent::TRIGGERED_BY[:user],
      user: default_user,
    )
  end
end
