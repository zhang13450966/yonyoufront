/*
 * @Author: lichao 
 * @PageInfo:批量保存
 * @Date: 2019-03-08 14:21:43 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:53:30
 */

import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS, AREACODE } from '../../constance';
import { getSaveData, updateTableData } from 'scmpub/scmpub/components/VerticalEditTable';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function saveButton(props) {
	let url = this.saveType == STATUS.add ? URL.save : URL.update;
	props.cardTable.filterEmptyRows(AREACODE.listBody, [ FIELD.pk_group ]);
	if (!props.cardTable.checkTableRequired(AREACODE.listHead)) return;
	if (!props.cardTable.checkTableRequired(AREACODE.listBody)) return;
	let bill = getSaveData.call(this, PAGECODE, AREACODE.listHead, AREACODE.listBody);
	let pk_cenpurule = bill.head[AREACODE.listHead].rows[0].values.pk_cenpurule.value;
	bill.body[AREACODE.listBody].rows.map((row) => {
		row.values.pk_cenpurule = { value: pk_cenpurule };
	});
	this.props.validateToSave(bill, () => {
		ajax({
			url: url,
			method: 'post',
			data: bill,
			success: (res) => {
				if (res && res.success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg, {
							[AREACODE.listHead]: 'cardTable',
							[AREACODE.listBody]: 'cardTable'
						});
					}
					if (res.data) {
						updateTableData.call(this, res.data, AREACODE.listHead, AREACODE.listBody);
					}
					showSuccessInfo(getLangByResId(this, '4001CENPURULE-000003')); /* 国际化处理： 保存成功！*/
					viewController.call(this, props, STATUS.browse);
				}
			}
		});
	});
}
