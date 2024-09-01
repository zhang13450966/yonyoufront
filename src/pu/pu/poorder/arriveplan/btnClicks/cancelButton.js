/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划
 * @Date: 2018-06-09 13:16:54 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-01-09 15:16:10
 */
import { ARRIVEPLAN, STATUS } from '../../constance';
import { buttonController } from '../viewController/index';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function cancelButton() {
	showWarningDialog(getLangByResId(this, '4004POORDER-000019'), getLangByResId(this, '4004POORDER-000031'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			// 单表也需要适配 在浏览态时勾选行去掉勾选
			this.props.editTable.selectAllRows(ARRIVEPLAN.TABLEID, false);
			//回到页面上次状态
			this.props.editTable.cancelEdit(ARRIVEPLAN.TABLEID);
			buttonController.togglePageShow.call(this, this.props, STATUS.browse);
		}
	});
}
