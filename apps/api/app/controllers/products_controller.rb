class ProductsController < ApplicationController
  def index
    render json: Product.order(:id).as_json(methods: :status)
  end

  def show
    render json: Product.find(params[:id]).as_json(methods: :status)
  end
end
