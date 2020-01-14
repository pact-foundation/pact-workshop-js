import React from 'react';

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

export default Heading;