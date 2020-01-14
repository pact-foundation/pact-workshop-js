import React from 'react';

function Layout(props) {
    return (
        <div className="container">
            <div className="columns">
                <div className="column col-8 col-mx-auto">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;