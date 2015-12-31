Rails.application.routes.draw do
  
  devise_for :users
  devise_scope :user do
    root to: 'devise/sessions#new'
  end
  get '/my_files/', to: 'note_files#index'#leads to an index page from which you can open,rename,delete
  get '/note_files/open_rename_or_delete_files'
  get '/note_files/open_files', to: 'note_files#open_files'
    patch 'note_files/', to: 'note_files#rename_files'
  delete 'note_files/', to: 'note_files#delete_files'
  get '/workspace/', to: 'note_files#workspace'


  get '/note_files/new', to: 'note_files#new'
  post '/note_files/', to: 'note_files#create'

  patch '/note_files/:id/', to: 'note_files#save'
  get '/note_files/save/', to: 'note_files#save_all'


  get '/note_files/:id/close_file', to: 'note_files#close_file'
  get '/note_files/close_all', to: 'note_files#close_all'
  
  get '/note_files/delete', to: 'note_files#delete_index'
  
  resources :note_files

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
