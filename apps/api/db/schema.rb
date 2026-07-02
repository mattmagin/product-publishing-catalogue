# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_02_000400) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "product_publication_events", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "event_type", null: false
    t.string "from_state", null: false
    t.datetime "occurred_at", null: false
    t.bigint "product_id", null: false
    t.string "to_state", null: false
    t.string "triggered_by", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["occurred_at", "id"], name: "index_product_publication_events_on_occurred_at_and_id"
    t.index ["product_id", "occurred_at", "id"], name: "idx_on_product_id_occurred_at_id_86f8164e06"
    t.index ["product_id"], name: "index_product_publication_events_on_product_id"
    t.index ["user_id"], name: "index_product_publication_events_on_user_id"
  end

  create_table "product_schedules", force: :cascade do |t|
    t.string "action", null: false
    t.datetime "created_at", null: false
    t.bigint "created_by_id", null: false
    t.datetime "executed_at"
    t.bigint "product_id", null: false
    t.datetime "scheduled_at", null: false
    t.string "status", default: "pending", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_product_schedules_on_created_by_id"
    t.index ["product_id", "action"], name: "index_product_schedules_on_product_id_and_action_pending", unique: true, where: "((status)::text = 'pending'::text)"
    t.index ["product_id"], name: "index_product_schedules_on_product_id"
    t.index ["status", "scheduled_at"], name: "index_product_schedules_on_status_and_scheduled_at"
  end

  create_table "products", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "image_url", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.datetime "published_at"
    t.string "sku", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["published_at"], name: "index_products_on_published_at"
    t.index ["sku"], name: "index_products_on_sku", unique: true
    t.check_constraint "price >= 0::numeric", name: "products_price_non_negative"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "product_publication_events", "products"
  add_foreign_key "product_publication_events", "users"
  add_foreign_key "product_schedules", "products"
  add_foreign_key "product_schedules", "users", column: "created_by_id"
end
