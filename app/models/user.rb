class User < ActiveRecord::Base
  belongs_to :role
  has_many :note_files
  has_many :user_shared_files
  has_many :users, through: :user_shared_files
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
