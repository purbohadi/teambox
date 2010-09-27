document.on("dom:loaded", function() {

  // Declare a collection by doing
  function Collection(name) {
    this.name = name
    // MODEL ------------------------------------------------------------------
    // Items of the collection are stores in a Prototype Hash.
    // Use GetItem, SetItem, UnsetItem to interface with the Collection,
    // and use the following methods internally:
    //   this.items.get(id) to find item
    //   this.items.set(id) to add/update item
    //   this.items.unset(id) to remove item
    this.items = new Hash({
      6: { user: "pablo", body: "hola"},
      5: { user: "jordi", body: "ugh"}
    })

    // VIEW -------------------------------------------------------------------
    // This is the Mustache template we'll use for the views
    this.template = "<p>{{user}}: {{body}}</p>"
    this.container = $(name)
    this.itemToHtml = function(id) {
      if(item = this.items.get(id)) {
        return "<div id='" + this.name + "_" + id + "'>" +
                  Mustache.to_html(this.template, item) +
               "</div>"
      }
    }
    this.renderAll = function() {
      html = ""
      keys = this.items.keys()
      for(i=0; i < keys.length; i++)
        html += this.itemToHtml(keys[i])
      this.container.insert({ top: html })
      return html
    }
    this.removeElementIfExists = function(id) {
      if(el = $(this.name + "_" + id))
        return el.remove()
    }
    this.renderItem = function(id) {
      html = this.itemToHtml(id)
      this.removeElementIfExists(id)
      this.container.insert({ top: html })
      return html
    }

    // CONTROLLER  ------------------------------------------------------------
    // Adds or replaces the element _id_ on the collection and the DOM
    this.set = function(id, hash) {
      item = this.items.set(id, hash)
      this.renderItem(id)
      return item
    }
    // Returns the data for the element _id_
    this.get = function(id) {
      return this.items.get(id)
    }
    // Removes the element _id_ from the collection and the DOM
    this.unset = function(id) {
      this.removeElementIfExists(id)
      return this.items.unset(id)
    }
  }

  _tweets = new Collection('tweets')
  _tweets.renderAll()
  _tweets.set(7,{ user: "xurde", body: "a ver siete"}) // add item
  _tweets.unset(7) // remove existing item
  _tweets.unset(1) // remove unexisting item
  _tweets.unset(5) // remove existing item
  _tweets.set(8,{ user: "ocho", body: "pim pam"}) // new item
  _tweets.set(8,{ user: "ocho", body: "bizcocho"}) // replace item
  _tweets.set(9,{ user: "nueve", body: "que llueve, que llueve"}) // one more
  
})

///////////////////

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


/*
Ideas for the future:

We need to build updateFromJSON(payload, default_collection) so...
  {id: 7, user: "micho"}           => adds or updates micho
  {_action: "unset", id: 3}        => removes item with _id_ 3
  {_action: "js", js: "alert(5)"}  => executes "alert(5)"
  {id: 7, user: "micho", collection: "tweets"} => updates the said collection
  

Configure effects or parameters for each collection
  poll-url            // http://url/something.json
  poll-frequency      // 60 seconds by default
  after-add           // call a js function after an element is added
  after-remove        // after it's removed..
  after-update        // or after an existing one is updated

Autosetup divs to sync if they have the class .syncable?

*/