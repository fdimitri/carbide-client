require 'test_helper'

class CreateGuiContentControllerTest < ActionController::TestCase
  test "should get createPane" do
    get :createPane
    assert_response :success
  end

  test "should get createContent" do
    get :createContent
    assert_response :success
  end

end
