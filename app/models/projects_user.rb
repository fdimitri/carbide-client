class ProjectsUser < ActiveRecord::Base
  belongs_to :User
  belongs_to :Project
  
  def all(userId = nil)
    rlist = []
    tlist = ProjectsUser.with_exclusive_scope { find(:all) }
    if (userId == nil)
      return tlist
    end
    tlist.each do |pu_assoc|
      if pu_assoc.Project.is_visible_to_user?(userId)
        rlist << pu_assoc
      end
    end
    return rlist
  end
end
