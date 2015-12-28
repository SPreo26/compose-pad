class NoteFile < ActiveRecord::Base
  belongs_to :user
  has_many :loaded_notes

  validates :user_id, presence: {message: "You must be logged in to create a file!"}
  validates :name, uniqueness: {scope: :user_id, message: "This file name already exists! Please choose another."} 
end
