class NoteFilesController < ApplicationController

  #before_action
  #def authenticate_admin

  def index

    if current_user
      @files = NoteFile.where(user_id: current_user)
    else
      flash[:danger]="You need to sign in to view your files!"
      redirect_to "/users/sign_in"
    end

  end

  def show

    if current_user
      @file = NoteFile.find_by(id: params[:id], user_id: current_user)
      if @file
        #render?????
      else
        flash[:danger]="File id #{params[:id]} not found under this user need to sign in to view your files!"
      end
    else      
      flash[:danger]="You need to sign in to view your files!"
      redirect_to "/users/sign_in"
    end

  end


end
