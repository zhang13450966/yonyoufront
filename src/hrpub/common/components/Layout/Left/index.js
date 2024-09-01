import React, {Component} from 'react';

import './index.less';


class LeftContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let dark = document.body.className.includes('nc-lightapp-front-black');

        const {
            layoutHeight,
            className,
            style
        } = this.props;
        return (
            <div 
                className={`tree-table layout-left-wrapper ${className || ''}`}
                style={{
                    height: layoutHeight,
                    display: 'block',
                    ...style,
                    borderColor: dark ? '#39393f' : '#d7d7d7'
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default LeftContent;