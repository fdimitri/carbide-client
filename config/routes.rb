Rails.application.routes.draw do
  post 'create_gui_content/createPane'
  get 'create_gui_content/createPane'
  post 'create_gui_content/createContent'
  get 'create_gui_content/createContent'
  post 'create_gui_content/createUserSidebarContent'
  get 'create_gui_content/createUserSidebarContent'

  resources :project_profiles
  resources :projects

  root to: "home#index"
  devise_for :user, :controllers => { omniauth_callbacks: 'omniauth_callbacks' }, :skip => [:sessions]
  devise_scope :user do
    get '/user/signin' => 'devise/sessions#new', :as => :new_user_session
    post '/user/signin' => 'devise/sessions#create', :as => :user_session
    match '/user/sign_out' => 'devise/sessions#destroy', :as => :destroy_user_session, via: [:get, :post, :patch, :delete]
  end
  match '/user/:id/finish_signup' => 'user#finish_signup', via: [:get, :patch], :as => :finish_signup
   #devise_scope :user do
     #get 'sign_in', :to => 'devise/sessions#new', :as => :login
     #get 'logout', :to => 'devise/sessions#destroy', :as => :logout
     #get 'sign_out', :to => 'devise/sessions#destroy', :as => :sign_out
     #delete 'sign_out', :to => 'devise/sessions#destroy', :as => :sign_out
   #end

  resources :user
  resources :projects_user
  
  get 'projects_user/inviteTest'
  post 'projects_user/inviteTest'  
  
  get 'projects_user/inviteUserToProject'
  post 'projects_user/inviteUserToProject'
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
