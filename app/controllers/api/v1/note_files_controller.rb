class Api::V1::NoteFilesController < ApplicationController

  def index
    if current_user
      @note_files = NoteFile.where(user_id: current_user).order(name: :asc)
      render json: @note_files
    else
      render json: {message: "Must be signed in!"}, status: 401
    end
  end

  def update
    if params[:rename]=true
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

  def save

  end

end
