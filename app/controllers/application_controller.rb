class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # Turn on request forgery protection
  protect_from_forgery with: :null_session

  after_filter :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  #this prevents a redirect loop after signing in as root is set to the sign-in page
  def after_sign_in_path_for(resource_or_scope)
      if NoteFile.find_by(file_open: true)
        "/workspace"
      else
        "/my_files/"
      end
  end

  def after_sign_out_path_for(resource_or_scope)
      "/users/sign_in"
  end

  def authenticate_user
    if !current_user
      flash[:danger] = sign_in_message()
      redirect_to :root
    end
  end

  protected

  # In Rails 4.2 and above
  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

  private

  def sign_in_message
    "Please sign in before you proceed!"
  end

  def get_workspace_constants
    @max_measure = 2
    @beats_per_measure = 4
    @divisions_per_beat = 4
    @max_octave = 6
    @min_octave = 4
    @max_tone = "D"
    @min_tone = "E"
    @tones_array = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"].reverse#reverse as table in view is built from top down
    return {maxMeasure: @max_measure, beatsPerMeasure: @beats_per_measure, divisionsPerBeat: @divisions_per_beat}
  end

  def get_octave_and_tone_from_pitch(pitch)
    if pitch.count('#')>0
      tone = pitch[0..1]
      octave = pitch[2..-1]
    else
      tone = pitch[0]
      octave = pitch[1..-1]
    end
    return {"tone": tone, "octave": octave} 
  end

  def get_division_index_from_start_index(start_index)
    get_workspace_constants
    dot_indeces = (0 .. start_index.length).find_all { |i| start_index[i,1] == "."}
    measure = start_index[0..dot_indeces[0]-1].to_i - 1
    beat = start_index[dot_indeces[0]+1..dot_indeces[1]-1].to_i - 1
    division = start_index[dot_indeces[1]+1..-1].to_i - 1
    division_index = measure*@beats_per_measure*@divisions_per_beat + beat*@divisions_per_beat + division
    return division_index
  end

  def split_tone_and_octave_plus_convert_start_index(notes_j)
    new_notes_j=notes_j

    notes_j.each_with_index do |note_j,index|

      tone_and_octave=get_octave_and_tone_from_pitch(note_j["pitch"])
      new_notes_j[index][:tone]=tone_and_octave[:tone]
      new_notes_j[index][:octave]=tone_and_octave[:octave]

      division_index=get_division_index_from_start_index(note_j["start_index"])
      new_notes_j[index][:division_index]=division_index    
    end
    return new_notes_j
  end

end
