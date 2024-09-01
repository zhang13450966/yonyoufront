/*
 * @Author: zhaochyu 
 * @PageInfo: 按钮控制
 * @Date: 2020-02-10 14:13:17 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-06-15 13:51:09
 */
import { AREA } from '../../constance';
function setEditStatusButton() {
    this.setState({
        status: 'edit'
    });
    this.props.button.setButtonVisible(
        ["Edit", "Refresh", "StartUse", "StopUse", "PrintPop", "Output"],
        false
    );
    this.props.button.setButtonVisible(
        ["Add", "Delete", "Save", "Cancel"],
        true
    );
    this.props.button.setButtonDisabled(
        ["Save", "Cancel"],
        false
    );
}
function setBrowseStatusButton() {
    this.setState({
        status: 'browse'
    });
    this.props.button.setButtonVisible(
        ["Add", "Delete", "Edit", "Refresh", "PrintPop", "Output"],
        true
    );
    this.props.button.setButtonVisible(
        ["Save", "Cancel"],
        false
    );
}
/**
 * //根据勾选行控制肩部按钮
 * 
 *
 */
function lineSelected(props) {

    let rows = props.table.getCheckedRows(AREA.listTable);
    let trueFlag = true;
    // 初始化全部不可见
    let Delete = trueFlag;
    let StartUse = trueFlag;
    let StopUse = trueFlag;
    let PrintPop = trueFlag;
    let Output = trueFlag;
    let Edit = trueFlag;
    //选择数据时，区分一条或者多选  只有选择数据的时候才控制按钮
    if (rows.length > 1) {
        StartUse = false;
        StopUse = false;
        Output = false;
        PrintPop = false;
        Delete = false;
        Edit = false;
    } else if (rows.length == 1) {
        rows.map((item) => {
            let bsealflag = item.data.values.bsealflag.value;
            if (bsealflag == true) {
                StartUse = false;
                StopUse = true;
            } else if (bsealflag === false) {
                StartUse = true;
                StopUse = false;
            }
        });
        Edit = false;
        Delete = false;
        Output = false;
        PrintPop = false;
    }

    let disableArr = {
        "Refresh": false,
        "Delete": Delete,
        "Edit": Edit,
        "StartUse": StartUse,
        "StopUse": StopUse,
        "PrintPop": PrintPop,
        "Output": Output
    };
    props.button.setDisabled(disableArr);
}
export { setEditStatusButton, setBrowseStatusButton, lineSelected }
