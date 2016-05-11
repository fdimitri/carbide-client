class ServerLogEntriesController < ApplicationController
  before_action :set_server_log_entry, only: [:show, :edit, :update, :destroy]
  # GET /server_log_entries
  # GET /server_log_entries.json
  def index
      @server_log_entries = ServerLogEntry.last(10000)
      if (params[:flags])
          @server_log_entries = @server_log_entries.find_by_flags(params[:flags])
      end
      if (params[:source])
          @server_log_entries = @server_log_entries.where("source REGEXP ?", params[:source])
      end
      if (params[:msg])
          @server_log_entries = @server_log_entries.where("msg REGEXP ?", params[:msg])
      end
    
  end
  # GET /server_log_entries/1.json
  def show
  end

  # GET /server_log_entries/new
  def new
    @server_log_entry = ServerLogEntry.new
  end

  # GET /server_log_entries/1/edit
  def edit
  end

  # POST /server_log_entries
  # POST /server_log_entries.json
  def create
    @server_log_entry = ServerLogEntry.new(server_log_entry_params)

    respond_to do |format|
      if @server_log_entry.save
        format.html { redirect_to @server_log_entry, notice: 'Server log entry was successfully created.' }
        format.json { render :show, status: :created, location: @server_log_entry }
      else
        format.html { render :new }
        format.json { render json: @server_log_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /server_log_entries/1
  # PATCH/PUT /server_log_entries/1.json
  def update
    respond_to do |format|
      if @server_log_entry.update(server_log_entry_params)
        format.html { redirect_to @server_log_entry, notice: 'Server log entry was successfully updated.' }
        format.json { render :show, status: :ok, location: @server_log_entry }
      else
        format.html { render :edit }
        format.json { render json: @server_log_entry.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /server_log_entries/1
  # DELETE /server_log_entries/1.json
  def destroy
    @server_log_entry.destroy
    respond_to do |format|
      format.html { redirect_to server_log_entries_url, notice: 'Server log entry was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_server_log_entry
      @server_log_entry = ServerLogEntry.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def server_log_entry_params
      params.require(:server_log_entry).permit(:entrytime, :flags, :source, :message)
    end
end