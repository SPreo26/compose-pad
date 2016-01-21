class NoteFilesController < ApplicationController

  before_action :authenticate_user 
  #authenticate_admin

  def new

  end

  def create
    # if current_user
      note_file = NoteFile.new({name: params[:name], user_id: current_user.id, file_open: true})
      if note_file.valid?
        note_file.save
        redirect_to "/workspace"
      else
        messages=note_file.errors.messages.values.join("\n ")
        flash[:danger]=messages
        redirect_to "/note_files/new"
      end
    # end
  end

  def index
      @files = NoteFile.where(user_id: current_user.id).order(name: :asc)
      if @files.empty?
        flash[:success]="You don't have any files, please create one!"
        redirect_to "/note_files/new"
      end
  end

  def open
    if params[:files]
      files = NoteFile.where(id:params[:files].keys)
      files.update_all(file_open:true)
      redirect_to "/workspace"
    else
      flash.now[:danger]="No files selected!"
      redirect_to "/my_files"
    end
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
      note_file=NoteFile.find_by({id: params[:id], user_id: current_user.id})
    if note_file

      if params[:file]
        notes_to_add=params[:file][:notes]
        saved_notes=LoadedNote.where( note_file_id: note_file.id)
        destroy_deleted_notes(saved_notes,notes_to_add)
        create_new_notes(saved_notes,notes_to_add,note_file)     
      else#if form in view is completely blank
        LoadedNote.where(note_file_id: note_file.id).destroy_all
        #make sure any notes saved for that file are destroyed
      end

      flash[:success]="File saved!"
    else
      flash[:danger]="File id #{params[:id]} not found!"
    end
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

  def revert

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

  def destroy_deleted_notes(saved_notes,notes_to_add)
    saved_notes.each do |saved_note|
      
      saved_note_deleted=true
      #will be set to false if note with same pitch and start index is found in data sent from view
      notes_to_add.each do |pitch,start_indeces|

        start_indeces.each do |start_index|

          if saved_note.pitch==pitch && saved_note.start_index == start_index
            saved_note_deleted=false
          end

        end       
      end

      if saved_note_deleted
        saved_note.destroy
      end
    end

  end


  def create_new_notes(saved_notes,notes_to_add,note_file)

    notes_to_add.each do |pitch,start_indeces|

      start_indeces.each do |start_index|
        added_note_new=true
        #will be set to false if note with same pitch and start index is found in data sent from view
        #if pitch_okay? && start_index_okay? #add this later

        saved_notes.each do |saved_note|
          if saved_note.pitch==pitch && saved_note.start_index == start_index
            added_note_new=false
          end   
        end

        if added_note_new
          LoadedNote.create({note_file_id: note_file.id, pitch: pitch, velocity: 100, start_index: start_index})
        end

      end
    end
    
  end 
end
