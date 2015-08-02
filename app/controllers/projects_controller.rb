class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  # GET /projects.json
  def index
    @projects = Project.all
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
    @project_profile = ProjectProfile.new
    @project_user = ProjectsUser.new
    #@project.ProjectProfile.build
  end

  # GET /projects/1/edit
  def edit
    if (!@project.ProjectProfile)
      @project_profile = ProjectProfile.new
    else
      @project_profile = @project.ProjectProfile
    end

  end

  # POST /projects
  # POST /projects.json
  def create
    projParams = project_params
    profParams = profile_params
    projParams[:Owner_id] = current_user.id
    @project = Project.new(projParams)
    saveResult = @project.save
    profParams[:Project_id] = @project.id
    @project_profile = ProjectProfile.new(profParams)
    saveResult &= @project_profile.save
    projParams[:ProjectProfile_id] = @project_profile.id
    @project_profile.update(profParams)
    @project.update(projParams)
    firstUser = ProjectsUser.new(:Project_id => @project.id, :User_id => @current_user.id)
    saveResult &= firstUser.save
    respond_to do |format|
      if saveResult
        format.html { redirect_to @project, notice: 'Project was successfully created.' }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    @project_profile = ProjectProfile.find_by_Project_id(@project.id)
    if (!@project.ProjectProfile)
      @project_profile = ProjectProfile.new(profile_params)
      @project_profile.Project_id = @project.id
      @project_profile.save
    else
      @project_profile.update(profile_params)
      @project_profile.Project_id = @project.id
    end

    updateSuccesss = @project_profile.update(profile_params)
    begin
      updateSuccess = updateSuccess & @project.update(project_params)
    rescue Exception => e
      @e = e
      raise
    end
    respond_to do |format|
      if updateSuccess
        format.html { redirect_to @project, notice: 'Project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
      @project_profile = ProjectProfile.find_by_Project_id(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      puts YAML.dump(params)
      params.require(:project).permit(:name, :Project_id, :Owner_id)
    end
    def profile_params
      params.require(:project).require(:project_profile).permit(:About, :Homepage, :Project_id)
    end
end
