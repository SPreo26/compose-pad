class CreateUserSharedFiles < ActiveRecord::Migration
  def change
    create_table :user_shared_files do |t|
      t.integer :file_id
      t.integer :sharee_user_id

      t.timestamps null: false
    end
  end
end
