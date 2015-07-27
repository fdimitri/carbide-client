class FixColumnNameInProjects < ActiveRecord::Migration
	def self.up
		rename_column :Projects, :Name, :name
	end

end
