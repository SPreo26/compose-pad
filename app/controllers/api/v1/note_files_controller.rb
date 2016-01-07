class Api::V1::NoteFilesController < ApplicationController

  def index
    if current_user
      @note_files = NoteFile.where(user_id: current_user).order(name: :asc)
      render json: @note_files
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

end
