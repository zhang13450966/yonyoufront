/*
 * @Author: wangceb
 * @PageInfo: 删行按钮点击事件
 * @Date: 2018-05-21 15:05:52
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-03-14 16:31:20
 */

import { POSITION_CONST, URL } from '../../../const';
import buttonController from '../../../list/viewController/buttonController';
import { showWarningInfo } from '../../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function delete_BtnClick(props, record, index) {
	let delIndexes = [];
	if (index !== undefined) {
		delIndexes.push(index);
	} else {
		let seldatas = this.props.cardTable.getCheckedRows(POSITION_CONST.DOWNTABLEID);
		if (seldatas.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4004POSITION-000007')); /* 国际化处理： 请选择数据！*/
		}
		seldatas.forEach(item => {
			delIndexes.push(item.index);
		});
	}
	this.props.cardTable.delRowsByIndex(POSITION_CONST.DOWNTABLEID, delIndexes);
	buttonController.call(this, this.props, POSITION_CONST.EDIT_STATUS);
}
