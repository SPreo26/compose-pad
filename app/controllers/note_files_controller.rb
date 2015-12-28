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
      @file = NoteFile.find_by({id: params[:id], user_id: current_user.id})
      if @file
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

  def new
  end

  def create
    user_id=current_user.id if current_user
    note_file = NoteFile.new({name:params[:name], user_id: user_id, file_open: true})
    if note_file.valid?
      note_file.save
      redirect_to "/workspace"
    else
      messages=note_file.errors.messages.values.join("\n ") 
        flash[:danger]=messages
      if current_user
        redirect_to "/note_files/new"
      else
        redirect_to "/users/sign_in/"
      end
    end
  end

  def update
    redirect_to "/workspace"
  end

  def opened_files
    @action_is_opened_files = true
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
