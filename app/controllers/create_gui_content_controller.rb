class CreateGuiContentController < ApplicationController
#  before_action :set_vars
  after_action :setHeaders
  def setHeaders
    puts "setHeaders()"
    response.headers["Content-Type"] = "text/html"
  end


  def createUserSidebarContentProjectTree
    @customData['projects'] = Hash.new
    @user.Projects.each do |p|
      if (p.Owner.id == @user.id)
        pName = "[O] " + p.name
      else
        pName = p.name
      end
      projData =  [
        'id' => "Project" + p.id.to_s,
        'parent' => "#",
        'text' => p.name,
        'type' => 'jsTreeProject',
        'li_attr' => {
          'class' => 'jsTreeProject',
        }
      ]
      # ascon = CarbideServerConnector.new({:rawProject => p})
      p.Users.each do |u|
        next if (u.id == @user.id)
        # rval = ascon.queryUserStatus({:rawUser => u, :request => ["jsTreeType"]})
        # type = rval['jsTreeType']
        projData <<  [
          'id' => p.id.to_s + "_" + u.id.to_s,
          'parent' => "Project" + p.id.to_s,
          'text' => u.name,
          'type' => 'jsTreeUser',
          'li_attr' => {
            "class" => "jsTreeUser",
          }
          
        ]
        @customData['projects'][pName] = {
          'treeData' => projData.flatten,
          'ownerId' => p.Owner.id, 
          'ownerName' => p.Owner.name
        }
      end
    end
    treeData = []
    @customData['projects'].each do |k,v|
      v['treeData'].each do |tv|
        treeData << tv
      end
    end
    @customData['treeData'] = treeData.flatten
  end
  

  def createUserSidebarContent
    setVarsUserSidebarContent(params)
    #@myHtml = render_to_string(:partial => "/create_gui_content/createUserSidebarContent#{@tabType}", :layout => false, :formats => [:erb, :html])
    @myScript = render_to_string(:partial => "/create_gui_content/createUserSidebarContent#{@tabType}", :layout => false, :formats => [:js, :erb])
    if (!defined? @user) 
      @user = current_user
    end
    @customData = Hash.new
    if (self.respond_to?("createUserSidebarContent#{@tabType}"))  
      self.send("createUserSidebarContent#{@tabType}")
    end
    
    @jsonString = {
      'reply' => {
        'success' => true,
        'returnType' => "/create_gui_content/createContent#{@tabType}",
        # 'html' => @myHtml,
        'script' => @myScript,
        'jsonData' => @customData,
        'calledWith' => @data,
      },
    }
    respond_to do |format|
      format.html { render :createContent }
      format.json { render :json => JSON.pretty_generate(@jsonString).html_safe }
    end
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
  end

  def setVarsUserSidebarContent(params)
        @data = params

    @tabType = params['tabType']
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
      format.html { render :json => '<pre>' + ERB::Util::html_escape(JSON.pretty_generate(@jsonString)) + '</pre>' }
      format.json { render :json => JSON.pretty_generate(@jsonString).html_safe }
    end
  end
  
  def createContentTask
    setVarsContent(params)
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
    #Task-only params
    @taskName = @srcPath

  end

end
