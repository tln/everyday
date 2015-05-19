function ItemsModel() {
    this.onupdate = [];
    this.data = [];
}

ItemsModel.prototype.load = function() {
    $.ajax({
      url: '/data/items.json',
      dataType: 'json',
      cache: false,
      success: this.update.bind(this),
      error: console.log.bind(console, 'Error loading')
    });
}

ItemsModel.prototype.update = function (result) {
    this.data = result.data;
    this.changed();
}

ItemsModel.prototype.changed = function () {
    Reactions.trigger('itemsChanged', this.data);
}

ItemsModel.prototype.changeDone = function (what, done) {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].what === what) {
        this.data[i].done = done;
        console.log(this.data);
        this.changed();
        this.save();
        return;
      }
    }
    console.error("cannot update state: what not found", what);
}

ItemsModel.prototype.save = function () {
    $.ajax({
        url: '/data/items.json',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({data: this.data}),
        success: this.update.bind(this),
        error: console.log.bind(console, 'Error saving')
    });
}

var Store = {
    items: new ItemsModel()
}

/* reactions aka event handlers */
Reactions.on('itemDone', function (event) {
    Store.items.changeDone(event.detail.what, event.detail.done);
})