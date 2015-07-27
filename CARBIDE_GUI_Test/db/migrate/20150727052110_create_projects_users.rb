class CreateProjectsUsers < ActiveRecord::Migration
  def change
    create_table :projects_users do |t|
      t.references :User, index: true, foreign_key: true
      t.references :Project, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
