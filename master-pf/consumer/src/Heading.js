import React from 'react';
import PropTypes from 'prop-types';

function Heading(props) {
  return (
    <div>
      <h1><a style={{
        textDecoration: "none",
        color: "#635e5e"
      }} href={props.href}>{props.text}</a></h1>
      <hr/>
    </div>
  );
}

Heading.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default Heading;