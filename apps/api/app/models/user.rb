class User < ApplicationRecord
  has_many :product_publication_events

  validates :name, :email, presence: true
  validates :email, uniqueness: true
end
