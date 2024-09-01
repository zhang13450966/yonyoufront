/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划
 * @Date: 2018-06-09 13:16:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-01-04 14:50:38
 */
import { PAGECODE, STATUS, BUTTON } from '../../constance';
import { buttonController } from '../viewController/index';

export default function cancelButton() {
	//回到页面上次状态
	this.props.editTable.cancelEdit(PAGECODE.tableId);
	// 卡片界面，在浏览态时勾选行，点修改后去掉勾选
	this.props.editTable.selectAllRows(PAGECODE.tableId, false);
	buttonController.cancelBtn.call(this);
	buttonController.togglePageShow.call(this, this.props, STATUS.browse);
}
