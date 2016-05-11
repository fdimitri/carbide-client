require 'test_helper'

class ServerLogEntriesControllerTest < ActionController::TestCase
  setup do
    @server_log_entry = server_log_entries(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:server_log_entries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create server_log_entry" do
    assert_difference('ServerLogEntry.count') do
      post :create, server_log_entry: { entrytime: @server_log_entry.entrytime, flags: @server_log_entry.flags, message: @server_log_entry.message, source: @server_log_entry.source }
    end

    assert_redirected_to server_log_entry_path(assigns(:server_log_entry))
  end

  test "should show server_log_entry" do
    get :show, id: @server_log_entry
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @server_log_entry
    assert_response :success
  end

  test "should update server_log_entry" do
    patch :update, id: @server_log_entry, server_log_entry: { entrytime: @server_log_entry.entrytime, flags: @server_log_entry.flags, message: @server_log_entry.message, source: @server_log_entry.source }
    assert_redirected_to server_log_entry_path(assigns(:server_log_entry))
  end

  test "should destroy server_log_entry" do
    assert_difference('ServerLogEntry.count', -1) do
      delete :destroy, id: @server_log_entry
    end

    assert_redirected_to server_log_entries_path
  end
end
