/*
 * @Author: fangmj 
 * @PageInfo: 进度确认单卡片态按钮 批量删除行
 * @Date: 2022-01-28 10:17:14 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-21 20:39:08
 */
import { toast } from 'nc-lightapp-front';
import { AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	let _this = this;
	let selectedRow = _this.props.cardTable.getCheckedRows(AREA.body);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(_this, '4004planconfirm-000016') /* 国际化处理： 请选择数据！*/
		});
		return;
	}
	let rowparam = [];
	selectedRow.map((item) => {
		rowparam.push(item.index);
	});
	_this.props.cardTable.delRowsByIndex(AREA.body, rowparam);
	let checks = _this.props.cardTable.getCheckedRows(AREA.body);
	if (!checks || checks == null || checks.length == 0) {
		_this.props.button.setButtonDisabled([ 'DeleteLine' ], true);
	} else {
		_this.props.button.setButtonDisabled([ 'DeleteLine' ], false);
	}
}
