/*
 * @Author: zhaochyu
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-28 19:34:59 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-11-19 15:14:16
 */
import addBtnClick from './addBtnClick';
import rowDeleteBtnClick from './rowDeleteBtnClick';
import calBtnClick from './calBtnClick';
import simpleClick from './simpleClick';
import saveBtnClick from './saveBtnClick';
import editBtnClick from './editBtnClick';
import refreshBtnClick from './refreshBtnClick';
import bodyRowBtnclick from './bodyRowBtnclick';
import addLineBtnClick from './addLineBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { toast } from 'nc-lightapp-front';
import { BUTTON, PAGECODE } from '../../constance';
export { addBtnClick, rowDeleteBtnClick, simpleClick, saveBtnClick, editBtnClick, refreshBtnClick };
export function buttonClick(props, key, record, index) {
	switch (key) {
		case BUTTON.Add: // 新增
			addBtnClick.call(this, props);
			break;
		case BUTTON.Cancel: // 取消
			calBtnClick.call(this, props);
			break;
		case BUTTON.Edit: // 修改
			editBtnClick.call(this, props, record, index);
			break;
		case BUTTON.Delete: // 删除
			rowDeleteBtnClick.call(this, props, record, index);
			break;
		case BUTTON.Save: // 保存
			saveBtnClick.call(this, props, record);
			break;
		case BUTTON.Refresh: // 刷新
			refreshBtnClick.call(this, props, record);
			break;
		case BUTTON.AddLine: // 增行
			addLineBtnClick.call(this, props, record);
			break;
		case BUTTON.RowDelete: // 删行
			let bodyrow = props.editTable.getNumberOfRows(PAGECODE.bodyId);
			if (bodyrow > 1) {
				bodyRowBtnclick.call(this, props, index);
			} else if (bodyrow == 1) {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004COSTFACTOR-000003') /* 国际化处理： 至少存在一行费用物料！*/
				});
			}
			break;
	}
}
