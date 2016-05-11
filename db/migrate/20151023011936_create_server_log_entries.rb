class CreateServerLogEntries < ActiveRecord::Migration
  def change
    create_table :server_log_entries do |t|
      t.timestamp :entrytime
      t.integer :flags
      t.string :source
      t.text :message

      t.timestamps null: false
    end
  end
end
