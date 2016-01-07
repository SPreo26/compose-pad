class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  #this prevents a redirect loop after signing in as root is set to the sign-in page
  def after_sign_in_path_for(resource_or_scope)
    if NoteFile.find_by(file_open: true)
      "/workspace"
    else
      "/my_files/"
    end
  end

end
