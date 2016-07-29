class Api::V1::NoteFilesController < ApplicationController

  def index
    if current_user
      @note_files = NoteFile.where(user_id: current_user).order("LOWER(name)")
      render json: @note_files
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

  def update
    if params[:rename]==true
      redirect_to action: "rename", id: params[:id], _method: "patch"
    else
      redirect_to action: "save", id: params[:id], _method: "patch"
    end

  end

  def rename
    if current_user
      user_id = current_user.id
      file_id = params[:id]
      name = params[:name]
      file = NoteFile.find_by(id: file_id, user_id: user_id)      
      if file
        file.name=name
        if file.valid?
          file.save
          render json: file
        else
          render json: {errors: file.errors.full_messages}, status: 422
        end
      else
        render json: {message: "You do not have a file with id #{file_id}!"}, status: 404
      end
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

  def delete_files
    if current_user 
      user_id = current_user.id
      files = NoteFile.where(id: params[:file_ids], user_id: user_id)
      if files
        notes = LoadedNote.where(note_file_id: params[:file_ids])
          if notes
            notes.destroy_all
          end
        file_names=files.pluck(:name)
        files.destroy_all
        render json: {deleted_names: file_names}
      else render json: {message: "No files found with id's #{file_ids}!"}, status: 404
      end
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

  def open
    if current_user 
      user_id = current_user.id
      files = NoteFile.where(user_id: user_id, file_open: true)
      if files
        workspace_data={}
        files_j=[]

        files.each do |file|

          notes_j=LoadedNote.get_json_no_time_duplicates(file)
          notes_j=split_tone_and_octave_plus_convert_start_index(notes_j)

          file_j=file.as_json
          file_j["notes"]=notes_j
          files_j<<file_j
        end
        workspace_data["files"]=files_j
        workspace_data=get_workspace_matrix_data(workspace_data)
        render json: workspace_data
      else
        render json: {message: "No files open!"}, status: 404
      end
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

  def save
    note_file=NoteFile.find_by({id: params[:id], user_id: current_user.id})
    if note_file
      if params[:matrix]
        new_notes=params[:matrix]
        old_notes=LoadedNote.where( note_file_id: params[:id])
        destroy_deleted_notes(old_notes,new_notes)
        create_new_notes(old_notes,new_notes,note_file) 
        render json: {message: note_file.name + " saved!"}, status: 200    
      else 
        render json: {message: "matrix of notes never received by server"}, status: 404
      end

    else
      render json: {message: "Note File ID #{params[:id]} not found"}, status: 404
    end
  end

  def close

    note_file=NoteFile.find_by({id: params[:id], user_id: current_user.id})

    if note_file
      NoteFile.update(note_file.id, file_open:  false)
      render json: {message: "File closed."}, status: 200   
    else
      render json: {message: "Note File ID #{params[:id]} not found"}, status: 404
    end
  end

  private

  def get_workspace_matrix_data(workspace_data)
    time_constants=get_workspace_constants#initialize all the @instance variables called on below plus the time constants returned in an array
    workspace_data["time_constants"]=time_constants
    workspace_data["divisions"]=[]
    workspace_data["beats"]=[]

    1.upto(@max_measure) do |measure|
      1.upto(@beats_per_measure) do |beat|
        1.upto(@divisions_per_beat) do |division|
          workspace_data["divisions"]<<"#{measure}.#{beat}.#{division}"
          if division == 1
            workspace_data["beats"]<<"#{measure}.#{beat}"
          else
            workspace_data["beats"]<<""
          end
            #workspace_data["beats"] will end up looking something like ["1.1","","","","1.2"] - in this example there are 4 divisions per beat; the empty strings are place-holders which make it easier to populate the html table with beat markers
        end
      end
    end
    workspace_data["pitches_in_workspace"]=[]
    
    @max_octave.downto(@min_octave) do |octave|
      @tones_array.each_with_index do |tone, tone_index|
        if octave == @min_octave && tone_index>@tones_array.index(@min_tone)
          break
        elsif octave == @max_octave && tone_index<@tones_array.index(@max_tone) 
          next
        end
        workspace_data["pitches_in_workspace"]<<"#{tone}#{octave}"
      end
    end
    workspace_data["octave_tones"]=@tones_array.reverse
    return workspace_data
  end

  def destroy_deleted_notes(old_notes,new_notes)

    old_notes.each do |old_note|
      
      old_note_deleted = true
      #will be set to false if note with same pitch and start index is found in data sent from view
      old_pitch = old_note[:pitch]
      old_pitch_start_index = old_note[:start_index]

      old_note_deleted = false if new_notes[old_pitch][old_pitch_start_index]

      old_note.destroy if old_note_deleted

    end

  end


  def create_new_notes(old_notes,new_notes,note_file)

    new_notes.each do |pitch, new_pitch_start_indeces|
        #if pitch_okay? && start_index_okay? #add this later
      new_pitch_start_indeces.each do |new_pitch_start_index, new_pitch_start_index_presence|

        next unless new_pitch_start_index_presence
        #if this pitch and start index combination doesn't contain a note in the new data, no note created - moved on
        
        new_note_added = true
        #will be set to false if note with same pitch and start index is already found in data sent from view
        old_notes.each do |old_note|
          if pitch == old_note[:pitch] && new_pitch_start_index == old_note[:start_index]
            new_note_added = false
          end   
        end

        if new_note_added
          LoadedNote.create({note_file_id: note_file.id, pitch: pitch, velocity: 100, start_index: new_pitch_start_index})
        end

      end
    end
    
  end 

end