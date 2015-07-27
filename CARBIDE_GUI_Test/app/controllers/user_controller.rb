class UserController < ApplicationController
  before_action :set_user #, only: [:show, :edit, :update, :destroy, :finish_signup]

  # GET /users/:id.:format

  def show

    #authorize! :read, @user
  end

  # GET /users/:id/edit
  def edit
    #authorize! :update, @user
  end

  # PATCH/PUT /users/:id.:format
  def update
    @user = User.find(params[:id])
    authorize! :update, @user
    respond_to do |format|
      if @user.update(user_params)
        sign_in(@user == current_user ? @user : current_user, :bypass => true)
        format.html { redirect_to @user, notice: 'Your profile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET/PATCH /users/:id/finish_signup
  def finish_signup
    @user = User.find(params[:id])
    # authorize! :update, @user
    if request.patch? && params[:user] #&& params[:user][:email]
      if @user.update(user_params)
        @user.skip_reconfirmation!
        sign_in(@user, :bypass => true)
        redirect_to @user, notice: 'Your profile was successfully updated.'
        #redirect_to '/', notice: 'Your profile was successfully updated.'
      else
        @show_errors = true
      end
    end
  end

  # DELETE /users/:id.:format
  def destroy
    @user = User.find(params[:id])
    # authorize! :delete, @user
    @user.destroy
    respond_to do |format|
      format.html { redirect_to root_url }
      format.json { head :no_content }
    end
  end

  private
    def set_user
      if (params[:id])
        puts "----Setting to params[id] for user"
        @user = User.find(params[:id].to_i)
      else
        puts "----Setting to current_user for user"
        @user = current_user
      end
      @myProjects = @user.OwnedProjects
    end

    def user_params
      accessible = [ :name, :email ] # extend with your own params
      accessible << [ :password, :password_confirmation ] unless params[:user][:password].blank?
      params.require(:user).permit(accessible)
    end
end
