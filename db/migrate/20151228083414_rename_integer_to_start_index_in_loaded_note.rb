class RenameIntegerToStartIndexInLoadedNote < ActiveRecord::Migration
  def change
    rename_column :loaded_notes, :integer, :start_index
  end
end
