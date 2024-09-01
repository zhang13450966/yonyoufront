/*
 * @Author: 王龙华
 * @PageInfo: 保存按钮点击事件
 * @Date: 2018-05-21 14:41:09
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-23 10:02:50
 */

import { ajax } from 'nc-lightapp-front';
import { POSITION_CONST, URL } from '../../const';
import buttonController from '../../list/viewController/buttonController';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getSaveData, updateTableData } from 'scmpub/scmpub/components/VerticalEditTable';

export default function save_BtnClick(props) {
	this.isCopyLine = false;
	// props.cardTable.filterEmptyRows(POSITION_CONST.DOWNTABLEID, ['pk_pricecondition'], 'include');
	let flag = props.validatePageToToast([
		{
			// createCardTable的areaCode，多页签区域填主表就行
			name: [ POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID ],
			type: 'cardTable'
		}
	]);
	if (!flag.allPassed) {
		return;
	}
	let bill = getSaveData.call(this, POSITION_CONST.PAGECODE, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID);

	props.validateToSave(bill, () => {
		ajax({
			url: URL.SAVE,
			data: bill,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							[POSITION_CONST.UPTABLEID]: 'cardTable',
							[POSITION_CONST.DOWNTABLEID]: 'cardTable'
						}
					);
				}
				if (res.data) {
					updateTableData.call(this, res.data, POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID);
				}
				showSuccessInfo(getLangByResId(this, '4004POSITION-000010')); /* 国际化处理： 保存成功*/
				// 控制按钮状态
				buttonController.call(this, props, POSITION_CONST.BROWSER_STATUS);
			}
		});
	});
}
