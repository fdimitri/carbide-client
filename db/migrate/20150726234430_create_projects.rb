class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :Name
      t.references :Owner, index: true, foreign_key: true
      t.references :ProjectProfile, index: true, foreign_key: true
      t.timestamps null: false
    end
    add_foreign_key :projects, :users, column: :Owner_id
  end
end
