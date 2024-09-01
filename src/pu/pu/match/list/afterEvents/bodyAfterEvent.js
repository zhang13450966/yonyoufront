/*
 * @Author: xiahui
 * @PageInfo: 编辑后事件
 * @Date: 2019-06-22 17:11:02
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-30 14:30:03
 */
import { FIELDS } from '../../constance';
import { getIVMInvoiceClickRow } from '../utils/matchUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function bodyAfterEvent(props, moduleId, key, value, rows, index, record) {
	if (key === FIELDS.basicunit || key === FIELDS.mainquantity || key === FIELDS.iinvexchrate) {
		/** 进项发票字段编辑后 */
		// 新旧相同，不触发
		let newvalue = rows[0].newvalue.value == '' ? null : rows[0].newvalue.value;
		let oldvalue = rows[0].oldvalue.value == '' ? null : rows[0].oldvalue.value;
		if (newvalue == oldvalue) {
			return;
		}

		if (key === FIELDS.basicunit) {
			// 主单位：如果主单位与计量单位相同，则换算率设为1.0/1.0，并连动主数量
			let jldw = props.editTable.getValByKeyAndIndex(moduleId, index, FIELDS.jldw).value;
			if (jldw === newvalue) {
				// 换算率
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.iinvexchrate, { value: '1.0/1.0' });
				let xmsl = props.editTable.getValByKeyAndIndex(moduleId, index, FIELDS.xmsl).value; // 数量
				// 主数量
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.mainquantity, { value: xmsl });
			}
		} else if (key === FIELDS.mainquantity) {
			// 主数量
			// 换算率=主数量 / 数量
			let xmsl = props.editTable.getValByKeyAndIndex(moduleId, index, FIELDS.xmsl).value; // 数量
			// 换算率
			let iinvexchrate = value / xmsl;
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.iinvexchrate, { value: iinvexchrate + '/1.0' });
		} else if (key === FIELDS.iinvexchrate) {
			// 换算率
			// 主数量=数量 * 换算率
			let iinvexchrate = value.split('/');
			let xmsl = props.editTable.getValByKeyAndIndex(moduleId, index, FIELDS.xmsl).value; // 数量
			let mainquantity = null;
			if (iinvexchrate.length == 1) {
				mainquantity = xmsl * value;
				value = value + '/1.0';
			} else {
				mainquantity = xmsl * iinvexchrate[0] / iinvexchrate[1];
			}

			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.mainquantity, { value: mainquantity });
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.iinvexchrate, { value: value });
		}
	} else if (key === FIELDS.ncurrentmatchnum || key === FIELDS.ncurrentmatchmny) {
		/** 入库单字段编辑后 */
		// 新旧相同，不触发
		let newvalue = rows[0].newvalue.value == '' ? null : rows[0].newvalue.value;
		let oldvalue = rows[0].oldvalue.value == '' ? null : rows[0].oldvalue.value;
		if (null == value || undefined == value || '' == value) {
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchnum, {
				value: null
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchmny, {
				value: null
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nqtorigprice, {
				value: null
			});
			return;
		} else if (0 == value) {
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchnum, {
				value: 0
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchmny, {
				value: 0
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nqtorigprice, {
				value: 0
			});
			return;
		} else if (newvalue == oldvalue) {
			return;
		}

		let { invoiceData } = getIVMInvoiceClickRow(props); // 进项开票列表当前点击行
		let xmje = invoiceData.values[FIELDS.xmje].value; // 发票行无税金额
		let mainquantity = invoiceData.values[FIELDS.mainquantity].value; // 发票行主数量
		if (!mainquantity || mainquantity == undefined) {
			showWarningInfo(getLangByResId(this, '4004MATCH-000010')); /* 国际化处理： 当前匹配的发票主数量不能为空，请先维护发票主数量！*/
			return;
		}

		if (key === FIELDS.ncurrentmatchnum) {
			// 本次匹配主数量
			// 联动本次匹配金额 = 发票行无税金额 * (本次匹配数量 / 发票行数量)
			let ncurrentmatchmny = xmje * (value / mainquantity);
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchmny, {
				value: ncurrentmatchmny.toFixed(record.values[FIELDS.ncurrentmatchmny].scale)
			});
			// 联动无税单价 = 本次匹配金额 / 本次匹配数量
			let nqtorigprice = ncurrentmatchmny / value;
			props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nqtorigprice, {
				value: nqtorigprice.toFixed(record.values[FIELDS.nqtorigprice].scale)
			});
		} else if (key === FIELDS.ncurrentmatchmny) {
			// 本次匹配金额
			let ncurrentmatchnum = props.editTable.getValByKeyAndIndex(moduleId, index, FIELDS.ncurrentmatchnum).value;
			if (ncurrentmatchnum && ncurrentmatchnum != 0) {
				// 联动无税单价 = 本次匹配金额 / 本次匹配数量
				let nqtorigprice = value / ncurrentmatchnum;
				props.editTable.setValByKeyAndIndex(moduleId, index, FIELDS.nqtorigprice, {
					value: nqtorigprice.toFixed(record.values[FIELDS.nqtorigprice].scale)
				});
			}
		}
	}
}
