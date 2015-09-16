class AddStateAndInitiatorToProjectsUser < ActiveRecord::Migration
  def change
    add_column :projects_users, :state, :string, default: 'accepted'
    add_reference :projects_users, :initiator, index: true, foreign_key: true, default: 1
  end
end
