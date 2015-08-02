class ProjectsUserController < ApplicationController
  before_action :set_projects_user #, only: [:show, :edit, :update, :destroy, :finish_signup]
  
  def index
    @projects_users = ProjectsUser.all
    @visible_projects = []
    @projects_users.each do |project_assoc|
        if (project_assoc.Project.is_visible_to_user?(current_user.id))
            @visible_projects << project_assoc
        end
    end
    @project_users = @visible_projects
  end

  # GET /projects_users/1
  # GET /projects_users/1.json
  def show
  end

  # GET /projects_users/new
  def new
    @projects_user = ProjectsUser.new
  end

  # GET /projects_users/1/edit
  def edit
  end

  # POST /projects_users
  # POST /projects_users.json
  def inviteTest
  end
  
    def create
        myParams = params.require(:projects_user).permit(:User_id, :Project_id)
        @projects_user = ProjectsUser.new(myParams)
        respond_to do |format|
            if @projects_user.save
                format.html { redirect_to @projects_user, notice: 'Project profile was successfully created.' }
                format.json { render :show, status: :created, location: @projects_user }
            else
                format.html { render :new }
                format.json { render json: @projects_user.errors, status: :unprocessable_entity }
            end
        end
    end

    def inviteUserToProject
    @projects_user = ProjectsUser.new(projects_user_params)

    respond_to do |format|
      if @projects_user.save
        format.html { redirect_to @projects_user, notice: 'Project profile was successfully created.' }
        format.json { render :show, status: :created, location: @projects_user }
      else
        format.html { render :new }
        format.json { render json: @projects_user.errors, status: :unprocessable_entity }
      end
    end

    end
    
  # PATCH/PUT /projects_users/1
  # PATCH/PUT /projects_users/1.json
  def update
    respond_to do |format|
      if @projects_user.update(projects_user_params)
        format.html { redirect_to @projects_user, notice: 'Project profile was successfully updated.' }
        format.json { render :show, status: :ok, location: @projects_user }
      else
        format.html { render :edit }
        format.json { render json: @projects_user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects_users/1
  # DELETE /projects_users/1.json
  def destroy
    @projects_user.destroy
    respond_to do |format|
      format.html { redirect_to projects_users_url, notice: 'Project profile was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  
  private
    def set_projects_user
      if (params[:id] && param[:id].to_i > 0)
        @projects_user = ProjectsUser.find(params[:id])
      else
        @projects_user = ProjectsUser.new
      end
    end

    def projects_user_params
      params.require(:projects_user).permit(:User_id, :Project_id)
    end  

end
