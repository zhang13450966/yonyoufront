/*
 * @Author: chaiwx 
 * @PageInfo: 表体增行  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-20 13:31:10
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELDS, PAGECODE, REQUESTURL } from '../../constance';
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';
import { simplifyData } from '../../../../../scmpub/scmpub/pub/tool/simplifyDataUtil';

export default function(props) {
	let billData = props.createMasterChildData(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);

	// 替换表体数据为选中行数据
	billData.body[AREA.cardTableId].rows = [];
	let feeCrowno = 10; //新增行的行号（crowno）
	// 所有行数
	let rowcount = props.cardTable.getNumberOfRows(AREA.cardTableId);
	for (let i = rowcount - 1; i > -1; i--) {
		let crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, i, FIELDS.crowno);
		if (crowno && crowno.value) {
			feeCrowno = parseInt(crowno.value) + 10;
			break;
		}
	}

	// 删除display/scale 优化上行流量
	billData.head[AREA.cardFormId] = simplifyData(billData.head[AREA.cardFormId]);
	let data = {
		billData: billData,
		feeCrowno: feeCrowno
	};
	ajax({
		url: REQUESTURL.addFeeLine,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				if (res.data.body && res.data.body[AREA.cardTableId]) {
					let rowCount = props.cardTable.getNumberOfRows(AREA.cardTableId);
					props.cardTable.addRow(AREA.cardTableId, rowCount, res.data.body[AREA.cardTableId].rows[0].values);
					// RownoUtils.setRowNo(props, AREA.cardTableId, FIELDS.crowno);
				}
				props.cardTable.selectAllRows(AREA.cardTableId, false);
			}
		}
	});
}
