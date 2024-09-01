/*
 * @Author: zhanghrh 
 * @PageInfo: 删行校验按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-11-19 09:46:56
 */
import { ajax } from 'nc-lightapp-front';
import { base } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

const { NCMessage } = base;
export default function delRowRule(props, conditionData, indexs, map, rownummap, srcpks) {
	let data;
	let indexsRows = [];
	let oldvoallRows = [];
	let allRow = this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let allRows = { rows: allRow };
	let errorMessage = '';
	ajax({
		url: URL.getCard,
		data: conditionData,
		method: 'POST',
		async: false,
		success: (res) => {
			if (res.data) {
				if (res.data.bodys && res.data.bodys[PAGECODE.cardbody]) {
					// this.props.cardTable.setTableData(
					// 	PAGECODE.cardbody,
					// 	res.data.bodys[PAGECODE.cardbody],
					// 	null,
					// 	true,
					// 	true
					// );
					oldvoallRows = res.data.bodys[PAGECODE.cardbody].rows;
					for (let i = 0; i < oldvoallRows.length; i++) {
						if (srcpks.includes(oldvoallRows[i].values.pk_order_b.value)) {
							indexsRows.push(oldvoallRows[i]);
						}
					}
					// this.props.cardTable.setTableData(PAGECODE.cardbody, allRows, null, true, true);
				}

				for (let i = 0; i < indexsRows.length; i++) {
					let naccumarrvnum = indexsRows[i].values.naccumarrvnum.value;
					let naccumstorenum = indexsRows[i].values.naccumstorenum.value;
					let naccuminvoicenum = indexsRows[i].values.naccuminvoicenum.value;
					let naccumdevnum = indexsRows[i].values.naccumdevnum.value;
					naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
					naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
					naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
					naccumdevnum = naccumdevnum == null ? 0 : naccumdevnum;
					let binvoiceclose = indexsRows[i].values.binvoiceclose.value; //开票关闭
					let barriveclose = indexsRows[i].values.barriveclose.value; //到货关闭
					let bpayclose = indexsRows[i].values.bpayclose.value; //付款关闭
					let bstockclose = indexsRows[i].values.bstockclose.value; //入库关闭
					// this.props.form.getValByKeyAndRowId
					let crowno = rownummap.get(indexsRows[i].values.pk_order_b.value);
					if (
						naccumarrvnum > 0 ||
						naccumstorenum > 0 ||
						naccuminvoicenum > 0 ||
						naccumdevnum > 0 ||
						binvoiceclose ||
						barriveclose ||
						bpayclose ||
						bstockclose
					) {
						errorMessage = errorMessage + getLangByResId(this, '4004ORDERREVISE-000005', { 0: crowno });
					} else {
						this.delindex.push(map.get(indexsRows[i].values.pk_order_b.value));
						// props.cardTable.delRowsByIndex(PAGECODE.cardbody, i);
						// materialSelected(props);
					}
				}
			}
		}
	});
	return errorMessage;
}
function materialSelected(props) {
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.StockQuery]: rowsflag
	};
	props.button.setDisabled(disableArr);
}
