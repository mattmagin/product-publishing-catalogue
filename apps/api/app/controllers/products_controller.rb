class ProductsController < ApplicationController
  def index
    products = products_for_status(Product.includes(:product_schedules))
      .order(Arel.sql("published_at DESC NULLS LAST"), :id)

    render json: products.as_json(methods: %i[status scheduled_publish_at])
  end

  def show
    product = Product.includes(:product_schedules).find(params[:id])
    render json: product.as_json(methods: %i[status scheduled_publish_at])
  end

  def publish
    product = Product.find(params[:id])
    invalid_message = nil

    product.with_lock do
      from_state = product.status

      if from_state == Product::STATUSES[:published]
        invalid_message = "Product is already published"
        next
      end

      product.update!(published_at: Time.current)
      create_publication_event!(
        product:,
        event_type: ProductPublicationEvent::EVENT_TYPES[:published],
        from_state:,
        to_state: Product::STATUSES[:published],
      )
      cancel_pending_schedule!(product:, action: ProductSchedule::ACTIONS[:publish])
    end

    return render_invalid_transition(invalid_message) if invalid_message

    render json: product.as_json(methods: %i[status scheduled_publish_at])
  end

  def unpublish
    product = Product.find(params[:id])
    invalid_message = nil

    product.with_lock do
      from_state = product.status

      unless from_state == Product::STATUSES[:published]
        invalid_message = "Product is not published"
        next
      end

      product.update!(published_at: nil)
      create_publication_event!(
        product:,
        event_type: ProductPublicationEvent::EVENT_TYPES[:unpublished],
        from_state:,
        to_state: Product::STATUSES[:draft],
      )
    end

    return render_invalid_transition(invalid_message) if invalid_message

    render json: product.as_json(methods: %i[status scheduled_publish_at])
  end

  def publish_later
    schedule_publish!
  end

  def cancel_publish_later
    cancel_publish!
  end

  private

  def products_for_status(products)
    case params[:status]
    when nil, ""
      products
    when Product::STATUSES[:draft]
      products.draft
    when Product::STATUSES[:scheduled]
      products.scheduled
    when Product::STATUSES[:published]
      products.published
    else
      products.none
    end
  end

  def cancel_pending_schedule!(product:, action:, from_state: product.status)
    schedule = product.product_schedules.pending.find_by(action:)
    return false if schedule.blank?

    schedule.update!(status: ProductSchedule::STATUSES[:cancelled])
    product.association(:product_schedules).reset
    create_publication_event!(
      product:,
      event_type: ProductPublicationEvent::EVENT_TYPES[:schedule_cancelled],
      from_state:,
      to_state: product.status,
    )
    true
  end

  def schedule_publish!
    product = Product.find(params[:id])
    schedule = nil

    product.with_lock do
      from_state = product.status
      schedule = product.product_schedules.build(
        action: ProductSchedule::ACTIONS[:publish],
        scheduled_at: schedule_params[:scheduled_at],
        created_by: default_user,
      )
      next unless schedule.save

      create_publication_event!(
        product:,
        event_type: ProductPublicationEvent::EVENT_TYPES[:publish_scheduled],
        from_state:,
        to_state: product.status,
      )
    end

    if schedule.persisted?
      render json: product.as_json(methods: %i[status scheduled_publish_at])
    else
      render_invalid_transition(schedule.errors.full_messages.to_sentence)
    end
  end

  def cancel_publish!
    product = Product.find(params[:id])
    cancelled = false

    product.with_lock do
      cancelled = cancel_pending_schedule!(
        product:,
        action: ProductSchedule::ACTIONS[:publish],
      )
    end

    return render_invalid_transition("Schedule is not pending") unless cancelled

    render json: product.as_json(methods: %i[status scheduled_publish_at])
  end

  def schedule_params
    params.permit(:scheduled_at)
  end

end
