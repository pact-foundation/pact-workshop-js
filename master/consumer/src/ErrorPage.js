import React from 'react';
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-icons.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import Layout from "./Layout";
import Heading from "./Heading";
import {withRouter} from "react-router";
import PropTypes from 'prop-types';

class ErrorPage extends React.Component {
    render() {
        return (
            <Layout>
                <Heading text="Sad times :(" href="/"/>
                <div className="columns">
                    <img className="column col-6" style={{
                        height: "100%"
                    }} src={"./sad_panda.gif"} alt="sad_panda"/>
                    <pre className="code column col-6" style={{
                        wordWrap: "break-word"
                    }}>
                        <code>
                            {this.props.location.state && this.props.location.state.error ? this.props.location.state.error : ""}
                        </code>
                    </pre>
                </div>
            </Layout>
        );
    }
}

ErrorPage.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            error: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(ErrorPage);