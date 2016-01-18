class NoteFile < ActiveRecord::Base
  belongs_to :user
  has_many :loaded_notes

  validates :user_id, presence: {message: "You must be logged in to create a file!"}
  
  validates :name, length: {minimum: 1, maximum: 30, too_short: "File name cannot be blank!", too_long: "File name cannot exceed 30 characters!"}

  validates_format_of :name, with: /\A.*\z/, message: "New-line characters are not allowed! Did you accidentally press enter?"

  validates :name, uniqueness: {scope: :user_id, case_sensitive: true, message: "This file name already exists! Please choose another."} 
end
