class CreateProductPublicationEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :product_publication_events do |t|
      t.references :product, null: false, foreign_key: true
      t.string :event_type, null: false
      t.string :from_state, null: false
      t.string :to_state, null: false
      t.string :triggered_by, null: false
      t.references :user, foreign_key: true
      t.datetime :occurred_at, null: false

      t.timestamps
    end

    add_index :product_publication_events, [ :occurred_at, :id ]
    add_index :product_publication_events, [ :product_id, :occurred_at, :id ]
  end
end
