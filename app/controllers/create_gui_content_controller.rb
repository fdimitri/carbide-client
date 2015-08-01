class CreateGuiContentController < ApplicationController
#  before_action :set_vars
  after_action :setHeaders
  def setHeaders
    puts "setHeaders()"
    response.headers["Content-Type"] = "text/html"
  end
  def createPane
    setVarsPane(params)
    @myHtml = render_to_string(:partial => "/create_gui_content/createPane", :layout => false, :formats => [:erb, :html])
    @myScript = render_to_string(:partial => "/create_gui_content/createPane", :layout => false, :formats => [:js, :erb])
    @jsonString = {
      'reply' => {
        'success' => true,
        'returnType' => "/create_gui_content/createPane",
        'html' => @myHtml,
        'paneId' => @pane,
        'script' => @myScript,
        'calledWith' => @data,
        
      },
    }

    respond_to do |format|
      format.html { render :createPane }
      format.json { render :json => JSON.pretty_generate(@jsonString).html_safe }
    end
  end
  def setVarsPane(params)
    @data = params
    @paneCounter = "%.2d" % params['paneCounter']
    @delPanes = params['delPanes']
    @pane = "#pane" + @paneCounter
    @paneId = "#pane" + @paneCounter
    @tabBar = "#tabBar" + @paneCounter
    @paneX = "pane" + @paneCounter
    @paneTitle = "Pane " + (@paneCounter.to_i - @delPanes.to_i).to_s
# <!--$newScript = preg_replace('/%pane%/', sprintf("#pane%02d", $paneCounter), $oldScript);-->
# <!--$newScript = preg_replace('/%tabBar%/', sprintf("#tabBar%02d", $paneCounter), $newScript);-->
# <!--$newScript = preg_replace('/%paneX%>/', sprintf("pane%02d", $paneCounter), $newScript);-->
# <!--$newScript = preg_replace('/%@paneTitle%>/', sprintf("Pane %02d", ($paneCounter - $delPanes)), $newScript);-->

  end
  def createContent
    setVarsContent(params)
    @myHtml = render_to_string(:partial => "/create_gui_content/createContent#{@tabType}", :layout => false, :formats => [:erb, :html])
    @myScript = render_to_string(:partial => "/create_gui_content/createContent#{@tabType}", :layout => false, :formats => [:js, :erb])
    @jsonString = {
      'reply' => {
        'success' => true,
        'returnType' => "/create_gui_content/createContent#{@tabType}",
        'html' => @myHtml,
        'script' => @myScript,
        'calledWith' => @data,
      },
    }
    respond_to do |format|
      format.html { render :createContent }
      format.json { render :json => JSON.pretty_generate(@jsonString).html_safe }
    end
  end

  def createContentChat
    setVarsContent(params)

  end
  
  def createContentFile
    setVarsContent(params)
  end
  
  def createContentTerminal
    setVarsContent(params)
  end
  
  
  def setVarsContent(params)
    @data = params
    @tabName = params['tabName']
    @tabType = params['tabType']
    @paneId = params['paneId']
    @chatTarget = params['chatTarget']
    @srcPath = params['srcPath']
    #Terminal-only params
  	@containerId = @tabName + '_C';
    @terminalContainerId = @containerId
    @terminalId = @tabName
    @terminalName = @chatTarget

  end

end
