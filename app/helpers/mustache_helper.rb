module MustacheHelper

  def inject_some_testing_js
    thread = User.first.projects.first.conversations.first
    comments = Conversation.last.comments

    javascript_tag %(
      var _thread_json = #{thread.to_json(:include => :users)}
      var _comments_json = #{comments.to_json(:include => :users)}

      document.on('dom:loaded', function() {
        //$('activities').insert({
        //  before: Render.thread(thread, comments)
        //})
      })

    )
  end

end