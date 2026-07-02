class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :sku, null: false
      t.string :title, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :image_url, null: false
      t.datetime :published_at
      t.datetime :scheduled_publish_at

      t.timestamps
    end

    add_index :products, :sku, unique: true
    add_index :products, :published_at
    add_index :products, :scheduled_publish_at

    add_check_constraint :products, "price >= 0", name: "products_price_non_negative"
    add_check_constraint(
      :products,
      "published_at IS NULL OR scheduled_publish_at IS NULL",
      name: "products_single_publication_state",
    )
  end
end
