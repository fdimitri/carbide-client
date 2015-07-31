class CreateProjectProfiles < ActiveRecord::Migration
  def change
    create_table :project_profiles do |t|
      t.text :About
      t.string :Homepage
      t.references :Project, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
