// Acheive app
var AcheiveApp = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: '/data/items.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/data/items.json', status, err.toString());
      }.bind(this)
    });
  },
  handleDoneChange: function (what, done) {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].what === what) {
        this.state.data[i].done = done;
        console.log(this.state);
        this.setState(this.state);
        this.saveState();
        return;
      }
    }
    console.error("cannot update state: what not found", what);
  },
  saveState: function () {
    $.ajax({
        url: '/data/items.json',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(this.state),
        success: function(data) {
          this.setState(data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/data/items.json', status, err.toString());
        }.bind(this)
    });
  },
  render: function() {
    return (
        <div>
            <Toolbar/>
            <Sections data={this.state.data} onDoneChange={this.handleDoneChange} />
        </div>
    );
  }
});

var Toolbar = React.createClass({
  render: function() {
    return (
        <div>
            <nav>
                <h1>Achieve</h1>
                <DaySelector/>
            </nav>
            <div className="nav-spacer"></div>
        </div>
    );
  }
});

var DaySelector = React.createClass({
  render: function() {
      return (
          <div className="day-selector">Today</div>
      );
  }
});

var Sections = React.createClass({
  render: function() {
      var onDoneChange = this.props.onDoneChange;
      var sections = this.props.data.map(function (activity) {
        return (
          <Section onDoneChange={onDoneChange} what={activity.what} freq={activity.freq} done={activity.done}>
          </Section>
        );
      });
      return (
          <div>
          {sections}
          </div>
      );
  }
});

var Section = React.createClass({
    handleClick: function () {
      this.props.onDoneChange(this.props.what, !this.props.done);
    },
    render: function() {
        var buttonClass = this.props.done ? "done" : "not-done";
        return (
            <section>
                <h2>{this.props.what}</h2>
                <div className="when">{this.props.when}</div>
                <button className={buttonClass} onClick={this.handleClick}></button>
            </section>
        );
    }
});


React.render(
  <AcheiveApp/>,
  document.getElementById('content')
);
