# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150802073054) do

  create_table "Projects", force: :cascade do |t|
    t.string   "name"
    t.integer  "Owner_id"
    t.integer  "ProjectProfile_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "Projects", ["Owner_id"], name: "index_projects_on_Owner_id"
  add_index "Projects", ["ProjectProfile_id"], name: "index_projects_on_ProjectProfile_id"

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id"

  create_table "project_profiles", force: :cascade do |t|
    t.text     "About"
    t.string   "Homepage"
    t.integer  "Project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "project_profiles", ["Project_id"], name: "index_project_profiles_on_Project_id"

  create_table "projects_users", force: :cascade do |t|
    t.integer  "User_id"
    t.integer  "Project_id"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "state",        default: "accepted"
    t.integer  "initiator_id", default: 1
  end

  add_index "projects_users", ["Project_id"], name: "index_projects_users_on_Project_id"
  add_index "projects_users", ["User_id"], name: "index_projects_users_on_User_id"
  add_index "projects_users", ["initiator_id"], name: "index_projects_users_on_initiator_id"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "name"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
