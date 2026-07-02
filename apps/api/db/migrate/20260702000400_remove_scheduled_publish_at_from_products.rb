class RemoveScheduledPublishAtFromProducts < ActiveRecord::Migration[8.1]
  def change
    remove_check_constraint :products,
      "published_at IS NULL OR scheduled_publish_at IS NULL",
      name: "products_single_publication_state"

    remove_column :products, :scheduled_publish_at, :datetime
  end
end
