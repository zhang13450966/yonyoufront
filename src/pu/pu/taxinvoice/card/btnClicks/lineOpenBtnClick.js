/*
 * @Author: chaiwx 
 * @PageInfo: 行关闭
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-28 18:19:58
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, REQUESTURL, PAGECODE, FIELDS } from '../../constance';
import { simplifyData } from '../../../../../scmpub/scmpub/pub/tool/simplifyDataUtil';
import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';

export default function(props, record, index) {
	let billData = props.createMasterChildData(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);
	let rows = billData.body.body.rows;
	let bodyRows = [];
	bodyRows.push(record);
	if (index < rows.length - 1) {
		for (let i = index + 1; i < rows.length; i++) {
			let crowno = rows[i].values[FIELDS.crowno];
			if (crowno && crowno.value) {
				break;
			} else {
				bodyRows.push(rows[i]);
			}
		}
	}

	// 替换表体数据为选中行数据
	billData.body.body.rows = bodyRows;

	// 删除display/scale 优化上行流量
	billData.head[AREA.cardFormId] = simplifyData(billData.head[AREA.cardFormId]);
	billData.body[AREA.cardTableId] = simplifyData(billData.body[AREA.cardTableId]);

	ajax({
		url: REQUESTURL.lineOpen,
		data: billData,
		success: (res) => {
			if (res.success && res.data) {
				if (res.data.head && res.data.head.head && res.data.body && res.data.body.body) {
					updateDtaForCompareByPk.call(this, props, res.data, {
						headAreaId: AREA.cardFormId,
						bodyAreaId: AREA.cardTableId,
						bodyPKfield: FIELDS.cbill_bid
					});
				}
				props.cardTable.selectAllRows(AREA.cardTableId, false);
			}
		}
	});
}
