class NoteFilesController < ApplicationController

  #before_action authenticate_user, #authenticate_admin
  #def authenticate_user
  #def authenticate_admin

  @sign_in_message = "Please sign in before you proceed!"

  def new

  end

  def create
    if current_user
      note_file = NoteFile.new({name: params[:name], user_id: current_user.id, file_open: true})
      if note_file.valid?
        note_file.save
        redirect_to "/workspace"
      else
        messages=note_file.errors.messages.values.join("\n ")
        flash[:danger]=messages
        redirect_to "/note_files/new"
      end
    else
      flash[:danger]=@sign_in_message
      redirect_to "/users/sign_in/"
    end
  end

  def index
    if current_user
      @files = NoteFile.where(user_id: current_user).order(name: :asc)
    else
      flash[:danger]=@sign_in_message
      redirect_to "/users/sign_in"
    end
  end

  def open_files

  end

  def rename_files

  end

  def delete_files

  end

  def workspace
    @action_is_workspace = true
    @opened_files = NoteFile.where({user_id: current_user.id, file_open:true})
    if @opened_files.any?
      get_workspace_constants()
    else
      @action_is_workspace = false
      redirect_to "/my_files"
    end
  end

  def save
    notes_to_save=params[:file][:notes]
    note_file=NoteFile.find_by({id: params[:id], user_id: current_user.id})

    notes_to_save.each do |pitch, start_indeces|
      start_indeces.each do |start_index, note_presence|
        unless LoadedNote.find_by({file_id:note_file.id, pitch: pitch, start_index: start_index})
          #if pitch_okay? && start_index_okay? #add this later
          LoadedNote.create({file_id: note_file.id, pitch: pitch, velocity: 100, start_index: start_index})
        end
      end
    end
    flash[:success]="File saved!"
    redirect_to "/workspace"
  end

  def save_as

  end

  def save_all

  end
  
  def close_file
    note_file=NoteFile.find_by(id: params[:id], user_id: current_user.id)
    if note_file
      note_file.update(file_open: false)
    end
    redirect_to '/workspace'
  end

  def close_all
    if current_user
      @opened_files=NoteFile.where(user_id: current_user.id,file_open: true)
      #feature to be added: if any files are unsaved, ask to save them all or not, or cancel
      @opened_files.update_all(file_open: false)
      flash[:success]="Files closed!" #to be added - closed with or w/o saving
      redirect_to "/my_files/"
    else
      redirect_to "/users/sign_in/"
    end
  end


  private

  def get_workspace_constants
      @max_measure = 2
      @beats_per_measure = 4
      @divisions_per_beat = 4
      @max_octave = 4
      @min_octave = 3
      @max_tone = "B"
      @min_tone = "C"
      @tones_array = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].reverse#reverse as table in view is built from top down
  end

  def pitch_okay?(pitch)
    get_workspace_constants()
    if pitch.length<2 || pitch.length>3
      return false
    end
    octave = pitch[-1]
    tone = pitch[0..-2]
    unless (@min_octave..@max_octave).include?(octave) && @tones_array.include?(tone)
      return false
    end
    if octave == @max_octave && @tones_array.index(tone)<tones_array.index(@max_tone)#@tones_array is in reverse: ["B",..."C"] so conditional is: if tone<max, pitch is not okay
      return false
    end
    if octave == @min_octave && @tones_array.index(tone)>tones_array.index(@min_tone)
      return false
    end
    true 
  end

  def start_index_okay?(start_index)
    get_workspace_constants()
  end

end
