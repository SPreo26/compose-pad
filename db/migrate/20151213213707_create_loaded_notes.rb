class CreateLoadedNotes < ActiveRecord::Migration
  def change
    create_table :loaded_notes do |t|
      t.integer :file_id
      t.string :pitch
      t.string :velocity
      t.string :integer
      t.boolean :selected

      t.timestamps null: false
    end
  end
end
