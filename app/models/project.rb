class Project < ActiveRecord::Base
  belongs_to :Owner, class_name: "User"
  has_one :ProjectProfile, :dependent => :destroy
  accepts_nested_attributes_for :ProjectProfile,  :reject_if => :all_blank, :allow_destroy => true
  has_many :ProjectsUser
  has_many :Users, :through => :ProjectsUser
end
