require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "index returns products with rails-native fields and derived status" do
    published_product = create_product(
      sku: "PROD-1001",
      title: "Published Product",
      published_at: Time.zone.local(2026, 7, 1, 10, 0, 0),
    )
    create_product(
      sku: "PROD-1002",
      title: "Scheduled Product",
      scheduled_publish_at: 1.day.from_now,
    )

    get products_url

    assert_response :success

    products = response.parsed_body
    assert_equal 2, products.length

    first_product = products.first
    assert_equal published_product.id, first_product.fetch("id")
    assert_equal "PROD-1001", first_product.fetch("sku")
    assert_equal "Published Product", first_product.fetch("title")
    assert_equal "published", first_product.fetch("status")
    assert first_product.key?("image_url")
    assert first_product.key?("published_at")
    assert first_product.key?("scheduled_publish_at")
    assert first_product.key?("created_at")
    assert first_product.key?("updated_at")
  end

  test "show returns a product" do
    product = create_product(sku: "PROD-1001", scheduled_publish_at: 1.day.from_now)

    get product_url(product)

    assert_response :success

    response_product = response.parsed_body
    assert_equal product.id, response_product.fetch("id")
    assert_equal "PROD-1001", response_product.fetch("sku")
    assert_equal "scheduled", response_product.fetch("status")
  end

  test "show returns not found for missing product" do
    get product_url(123_456)

    assert_response :not_found
    assert_equal({ "error" => "Not found" }, response.parsed_body)
  end

  private

  def create_product(attributes = {})
    Product.create!(
      {
        sku: "PROD-1000",
        title: "Wireless Bluetooth Headphones",
        price: 129.99,
        image_url: "https://example.com/headphones.jpg"
      }.merge(attributes),
    )
  end
end
