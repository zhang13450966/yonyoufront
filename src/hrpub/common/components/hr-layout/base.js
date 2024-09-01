import React from 'react';
import PropTypes from 'prop-types'
import Config from './config'

export default class BaseLayout extends React.Component {
    static propsTypes = {
        type: PropTypes.string,
        config: PropTypes.object
    }
    constructor(props) {
        super(props) 
    }
    getLayout() {
        throw new Error('The getLayout must be overrided!!')
    }
    render() {
        let type = this.props.type
        let config = this.props.config ? this.props.config : Config
        let className = type ? Config[type] : Config['list']
        return (
            <div className={className}>
                {
                    this.getLayout()
                }
            </div>
        )
    }
}
