module MustacheHelper

  def inject_some_testing_js
    thread = User.first.projects.first.conversations.first
    comments = Conversation.last.comments

    javascript_tag %(
      document.on('dom:loaded', function() {
        var thread = #{thread.to_json(:include => :users)}
        var comments = #{comments.to_json(:include => :users)}

        $('activities').insert({
          before: Render.thread(thread, comments)
        })
      })
    )
  end

end