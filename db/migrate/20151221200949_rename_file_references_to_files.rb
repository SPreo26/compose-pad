class RenameFileReferencesToFiles < ActiveRecord::Migration
  def change
    rename_table :file_references, :files
  end
end
