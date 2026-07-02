class ProductsController < ApplicationController
  def index
    render json: Product.order(:id).as_json(methods: :status)
  end

  def show
    render json: Product.find(params[:id]).as_json(methods: :status)
  end

  def publish_now
    product = Product.find(params[:id])
    invalid_message = nil

    product.with_lock do
      from_state = product.status

      if from_state == Product::STATUSES[:published]
        invalid_message = "Product is already published"
        next
      end

      product.update!(published_at: Time.current, scheduled_publish_at: nil)
      create_publication_event!(
        product:,
        event_type: ProductPublicationEvent::EVENT_TYPES[:published],
        from_state:,
        to_state: Product::STATUSES[:published],
      )
    end

    return render_invalid_transition(invalid_message) if invalid_message

    render json: product.as_json(methods: :status)
  end

  def unpublish_now
    product = Product.find(params[:id])
    invalid_message = nil

    product.with_lock do
      from_state = product.status

      unless from_state == Product::STATUSES[:published]
        invalid_message = "Product is not published"
        next
      end

      product.update!(published_at: nil, scheduled_publish_at: nil)
      create_publication_event!(
        product:,
        event_type: ProductPublicationEvent::EVENT_TYPES[:unpublished],
        from_state:,
        to_state: Product::STATUSES[:draft],
      )
    end

    return render_invalid_transition(invalid_message) if invalid_message

    render json: product.as_json(methods: :status)
  end

  private

  def create_publication_event!(product:, event_type:, from_state:, to_state:)
    product.publication_events.create!(
      event_type:,
      from_state:,
      to_state:,
      triggered_by: ProductPublicationEvent::TRIGGERED_BY[:operator],
      user: operator_user,
    )
  end

  def operator_user
    User.find_or_create_by!(email: "operator@example.com") do |user|
      user.name = "Catalogue Operator"
    end
  end

  def render_invalid_transition(message)
    render json: { error: message }, status: :conflict
  end
end
