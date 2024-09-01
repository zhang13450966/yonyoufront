/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮 批量删除行
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
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
			content: getLangByResId(_this, '4004ARRIVAL-000007') /* 国际化处理： 请选择数据！*/
		});
		return;
	}
	let rowparam = [];
	selectedRow.map((item) => {
		rowparam.push(item.index);
	});
	_this.props.cardTable.delRowsByIndex(AREA.body, rowparam);
	let checks = props.cardTable.getCheckedRows(AREA.body);
	if (!checks || checks == null || checks.length == 0) {
		_this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], true);
	} else {
		_this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], false);
	}
}
