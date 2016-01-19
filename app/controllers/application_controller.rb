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

  def sign_in_message
   "Please sign in before you proceed!"
  end

  protected

  # In Rails 4.2 and above
  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
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

  def convert_notes_to_tones_and_octaves(notes_j)
    new_notes_j=notes_j

    notes_j.each_with_index do |note_j,index|
      puts note_j
      tone_and_octave=get_octave_and_tone_from_pitch(note_j["pitch"])
      new_notes_j[index][:tone]=tone_and_octave[:tone]
      new_notes_j[index][:octave]=tone_and_octave[:octave]
    end
    return new_notes_j
  end
end
