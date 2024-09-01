/*
 * @Author: zhangjyp 
 * @PageInfo: 取消按钮点击事件 
 * @Date: 2018-04-19 15:27:51 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-13 13:33:34
 */
import { showCancelDialog } from '../../../pub/tool/messageUtil.js';
import { buttonControl } from '../viewController/buttonController';
export default function cancel_BtnClick(props) {
	showCancelDialog({
		beSureBtnClick: beSure_BtnClick.bind(this, this.props)
	});
}
function beSure_BtnClick(props) {
	setTimeout(() => {
		props.editTable.cancelEdit(this.tableId);
		this.props.editTable.selectAllRows(this.tableId, false);
		buttonControl.call(this);
	}, 0);
}
