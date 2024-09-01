import React, {Component} from 'react';


import './index.less';

import BaseComponent from '../BaseComponent';

import QueryConditionAction from '../../action/queryCondition';

import Transfer from '../../../../../../hrpub/common/components/Transfer';

import {
    base,
    high
} from 'nc-lightapp-front';


const {
    NCIcon,
    NCFormControl
} = base;

const {
    Refer
} = high;


class QueryCondition extends BaseComponent {
    constructor(props) {
        super(props);

        this.loadActions();
        props.use.search('psnaccount2')
    }

    actions = {
        QCAction: QueryConditionAction
    }

    componentDidMount() {
        this.action.QCAction.init();
    }

    render() {
        const {
            form,
            reportQuery,
            MultiInit,
            search,
            meta,
            searchMan
        } = this.props;
        
        let template = meta.getMeta();

        return (
            <div className="report-query-condition-tab">
                <div>
                    {form.createForm(reportQuery.currentQueryForm, {
                        onAfterEvent: this.action.QCAction.afterFormEdit,
                        onBeforeEvent: this.action.QCAction.beforeFormEdit
                    })}
                </div>
                {
                    !reportQuery.reportWithoutTransfer.includes(reportQuery.currentTreeData) &&
                    <div className="report-query-condition-tab-transfer-wrapper">
                        <div className="report-query-condition-transfer-left">
                            <Transfer
                                MultiInit={MultiInit}
                                leftData={reportQuery.queryLeftData}
                                rightData={reportQuery.queryRightData}
                                onChange={this.action.QCAction.changeTransfer}
                                onBeforeEvent={this.action.QCAction.afterFormEdit}
                                onChecked={this.action.QCAction.checkedTransfer}
                                leftTitle={reportQuery.language['hrpub-000136']/** 待选薪资项目 */}
                                rightTitle={reportQuery.language['hrpub-000137']/** 已选薪资项目 */}
                            />
                        </div>
                        <div className="report-query-condition-transfer-right">
                            <div 
                                className="transfer-move-btn"
                                onClick={this.action.QCAction.moveItem('upp')}
                            >
                                <NCIcon  
                                    type="uf-2arrow-up"
                                />
                            </div>
                            <div 
                                className="transfer-move-btn"
                                onClick={this.action.QCAction.moveItem('up')}
                            >
                                <NCIcon 
                                    type="uf-arrow-up"
                                />
                            </div>
                            <div 
                                className="transfer-move-btn"
                                onClick={this.action.QCAction.moveItem('down')}
                            >
                                <NCIcon 
                                    type="uf-arrow-down"
                                />
                            </div>
                            <div 
                                className="transfer-move-btn"
                                onClick={this.action.QCAction.moveItem('downn')}
                            >
                                <NCIcon 
                                    type="uf-2arrow-down"
                                />
                            </div>
                        </div>
                        {
                            reportQuery.currentTreeData === '1001Z71000000000A3GT' &&
                            <div style={{
                                display: 'none'
                            }}>
                                {search.NCCreateSearch('psnaccount2', {
                                    clickSearchBtn: searchMan,
                                    onlyShowAdvArea: false,
                                    showAdvSearchPlanBtn: true,
                                    saveSearchPlan: true,
                                    oid: template['psnaccount2'].oid,
                                    onlyShowSuperBtn: true
                                })}
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default QueryCondition;