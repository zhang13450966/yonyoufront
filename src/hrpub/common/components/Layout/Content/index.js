import React, {Component} from 'react';

import './index.less';

class Content extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {style, className, layoutHeight} = this.props;

        return (
            <div 
                className={`layout-content-wrapper ${className || ''}`}
                style={{
                    height: layoutHeight,
                    ...style
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Content;