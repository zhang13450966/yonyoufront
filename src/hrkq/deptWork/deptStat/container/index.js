import render from 'src/hrpub/common/frame/render';
import MainAction from '../actions/main';
import {createPage, base, high} from 'nc-lightapp-front';
import Header from '../components/Header';
import ListTable from '../components/ListTable';
import DayListTable from '../components/ListTable/dayReport';
import MonthListTable from '../components/ListTable/monthReport';
import CardDetail from '../components/card';
import SearchCom from '../components/common/search-com';

const {NCTabs, NCAffix, NCDatePicker, NCButton} = base;
// const { ApproveDetail } = high;
import ApproveDetail from 'uap/common/components/ApproveDetail';
// import NewApproveDetail from '../../../../hrpub/common/components/newApproveDetail/index.js'

const NCTabPane = NCTabs.NCTabPane;

import './index.less';
import emitter from '../actions/emitterAction';

const Homepage = render({
    actions: {
        mainAction: MainAction
    }
})(({props, action, state}) => {
    props.use.form(
        'leave_card',
        'overtime_card',
        'trip_card'
    )
    props.use.editTable('leave_list', 'overtime_list', 'trip_list', 'month_list', 'day_list')
    const {mainAction} = action
    const {deptStat} = props
    const { tabs=[] } = deptStat
    return (
        <div className="deptWork_deptStat">
            <NCAffix>
                <Header {...props} />
            </NCAffix>
            <div className="table-content">
                <NCTabs navtype="turn"
                        flex={true}
                        style={{display: deptStat.showMode === 'card' ? 'none' : ''}}
                        contenttype="moveleft"
                        defaultActiveKey={deptStat.activeTab}
                        tabBarPosition="top"
                        onChange={mainAction.tabChange}>
                    <NCTabPane tab={deptStat.lang['hrkq-0000119']} key="day">
                        <SearchCom
                            type="range"
                            deptStat={deptStat}
                            showExport={true}
                            exportData={mainAction.exportDayToExcel}
                            defaultOptionValue={deptStat.defaultDept}
                            deptOptions={deptStat.deptOptions}
                            onSearchEmit={mainAction.queryList}
                            onDeptChange={mainAction.onDeptChange}
                            emitter={emitter}
                            emitType={'day'}
                        />
                        {deptStat.deptAvailable &&
                        <DayListTable
                            {...props}
                            tableCode="day_list"
                            pageInfo={deptStat.dayPageInfo}
                            dayData={deptStat.dayData}
                            dayCol={deptStat.dayCol}
                            pageIndexChange={mainAction.handlePageIndexChange}
                            pageSizeChange={mainAction.handlePageSizeChange}
                            height={deptStat.clientHeight}
                            initList={mainAction.queryDayList}
                            emitter={emitter}
                            emitType={'day'}
                            type="day"/>}
                    </NCTabPane>
                    <NCTabPane tab={deptStat.lang['hrkq-0000120']} key="month">
                        <SearchCom
                            type="one"
                            deptStat={deptStat}
                            showExport={true}
                            exportData={mainAction.exportMonthToExcel}
                            defaultOptionValue={deptStat.defaultDept}
                            deptOptions={deptStat.deptOptions}
                            onSearchEmit={mainAction.queryList}
                            onDeptChange={mainAction.onDeptChange}
                            emitter={emitter}
                            emitType={'month'}
                        />
                        <MonthListTable
                            {...props}
                            initList={mainAction.queryMonthList}
                            tableCode="month_list"
                            height={deptStat.clientHeight}
                            pageInfo={deptStat.monthPageInfo}
                            pageIndexChange={mainAction.handlePageIndexChange}
                            pageSizeChange={mainAction.handlePageSizeChange}
                            monthData={deptStat.monthData}
                            monthCol={deptStat.monthCol}
                            emitter={emitter}
                            emitType={'month'}
                            type="month"/>
                    </NCTabPane>
                    {tabs.includes('leave') && <NCTabPane tab={deptStat.lang['hrkq-0000121']} key="leave">
                        <SearchCom
                            type="range"
                            deptStat={deptStat}
                            defaultOptionValue={deptStat.defaultDept}
                            deptOptions={deptStat.deptOptions}
                            onSearchEmit={mainAction.queryList}
                            onDeptChange={mainAction.onDeptChange}
                            emitter={emitter}
                            emitType={'leave'}
                        />
                        <ListTable {...props} tableCode="leave_list" emitter={emitter} emitType={'leave'} type="leave"/>
                    </NCTabPane>}
                    {tabs.includes('overtime') && <NCTabPane tab={deptStat.lang['hrkq-0000122']} key="overtime">
                        <SearchCom
                            deptStat={deptStat}
                            type="range"
                            defaultOptionValue={deptStat.defaultDept}
                            deptOptions={deptStat.deptOptions}
                            onSearchEmit={mainAction.queryList}
                            onDeptChange={mainAction.onDeptChange}
                            emitter={emitter}
                            emitType={'overtime'}
                        />
                        <ListTable {...props} tableCode="overtime_list" emitter={emitter} emitType={'overtime'}
                                   type="overtime"/>
                    </NCTabPane>}
                    {tabs.includes('trip') && <NCTabPane tab={deptStat.lang['hrkq-0000123']} key="trip">
                        <SearchCom
                            type="range"
                            deptStat={deptStat}
                            defaultOptionValue={deptStat.defaultDept}
                            deptOptions={deptStat.deptOptions}
                            onSearchEmit={mainAction.queryList}
                            onDeptChange={mainAction.onDeptChange}
                            emitter={emitter}
                            emitType={'trip'}
                        />
                        <ListTable {...props} tableCode="trip_list" emitter={emitter} emitType={'trip'} type="trip"/>
                    </NCTabPane>}
                </NCTabs>
                <CardDetail {...props} formCode="leave_card"></CardDetail>
                <CardDetail {...props} formCode="overtime_card"></CardDetail>
                <CardDetail {...props} formCode="trip_card"></CardDetail>
                <ApproveDetail
                    {...props}
                    show={deptStat.showApproveDetail}
                    close={mainAction.closeApproveDetailDialog}
                    billtype={deptStat.billtype}
                    billid={deptStat.billId}/>
            </div>
        </div>
    )
});

export default createPage({})(Homepage)
