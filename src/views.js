// Acheive app
var AcheiveApp = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
      Reactions.on('itemsChanged', function (e) {
          this.setState({data: e.detail});
      }.bind(this));
      Store.items.load();
  },
  render: function() {
    return (
        <div>
            <Toolbar/>
            <Sections data={this.state.data} />
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
      var sections = this.props.data.map(function (activity) {
        return (
          <Section what={activity.what} freq={activity.freq} done={activity.done}>
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
    mixins: [Reactions.mixin],
    handleClick: function () {
      this.trigger('itemDone', {what: this.props.what, done: !this.props.done});
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
