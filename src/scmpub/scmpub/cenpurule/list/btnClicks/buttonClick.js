/*
 * @Author: lichao 
 * @PageInfo: 点击按钮入口  
 * @Date: 2019-03-12 16:08:07 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-07-23 20:08:26
 */
import { STATUS, BUTTONS, AREACODE } from '../../constance';
import batchDelBtn from './batchDelBtnClick';
import outputBtnClick from './outputBtnClick';
import saveBtnClick from './saveBtnClick';
import printButtonClick from './printButtonClick';
import onRowClick from './onRowClick';
import reFresh from './reFresh';
import deleteButton from './deleteBtnClick';
import { viewController } from '../viewController';
import cancelBtnClick from './cancelBtnClick';
import { getBusinessInfo } from 'nc-lightapp-front';

export default function(props, id, text, record, index) {
	let businessInfo = getBusinessInfo();
	switch (id) {
		case BUTTONS.Add: //新增
			props.cardTable.addRow(AREACODE.listHead, undefined, {
				pk_group: { value: businessInfo.groupId, display: businessInfo.groupName }
			});
			props.cardTable.setTableData(AREACODE.listBody, { rows: [] }, null);
			this.selectIndex = props.cardTable.getNumberOfRows(AREACODE.listHead) - 1;
			viewController.call(this, props, STATUS.add);
			this.saveType = STATUS.add;
			break;
		case BUTTONS.Edit: //修改
			props.cardTable.focusRowByIndex(AREACODE.listHead, index);
			if (this.selectIndex != index) {
				onRowClick.call(this, props, AREACODE.listHead, record, index);
			}
			this.saveType = STATUS.edit;
			viewController.call(this, props, STATUS.edit);
			break;
		case BUTTONS.HeadDelLine: //删除行
			deleteButton.call(this, props, record);
			break;
		case BUTTONS.Delete: //批量删除
			batchDelBtn.call(this, props, record);
			break;
		case BUTTONS.Refresh: //刷新
			reFresh.call(this, props);
			break;
		case BUTTONS.Output: //输出
			outputBtnClick.call(this, props);
			break;
		case BUTTONS.Print: //打印
			printButtonClick.call(this, props);
			break;
		case BUTTONS.Save: //保存
			saveBtnClick.call(this, props);
			break;
		case BUTTONS.Cancel: //取消
			cancelBtnClick.call(this, props);
			break;
		case BUTTONS.BodyDelLine: //删除行
			let seldatas = props.cardTable.getCheckedRows(AREACODE.listBody);
			let selindex = seldatas.map((row) => {
				return row.index;
			});
			props.cardTable.delRowsByIndex(AREACODE.listBody, selindex);
			props.button.setButtonDisabled([ BUTTONS.BodyDelLine ], true);
			break;
		case BUTTONS.AddLine: //增行
			props.cardTable.addRow(AREACODE.listBody, undefined, {
				pk_group: { value: businessInfo.groupId, display: businessInfo.groupName }
			});
			break;
		case BUTTONS.AddLine1: //插行
			props.cardTable.addRow(AREACODE.listBody, index, {
				pk_group: { value: businessInfo.groupId, display: businessInfo.groupName }
			});
			break;
		case BUTTONS.BodyDelLine1: //删除行
			props.cardTable.delRowsByIndex(AREACODE.listBody, index);
			break;
		default:
			break;
	}
}
