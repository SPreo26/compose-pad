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
  
  namespace :api do
    namespace :v1 do
      get '/note_files', to: 'note_files#index'
      patch '/note_files/:id', to: 'note_files#update'
      patch '/note_files/:id/rename/', to: 'note_files#rename'
      patch '/note_files/:id/save/', to: 'note_files#rename'
    end
  end

 


end
