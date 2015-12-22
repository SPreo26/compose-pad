class RenameFileModelToNoteFile < ActiveRecord::Migration
  def change
    rename_table :files, :note_files
  end
end
