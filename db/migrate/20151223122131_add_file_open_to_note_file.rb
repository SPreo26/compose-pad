class AddFileOpenToNoteFile < ActiveRecord::Migration
  def change
    add_column :note_files, :file_open, :boolean
  end
end
