/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮报检处理  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { ajax, toast } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREA, PAGECODE } from '../../constance';

import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function() {
	let _this = this;
	let rows = this.props.cardTable.getCheckedRows(AREA.table);
	if (rows.length < 1) {
		toast({ content: getLangByResId(_this, '4004ARRIVAL-000008'), color: 'warning' }); /* 国际化处理： 请选择数据*/
	}
	let pkTsParams = rows.map((row) => {
		return {
			pk: row.data.values.pk_arriveorder_b.value,
			ts: row.data.values.ts.value
		};
	});
	// let pkindex = rows.map((row) => {
	// 	return {
	// 		pk: row.data.values.pk_arriveorder_b.value,
	// 		index: row.index
	// 	};
	// });
	let pkIndex = {};
	for (let i = 0; i < rows.length; i++) {
		pkIndex[rows[i].data.values.pk_arriveorder_b.value] = rows[i].index;
	}

	ajax({
		method: 'post',
		url: URL.verify,
		data: {
			pageid: PAGECODE.card,
			pkTsParams: pkTsParams
		},
		success: function(res) {
			if (res && res.data && res.data.body) {
				let datas = res.data.body[AREA.body].rows.map((row) => {
					return {
						index: pkIndex[row.values.pk_arriveorder_b.value],
						data: row
					};
				});
				_this.props.cardTable.updateDataByIndexs(AREA.body, datas);
				// _this.props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
			}
			if (res && res.data && res.data.head) {
				_this.props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
			}
			if (_this.props.getUrlParam('type')) {
				// let index = _this.props.transferTable.getTransferTableSelectedId();
				_this.props.transferTable.setTransferListValueByIndex(AREA.leftarea, res.data, _this.state.index);
			}
			showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000013')); /* 国际化处理： 报检成功*/
		}
	});
}
