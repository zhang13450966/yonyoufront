

import React, {Component} from 'react';
import './busiComponent.less';

import { SimpleReport } from 'nc-report';

import Layout from '../../Layout';


import Base from './BaseComponent';

import OrgRefer from '../../referSearch/org';

import refs from '../store/refs';


const {Header, Left, Content} = Layout;

class BaseComponent extends Base {

    constructor(props) {
        super(props);
    
        this.renderSimpleComp = this.renderSimpleComp.bind(this);
        this.renderCommonTemplate = this.renderCommonTemplate.bind(this);
        this.renderGroup = this.renderGroup.bind(this);
    }

    renderSimpleComp() {
        const {
            button,
            asyncTree,
            search,
            reportQuery,
            dispatch
        } = this.props;

        return (
                <SimpleReport
                disposeSearch={this.action.simRep.disposeSearch}
                expandSearchVal={this.action.simRep.expandSearchVal}
                showHighSearchBtn={true}
                showAdvBtn={true}
                isNoSearchItem={reportQuery.ifHideSearchModal} 
                replaceAdvBody={reportQuery.showCustomSearchBody ? this.action.QCAction.renderCustomSearchBody : null}
                clickPlanEve={this.action.QCAction.displayItem}
                advSearchClearEve={this.action.QCAction.clearEve}
                addAdvTabs={this.action.QCAction.renderSearchTab()}
                isBusiRender={reportQuery.ifInit ? this.action.simRep.isBusiRender : null}
                ref={ref => {
                    this.simpleReportRef = ref;
                    refs.simpRepRef = ref;
                }}
                saveSearchPlan = {this.action.QCAction.saveProgramme}
                showAdvSearchPlanBtn={reportQuery.showAdvSearchPlanBtn}
                ownReportParams={{
                    userdefObj: {
                        keyReportParamWeb: this.action.simRep.processUserDefObj(),
                        CurrentReportOrg: reportQuery.orgValue ? reportQuery.orgValue.refpk : null,
                        keyIsHrQueryForWeb: 'ncchr'
                    }
                }}
            />
        );
    }
    renderCommonTemplate() {
        const {
            button,
            asyncTree,
            search,
            reportQuery,
            dispatch
        } = this.props;

        return (
            <Layout>
                <Content
                    style={{
                        height: '100%',
                        width: 'auto'
                    }}
                >
                    {
                        reportQuery.currentTreeData && 
                        this.renderSimpleComp()
                    }
                </Content>
            </Layout>
        );
    }
    renderOrganization(CustomRefer) {
        const {
            button,
            asyncTree,
            search,
            reportQuery,
            dispatch,
            DragWidthCom
        } = this.props;

        return (
            <Layout>
                <DragWidthCom
                    leftDom = {
                        <div>
                            <div
                            style={{
                                width: '220px',
                                marginTop: '10px',
                                marginBottom: '10px',
                                marginLeft: '20px',
                                display: 'block'
                            }}
                        >
                        {
                            CustomRefer ? 
                                <CustomRefer
                                    orgVal={reportQuery.orgValue}
                                    getOrgData={this.action.ReportQuery.changeOrgValue}
                                /> :
                                <OrgRefer
                                    orgVal={reportQuery.orgValue}
                                    getOrgData={this.action.ReportQuery.changeOrgValue}
                                />
                        }
                    </div>
                    <div 
                        style={{
                            position: 'relative',
                            paddingLeft: '14px',
                            height: `${reportQuery.pageHeight - 50}px`
                        }}
                        className="report-query-left-tree"
                    >
                        {asyncTree.createAsyncTree({
                            treeId: 'reportTree',
                            needSearch: false,
                            needEdit: false,    
                            checkable: false,
                            defaultExpandAll: false,
                            onSelectEve: this.action.ReportQuery.selectTree,
                            loadTreeData: this.action.ReportQuery.loadChildTree
                        })}
                    </div>
                    </div>
                    }
                    rightDom  = {
                        <div 
                        style={{
                            height: '100%',
                            width: 'auto'
                        }}
                        >
                             {
                        reportQuery.currentTreeData && 
                        this.renderSimpleComp()
                    }
                        </div> 
                    }
                defLeftWid= '250px'    // 默认左侧区域宽度，px/百分百
                leftMinWid= '180px'
                />
            </Layout>
        );
    }

    renderGroup() {
        const {
            button,
            asyncTree,
            search,
            reportQuery,
            dispatch,
            DragWidthCom
        } = this.props;
        return (
            <Layout>
                <DragWidthCom
                    leftDom={
                    <div 
                        style={{
                            position: 'relative',
                            height: `100%`,
                            paddingLeft: '14px'
                        }}
                        className="report-query-left-tree"
                    >
                        {asyncTree.createAsyncTree({
                            treeId: 'reportTree',
                            needSearch: false,
                            needEdit: false,    
                            checkable: false,
                            defaultExpandAll: false,
                            onSelectEve: this.action.ReportQuery.selectTree,
                            loadTreeData: this.action.ReportQuery.loadChildTree
                        })}
                        </div>
                    }
                    rightDom={
                        <div
                        style={{
                            // marginLeft: '250px',
                            height: '100%',
                            width: 'auto'
                        }}
                        >
                             {
                        reportQuery.currentTreeData && 
                        this.renderSimpleComp()
                    }
                        </div> 
                    }
                    defLeftWid= '250px'    // 默认左侧区域宽度，px/百分百
                    leftMinWid= '180px'
                />
            </Layout>
        );
    }
}

export default BaseComponent;