class ChangeFileIdToNoteFileIdInLoadedNotes < ActiveRecord::Migration
  def change
    rename_column :loaded_notes, :file_id, :note_file_id
  end
end
