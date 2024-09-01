import React, {Component} from 'react';
import {base, ajax, toast, getMultiLang} from 'nc-lightapp-front';
import HrPanelContainer from './container'
import Config from './config'
import LazyLoad from './lazyLoad'
class HRPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hrpubJson: null
        }
    }
    componentWillMount() {
        let callback = (json, status, inlt)=> {

            if (status) {
                this.setState({
                    hrpubJson: json
                })
            }
        }

        getMultiLang({domainName: 'hrpub', moduleId: 'hrpub', callback})
    }
    render() {
        let Component = null
        let config = this.props.Config
        if (config && config[this.props.comp]) {

            Component = config[this.props.comp]
        } else {
            Component = Config[this.props.comp]
        }
        const PanelContainer = LazyLoad(Component)
        let com = this.state.hrpubJson ? (
            <HrPanelContainer
                ref="hr-panel-container-ref"
                callback = {this.props.panelConfirm}
                searchParam = {this.props.searchParam}
                pageConfig = {this.props.pageConfig}
                header={this.props.header}
                size={this.props.size}
                classNameChild = {this.props.classNameChild}
                json = {this.props.json}
                hrpubJson = {this.state.hrpubJson}
            >
                <PanelContainer hrpubJson = {this.state.hrpubJson} Config={config} />
            </HrPanelContainer>
        ): null
        return (
            <React.Fragment>
                {com}
            </React.Fragment>
        )
    }
}
export default HRPanel;