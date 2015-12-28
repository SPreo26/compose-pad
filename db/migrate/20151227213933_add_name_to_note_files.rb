class AddNameToNoteFiles < ActiveRecord::Migration
  def change
    add_column :note_files, :name, :string
  end
end
