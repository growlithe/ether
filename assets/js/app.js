'use strict';

var React = require('react');

var MyHello = React.createClass({
  displayName: 'MyHello',
  render: function() {
    return (
      <div>Hello with {this.props.text}</div>
    );
  }
});

React.render(
  <MyHello text='some here' />,
  document.body
);