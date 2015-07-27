class ProjectsUser < ActiveRecord::Base
  belongs_to :User
  belongs_to :Project
end
