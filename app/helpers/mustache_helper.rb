module MustacheHelper

  def inject_some_testing_js
    thread = User.first.projects.first.conversations.first
    comments = Conversation.last.comments

    javascript_tag %(
      var thread = #{thread.to_json(:include => :users)}
      var comments = #{comments.to_json(:include => :users)}

      document.on('dom:loaded', function() {
        //$('activities').insert({
        //  before: Render.thread(thread, comments)
        //})
      })

    )
  end

end