/*
 * @Author: chaiwx 
 * @PageInfo: 表体增物料行  
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-26 15:29:51
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FIELDS, PAGECODE, REQUESTURL } from '../../constance';
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';
import { simplifyData } from '../../../../../scmpub/scmpub/pub/tool/simplifyDataUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	let checkArr = props.cardTable.getCheckedRows(AREA.cardTableId);
	let index = -1;
	for (let i = 0; i < checkArr.length; i++) {
		let crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, checkArr[i].index, FIELDS.crowno);
		if (crowno && crowno.value) {
			index = checkArr[i].index;
			break;
		}
	}
	if (index == -1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000000')); //请选择费用行
		return;
	}

	let billData = props.createMasterChildData(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);
	let rowCount = props.cardTable.getNumberOfRows(AREA.cardTableId);
	let addRowCount = rowCount;
	// 替换表体数据为选中行数据
	billData.body[AREA.cardTableId].rows = [];
	let creceivecustid = null; //获取该物料行对应的费用行的收货客户
	let crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, index, FIELDS.crowno);
	if (crowno && crowno.value) {
		creceivecustid = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, index, FIELDS.creceivecustid).value;

		for (let i = index + 1; i < rowCount; i++) {
			let crowno = props.cardTable.getValByKeyAndIndex(AREA.cardTableId, i, FIELDS.crowno);
			if (crowno && crowno.value) {
				addRowCount = i;
				break;
			}
		}
	}
	// 删除display/scale 优化上行流量
	billData.head[AREA.cardFormId] = simplifyData(billData.head[AREA.cardFormId]);
	let data = {
		billData: billData,
		creceivecustid: creceivecustid
	};
	ajax({
		url: REQUESTURL.addMatLine,
		data: data,
		success: (res) => {
			if (res.success && res.data) {
				if (res.data.body && res.data.body[AREA.cardTableId]) {
					props.cardTable.addRow(
						AREA.cardTableId,
						addRowCount,
						res.data.body[AREA.cardTableId].rows[0].values
					);
					// RownoUtils.setRowNo(props, AREA.cardTableId, FIELDS.crowno);
				}
				props.cardTable.selectAllRows(AREA.cardTableId, false);
			}
		}
	});
}
