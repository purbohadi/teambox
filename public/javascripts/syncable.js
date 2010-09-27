function Collection(name) {
  this.name = name
  // MODEL ------------------------------------------------------------------
  // Items of the collection are stores in a Prototype Hash.
  // Use get(), set() and unset() to interface with the Collection,
  // and use the following methods internally:
  //   this.items.get(id) to find item
  //   this.items.set(id) to add/update item
  //   this.items.unset(id) to remove item
  this.items = new Hash({})
  // Adds or replaces the element _id_ on the collection and the DOM
  this.set = function(id, hash) {
    item = this.items.set(id, hash)
    this.renderItem(id)
    this.afterSetCallbacks.each(function(f) { f(id,hash) })
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
  // Stuff to run after setting an object (new or existing)
  this.afterSetCallbacks = []
  this.afterSet = function(f) {
    this.afterSetCallbacks.push(f)
  }

  // VIEW -------------------------------------------------------------------
  // This is the Mustache template we'll use for the views
  this.template = "Please define the 'template' attribute for this collection"
  this.container = $(name)
  this.itemToHtml = function(id) {
    if(item = this.items.get(id)) {
      return "<div id='" + this.name + "_" + id + "'>" +
                Mustache.to_html(this.template, item) +
             "</div>"
    }
  }

  // CONTROLLER  ------------------------------------------------------------
  this.renderAll = function() {
    html = ""
    keys = this.items.keys()
    for(var i=0; i < keys.length; i++)
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
}
