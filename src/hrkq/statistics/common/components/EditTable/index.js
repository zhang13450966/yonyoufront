import React, {Component} from 'react';

// import { base, high } from 'nc-lightapp-front';

// let { ApproveDetail } = high;
import ApproveDetail from 'uap/common/components/ApproveDetail';

export default class extends Component {
    constructor(props) {
        super(props);
        props.use.editTable(props.tableId)
        this.state = {};
    }

    render() {
        const {
            state,
            state: {
                showApprove,
                approveData = {}
            },
            props,
            props: {
                tableId,
                height,
                onRowDoubleClick,
                showCheck,
                cancelCustomRightMenu,
                editTable: {createEditTable}
            }
        } = this;
        return (<div className="edit-table-wrap flex-container" style={{height: height}}>
            {/* 流程历史 */}
            {approveData.billtype && approveData.billid &&
            <ApproveDetail show={showApprove}
                           close={() => {
                               this.setState({
                                   showApprove: false
                               })
                           }}
                           billtype={approveData.billtype}    // 此处billtype为交易类型
                           billid={approveData.billid}
            />
            }

            {/* 主表 */}
            {createEditTable(tableId, {
                cancelCustomRightMenu,
                showCheck,
                height,
                onRowDoubleClick
            })}
        </div>);
    }
}
