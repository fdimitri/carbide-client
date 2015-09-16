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

ActiveRecord::Schema.define(version: 20150904051724) do

  create_table "Projects", force: :cascade do |t|
    t.string   "name",              limit: 255
    t.integer  "Owner_id",          limit: 4
    t.integer  "ProjectProfile_id", limit: 4
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "Projects", ["Owner_id"], name: "index_projects_on_Owner_id", using: :btree
  add_index "Projects", ["ProjectProfile_id"], name: "index_projects_on_ProjectProfile_id", using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.string   "provider",   limit: 255
    t.string   "uid",        limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "project_profiles", force: :cascade do |t|
    t.text     "About",      limit: 65535
    t.string   "Homepage",   limit: 255
    t.integer  "Project_id", limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "project_profiles", ["Project_id"], name: "index_project_profiles_on_Project_id", using: :btree

  create_table "projects", force: :cascade do |t|
    t.string   "Name",              limit: 255
    t.integer  "Owner_id",          limit: 4
    t.integer  "ProjectProfile_id", limit: 4
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "projects", ["Owner_id"], name: "index_projects_on_Owner_id", using: :btree
  add_index "projects", ["ProjectProfile_id"], name: "index_projects_on_ProjectProfile_id", using: :btree

  create_table "projects_users", force: :cascade do |t|
    t.integer  "User_id",      limit: 4
    t.integer  "Project_id",   limit: 4
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.string   "state",        limit: 255, default: "accepted"
    t.integer  "initiator_id", limit: 4,   default: 1
  end

  add_index "projects_users", ["Project_id"], name: "index_projects_users_on_Project_id", using: :btree
  add_index "projects_users", ["User_id"], name: "index_projects_users_on_User_id", using: :btree
  add_index "projects_users", ["initiator_id"], name: "index_projects_users_on_initiator_id", using: :btree

  create_table "sessions", force: :cascade do |t|
    t.string   "session_id", limit: 255,   null: false
    t.text     "data",       limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at",                                      null: false
    t.datetime "updated_at",                                      null: false
    t.string   "name",                   limit: 255
    t.string   "confirmation_token",     limit: 255
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email",      limit: 255
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
