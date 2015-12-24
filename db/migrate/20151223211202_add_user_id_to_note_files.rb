class AddUserIdToNoteFiles < ActiveRecord::Migration
  def change
    add_column :note_files, :user_id, :integer
  end
end
