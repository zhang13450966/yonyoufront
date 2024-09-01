/*
 * @Author: zhaochyu 
 * @PageInfo: 承运商定义取消
 * @Date: 2020-02-10 12:41:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-30 09:55:01
 */
import { AREA } from '../../constance';
import { setBrowseStatusButton } from '../viewController/buttonController';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function cancelBtnClick() {
	// 执行取消操作提示
	showWarningDialog(
		getLangByResId(this, '4001CARRIERGROUP--000001'),
		getLangByResId(this, '4001CARRIERGROUP-000000'),
		{
			/* 国际化处理： 取消,确定要取消吗？*/
			beSureBtnClick: () => {
				this.props.editTable.cancelEdit(AREA.listTable);
				setBrowseStatusButton.call(this);
			}
		}
	);
}
