Render = {
  templates: {
    thread: "<div class='conversation thread' id='conversation_{{id}}'>\n        <div class='title'>\n          <div class='info'>\n            {{#user}}\n              <a class='thumb_avatar' href='/users/{{username}}' style='background: url({{avatar_url}}) no-repeat'></a>\n            {{/user}}\n          </div>\n          <div class='date'>\n            <time class=\"timeago\" data-msec=\"1283494464000\" datetime=\"2010-09-03T08:14:24+02:00\" pubdate=\"true\">Septiembre 03, 2010 08:14</time>\n          </div>\n          <p class='starter'>\n            {{#user}}\n              <a href=\"/users/{{username}}\">{{first_name}} {{last_name}}</a>\n            {{/user}}\n            ha creado la conversacin\n            <span class='project'>en <a href=\"/projects/teambox\">Project Name</a></span>\n          </p>\n          <p class='thread_title'>\n            <a href=\"/conversations/{{id}}\" class=\"conversation\">{{name}}</a>\n          </p>\n        </div>\n        <div class='comments'>\n          {{{comments_html}}}\n        </div>\n      </div>",
    comment: "<div class='comment' data-editable-before='1281942676000' data-project='{{project_id}}' data-user='{{user_id}}' id='comment_{{id}}'>\n      <div class='info'>\n        {{#user}}\n          <a class='micro_avatar' href='/users/{{username}}' style='background: url({{avatar_url}}) no-repeat'></a>\n        {{/user}}\n      </div>\n      <div class='block'>\n        <div class='actions_menu'>\n          <span class='actiondate'><time class=\"timeago\" data-msec=\"1281941776000\" datetime=\"2010-08-16T08:56:16+02:00\" pubdate=\"true\">Agosto 16, 2010 08:56</time></span>\n          <img class=\"triangle\" src=\"/images/triangle.png\" />\n          <div class='extra'>\n            <a href=\"/comments/{{id}}/edit\" class=\"edit\" data-uneditable-message=\"El comentario no se puede editar 15 minutos despus de publicarse\" rel=\"facebox\">Editar comentario</a>\n            <a href=\"/comments/{{id}}\" class=\"delete\" data-confirm=\"Seguro que quieres borrar este comentario?\" data-method=\"delete\" data-remote=\"true\">Borrar</a>\n          </div>\n        </div>\n        <div class='body textilized'>\n          <div class='before'>\n            {{#user}}\n              <a href=\"/users/{{username}}\" class=\"user\">{{first_name}} {{last_name}}</a>\n            {{/user}}\n          </div>\n          {{{body_html}}}\n        </div>\n      </div>\n      <div class='clear'></div>\n    </div>"
  },
  thread: function(thread, comments) {
    t = this.templates
    thread["comments_html"] = comments.collect(function(comment){
      return Mustache.to_html(t.comment, comment)
    }).join("")
  
    return Mustache.to_html(this.templates.thread, thread)
  }
}
