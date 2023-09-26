import React from "react";
import PropTypes from "prop-types";
import Layout from "./Layout";
import Heading from "./Heading";

export default class ErrorBoundary extends React.Component {
  state = { has_error: false };

  componentDidCatch() {
    this.setState({ has_error: true });
  }

  render() {
    if (this.state.has_error) {
      return (
        <Layout>
          <Heading text="Sad times :(" href="/" />
          <div className="columns">
            <img
              className="column col-6"
              style={{
                height: "100%",
              }}
              src={"/sad_panda.gif"}
              alt="sad_panda"
            />
            <pre
              className="code column col-6"
              style={{
                wordWrap: "break-word",
              }}
            ></pre>
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.object.isRequired,
};
