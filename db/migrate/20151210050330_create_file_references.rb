class CreateFileReferences < ActiveRecord::Migration
  def change
    create_table :file_references do |t|
      t.string :visibility

      t.timestamps null: false
    end
  end
end
