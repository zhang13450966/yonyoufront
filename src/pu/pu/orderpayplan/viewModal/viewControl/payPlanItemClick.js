/*
 * @Author: heyfn
 * @Description: 付款计划弹框切换表头时加载表体确认单数据
 * @Date: 2022-01-21 10:18:35
 * @LastEditors: heyfn
 * @LastEditTime: 2022-01-26 13:50:35
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD } from '../../constance/index';
function onSelect() {
	// 获取表头选中行数据
	let checkArr = this.props.table.getClickRowIndex(PAGECODE.itemBodyCode);
	// let pk_order_payplan_b = checkArr.length > 0 ? checkArr[0].data.values.pk_order_payplan_b.value : '';
	let pk_order_payplan_b = checkArr.record.values[FIELD.bid].value;
	let cunitid = checkArr.record.values[FIELD.cunitid].value;
	// 封装参数信息
	let param = {
		pk: pk_order_payplan_b,
		cunitid,
		itemConfirmBodyCode: PAGECODE.itemConfirmBodyCode,
		[FIELD.pagecode]: PAGECODE.unioDetailed
	};
	if (pk_order_payplan_b) {
		ajax({
			url: URL.queryUnioDetailedByPayplanbId,
			data: param,
			success: (res) => {
				if (res.success && res.error == null) {
					if (
						res.data &&
						res.data[PAGECODE.itemConfirmBodyCode] &&
						res.data[PAGECODE.itemConfirmBodyCode].rows
					) {
						this.props.table.setAllTableData(
							PAGECODE.itemConfirmBodyCode,
							res.data[PAGECODE.itemConfirmBodyCode]
						);
					} else {
						this.props.table.setAllTableData(PAGECODE.itemConfirmBodyCode, { rows: [] });
					}
				}
			}
		});
	}
}

export { onSelect };
