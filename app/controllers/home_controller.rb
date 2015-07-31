class HomeController < ApplicationController
  before_action :set_user, only: [:show, :edit, :index, :update, :destroy, :finish_signup]

  def initialize
  end

  def index
  end

  def show

  end
  def set_user
    if (current_user != nil)
      @user = User.find_by_id(current_user.id)
      @myProjects = @user.OwnedProjects
      @invProjects = @user.Projects
    end
  end

end
