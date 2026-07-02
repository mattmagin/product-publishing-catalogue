class CreateProductSchedules < ActiveRecord::Migration[8.1]
  def change
    create_table :product_schedules do |t|
      t.references :product, null: false, foreign_key: true
      t.string :action, null: false
      t.datetime :scheduled_at, null: false
      t.string :status, null: false, default: "pending"
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.datetime :executed_at

      t.timestamps
    end

    add_index :product_schedules, [ :product_id, :action ],
      unique: true,
      where: "status = 'pending'",
      name: "index_product_schedules_on_product_id_and_action_pending"

    add_index :product_schedules, [ :status, :scheduled_at ]
  end
end
