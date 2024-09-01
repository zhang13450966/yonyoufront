/*
 * @Author: zhaochyu 
 * @PageInfo: 按钮控制
 * @Date: 2020-01-15 16:31:34 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2020-01-16 09:57:43
 */
function setEditStatusButton() {
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
    this.props.button.setButtonVisible(
        ["Add", "Delete", "Edit", "Refresh", "StartUse", "StopUse", "PrintPop", "Output"],
        true
    );
    this.props.button.setButtonVisible(
        ["Save", "Cancel"],
        false
    );
}
export { setEditStatusButton, setBrowseStatusButton }