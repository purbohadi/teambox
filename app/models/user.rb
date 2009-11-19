require 'digest/sha1'

# A User model describes an actual user, with his password and personal info.
# A Person model describes the relationship of a User that follows a Project.

class User < ActiveRecord::Base
  concerned_with :activation, :authentication, :completeness, :recent_projects, :validation
  acts_as_paranoid
  
  LANGUAGES = [['English', 'en'], ['Español', 'es']]
  
  def before_save
    self.update_profile_score
    self.recent_projects ||= []
    self.rss_token = Digest::SHA1.hexdigest(rand(999999999).to_s) if self.rss_token.nil?
  end
  
  def before_create
    self.build_card
    self.first_name = self.first_name.split(" ").collect(&:capitalize).join(" ")
    self.last_name  = self.last_name.split(" ").collect(&:capitalize).join(" ")
  end

  def after_create
    self.send_activation_email unless self.confirmed_user
  end
  
  def self.find_by_username_or_email(login)
    return unless login
    if login.include? '@' # usernames are not allowed to contain '@'
      find_by_email(login.downcase)
    else
      find_by_login(login.downcase)
    end
  end
  
  def to_s
    self.name
  end

  has_attached_file :avatar, 
    :url  => "/avatars/:id/:style/:basename.:extension",
    :path => ":rails_root/public/avatars/:id/:style/:basename.:extension",
    :styles => { 
      :micro => "24x24#", 
      :thumb => "48x48#", 
      :profile => "278x500>" }

  validates_attachment_size :avatar, :less_than => 2.megabytes
  validates_attachment_content_type :avatar, :content_type => ['image/jpeg', 'image/png']
  
    # :processors => [:cropper]
  #attr_accessor :crop_x, :crop_y, :crop_w, :crop_h
  #after_update :reprocess_avatar, :if => :cropping?

  has_one :card
  accepts_nested_attributes_for :card
  
  has_many :projects_owned, :class_name => 'Project', :foreign_key => 'user_id'
  has_many :comments
  has_many :people
  has_many :projects, :through => :people
  has_many :invitations, :foreign_key => 'invited_user_id'
  has_many :activities      
  has_many :uploads

  attr_accessible :login, 
                  :email, 
                  :first_name, 
                  :last_name,
                  :biography, 
                  :password, 
                  :password_confirmation, 
                  :time_zone, 
                  :language, 
                  :conversations_first_comment, 
                  :first_day_of_week,
                  :card_attributes,
                  :avatar


  def can_view?(user)
    not projects_shared_with(user).empty?
  end

  def projects_shared_with(user)
    self.projects & user.projects
  end

  def activities_visible_to_user(user)
    ids = projects_shared_with(user).collect { |project| project.id }
    
    self.activities.all(:limit => 40, :order => 'created_at DESC').select do |activity|
      ids.include?(activity.project_id) || activity.comment_type == 'User'
    end
  end
  
  def rss_token
    if read_attribute(:rss_token).nil?
      token = Digest::SHA1.hexdigest(rand(999999999).to_s)
      self.update_attribute(:rss_token, token)
      write_attribute(:rss_token, token)
    end
    
    read_attribute(:rss_token)
  end
  
  def self.find_by_rss_token(t)
    token = t.slice!(0..39)
    user_id = t
    User.find_by_rss_token_and_id(token,user_id)
  end
  
  def read_comments(comment,target)
    if CommentRead.user(self).are_comments_read?(target)
      CommentRead.user(self).read_up_to(comment)
    end
  end  
  
  def new_comment(user,target,comment)
    self.comments.new(comment) do |comment|
      comment.user_id = user.id
      comment.target = target
    end
  end

  def log_activity(target, action, creator_id=nil)
    creator_id = target.user_id unless creator_id
    Activity.log(nil, target, action, creator_id)
  end


  def cropping?
    !crop_x.blank? && !crop_y.blank? && !crop_w.blank? && !crop_h.blank?
  end
  
  def avatar_geometry(style = :original)
    @geometry ||= {}
    @geometry[style] ||= Paperclip::Geometry.from_file(avatar.path(style))
  end
  
  # Rewriting ActiveRecord's touch method
  # The original runs validations and loads associated models, being very inefficient
  def touch
    self.update_attribute(:updated_at, Time.now)
  end
  
  private
  
  def reprocess_avatar
    avatar.reprocess!
  end    
end