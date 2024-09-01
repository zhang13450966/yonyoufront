import React, {Component} from 'react';

import './index.less';

import Header from './Header';
import Left from './Left';
import Content from './Content';

class Layout extends Component {
    constructor(props) {
        super(props);

        this.getPageHeight = this.getPageHeight.bind(this);
    }
    //按照平台header，统一改为46
    getPageHeight() {
        let height = 'auto';
        this.page && (height = (parseInt(getComputedStyle(this.page)['height']) - 46) + 'px');

        return height;
    }

    render() {
        const {
            className,
            children,
            style = {}
        } = this.props;
        

        return (
            <div 
                className={`layout-page-content nc-bill-tree-table  ${className || ''}`}
                ref={ref => this.page = ref}
                style={style}
            >
                {React.Children.map(children, (child) => {
                    if(React.isValidElement(child)) {
                        return (
                            <child.type
                                {...child.props}
                                layoutHeight={this.getPageHeight()}
                            >
                                {child.props.children}
                            </child.type>
                        );
                    }
                    else {
                        return child;
                    }
                })}
            </div>
        );
    }
}

Layout.Content = Content;
Layout.Header = Header;
Layout.Left = Left;

export default Layout;