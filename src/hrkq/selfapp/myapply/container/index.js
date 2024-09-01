import render from 'src/hrpub/common/frame/render';
import MainAction from '../actions/main';
import HeaderAction from '../actions/headerAction';
import { createPage, base } from 'nc-lightapp-front';
import Header from '../components/Header';
import ListTable from '../components/ListTable';
import CardDetail from '../components/card';
const { NCTabs, NCAffix } = base;
import ApproveDetail from 'uap/common/components/ApproveDetail';
import ApprovalTrans from 'uap/common/components/approvalTrans';
const NCTabPane = NCTabs.NCTabPane;

import './index.less';
import {getAppPageConfig} from "../../../../hrpub/common/utils/utils";

const Homepage =  render({
    actions: {
        mainAction: MainAction,
        headerAction: HeaderAction
    }
})(({props, action, state}) => {
    props.use.form(
        'attendance_card',
        'outside_card',
        'leave_card',
        'overtime_card',
        'trip_card',
        // add by chnjma 增加公出申请页面
        'gctrip_card',
        'tripoff_card',
        'leaveoff_card'
    )
    props.use.editTable(
        'attendance_list',
        'outside_list',
        'leave_list',
        'overtime_list',
        'trip_list',
        // add by chnjma 增加公出申请页面
        'gctrip_list',
    )
    // props.use.search('head_query')
    const { mainAction, headerAction } = action
    const { myLeave } = props
    const {visibleList = []} = myLeave
    return (
        <div className="selfapp_myapply flex-container">
            <NCAffix>
                <Header { ...props } />
            </NCAffix>
            <div className="table-content">
                {myLeave.activeTab && <NCTabs navtype="turn"
                        style={{display: myLeave.showMode === 'card' ? 'none' : ''}}
                        contenttype="moveleft" 
                        defaultActiveKey={myLeave.activeTab}
                        tabBarPosition="top"
                        className={myLeave.showMode === 'card' ? 'hidden' : ''}
                        onChange={mainAction.tabChange} >
                    {visibleList.includes('attendance_list') &&
                        <NCTabPane tab={myLeave.json['6040-000016']} key="attendance">
                    {myLeave.templateInited && <ListTable { ...props } tableCode="attendance_list" type="attendance" />}
                    </NCTabPane>}
                    {visibleList.includes('outside_list') && <NCTabPane tab={myLeave.json['6040-000017']} key="outside">
                        <ListTable { ...props } tableCode="outside_list" type="outside" />
                    </NCTabPane>}
                    {visibleList.includes('leave_list') && <NCTabPane tab={myLeave.json['6040-00008']} key="leave">
                        <ListTable { ...props } tableCode="leave_list" type="leave" />
                    </NCTabPane>}
                    {visibleList.includes('overtime_list') &&
                        <NCTabPane tab={myLeave.json['6040-00009']}  key="overtime">
                        <ListTable { ...props } tableCode="overtime_list" type="overtime" />
                    </NCTabPane>}
                    {visibleList.includes('trip_list') && <NCTabPane tab={myLeave.json['6040-000010']} key="trip">
                        <ListTable { ...props } tableCode="trip_list" type="trip" />
                    </NCTabPane>}
                    {visibleList.includes('gctrip_list') && <NCTabPane tab={myLeave.json['6040-000037']} key="trip">
                        <ListTable { ...props } tableCode="gctrip_list" type="trip" />
                    </NCTabPane>}
                </NCTabs>}
                {myLeave.templateInited && <React.Fragment>
                    <CardDetail { ...props } formCode="attendance_card"></CardDetail>
                    <CardDetail { ...props } formCode="outside_card"></CardDetail>
                    <CardDetail { ...props } formCode="leave_card"></CardDetail>
                    <CardDetail { ...props } formCode="overtime_card"></CardDetail>
                    <CardDetail { ...props } formCode="trip_card"></CardDetail>
                    <CardDetail { ...props } formCode="gctrip_card"></CardDetail>
                    <CardDetail { ...props } formCode="tripoff_card"></CardDetail>
                    <CardDetail { ...props } formCode="leaveoff_card"></CardDetail>
                </React.Fragment>}
                <ApproveDetail
                    show={myLeave.showApproveDetail}
                    close={mainAction.closeApproveDetailDialog}
                    billtype={myLeave.billtype}
                    billid={myLeave.billId}/>
                {myLeave.assignedDisplay ? <ApprovalTrans
                    title={myLeave.json['6040-000032']}/* 国际化处理： 指派*/
                    data={myLeave.assignedData}
                    display={myLeave.assignedDisplay}
                    getResult={headerAction.assignedBill}
                    cancel={headerAction.cancelAssigned}
                /> : ""}
            </div>
        </div>
    )
});

export default createPage({
    billinfo: [{
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'leave_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'trip_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'gctrip_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'attendance_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'outside_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'overtime_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'leaveoff_card'
    }, {
        billtype: 'form',
        pagecode: getAppPageConfig().appcode,
        headcode: 'tripoff_card'
    }]
})(Homepage)