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
        @file.update(file_is_open:true)
        redirect_to "/workspace"
      else
        flash[:danger]="File id #{params[:id]} not found under this user need to sign in to view your files!"
        redirect_to "/"
      end
    else      
      flash[:danger]="You need to sign in to view your files!"
      redirect_to "/users/sign_in"
    end

  end

  def update
    redirect_to "/workspace"
  end

  def open_files
    @action_is_open_files = true
    @max_measure = 2
    @beats_per_measure = 4
    @divisions_per_beat = 4
    @max_octave = 4
    @min_octave = 3
    @max_tone = "B"
    @min_tone = "C"
    @tones_array = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].reverse#reverse as table in view is built from top down
  end


end
