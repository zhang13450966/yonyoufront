import React from 'react';
import PropTypes from 'prop-types'
import BaseLayout from './base'
import {HrForm, HrHeader, HrTable} from './comps'

/**
 * HrLayout
 * @extends BaseLayout
 */
export default class HrLayout extends BaseLayout {
    static propsTypes = {
        type: PropTypes.string.isRequired,
        config: PropTypes.object
    }
    constructor(props) {
        super(props)
    }
    /**
     * 根据类型生成特定布局
     * @param  {string} type
     */
    createLayoutByType(type) {
        let props = this.props
        switch(type) {
            case 'tree-card':
                return (
                    <React.Fragment>
                        <HrHeader />
                        {
                            props.children
                        }
                    </React.Fragment>
                )
            case 'list':
                    return (
                        <React.Fragment>
                            <HrHeader btnApp={props.btnApp} {...props}/>
                            <div className="nc-bill-search-area">
                                {props.search ? props.search: null}
                            </div>
                            <HrTable table={props.table}/>
                            {
                                props.pagination
                            }
                        </React.Fragment>
                    )
            case 'card':
                    return (
                        <React.Fragment>
                            <HrHeader btnApp={props.btnApp} {...props}/>
                            <HrForm form={props.form}/>
                        </React.Fragment>
                    )
            case 'single-table':
                    return (
                        <React.Fragment>
                            <HrHeader btnApp={props.btnApp} {...props}/>
                            <HrTable table={props.table}/>
                        </React.Fragment>
                    )
        }
    }
    /**
     * 重写父类getLayout
     */
    getLayout() {
        let type = this.props.type
        let layout = this.createLayoutByType(type)
        return (
            <React.Fragment>
                {layout}
            </React.Fragment>
        )
    }
}
export {
    HrForm, HrHeader, HrTable, BaseLayout
}