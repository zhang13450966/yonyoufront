
import React, {Component} from 'react';

import './index.less';

import Base from '../../../common/components/reportQuery/components/BusiBaseComponent';

import ReportQuery from '../action';
import ButtonAction from '../../../common/components/reportQuery/action/button';
import SimRepAction from '../../../common/components/reportQuery/action/simpleReport';
import QueryConditionAction from '../../../common/components/reportQuery/action/queryCondition';


import {createPage} from 'nc-lightapp-front';



class ContainerPage extends Base {

    constructor(props) {
        super(props);
        const reportTemplateMap = props.reportQuery.reportTemplateMap;
        if (props.use) {
            Object.keys(reportTemplateMap).forEach(item => {
                props.use.form(reportTemplateMap[item]);
            })
        }
        this.loadActions();
    }

    // 配置actions
    actions = {
        ReportQuery: ReportQuery, 
        ButtonAction: ButtonAction,
        simRep: SimRepAction,
        QCAction: QueryConditionAction
    }

    componentDidMount() {
        this.action.ReportQuery.init();
    }
    

    render() {
        return this.renderCommonTemplate();
    }
}

export default createPage({})(ContainerPage);