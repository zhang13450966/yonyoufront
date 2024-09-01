/*
 * @Author: CongKe 
 * @PageInfo: 订单付款协议编辑后
 * @Date: 2019-02-16 16:01:52 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-04-20 09:12:18
 */
import { URL, PAGECODE, BUTTON, STATUS, FIELD, TRANSFER } from '../../constance';
import { showErrorInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

let payBodyId = PAGECODE.head_payment;
let zeroCell = { value: '0', display: null, scale: '-1' };
let emptyCell = { value: null, display: null, scale: '-1' };
export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
		return;
	}
	/* 国际化处理： 当月生效*/
	let effectmonthcell = { value: '0', display: getLangByResId(this, '4004POORDER-000107'), scale: '-1' };
	if (key == 'checkdata') {
		// 固定结账日
		if (value != null && value != '') {
			setValByKeyAndIndex(props, index, 'effectmonth', effectmonthcell);
			setValByKeyAndIndex(props, index, 'effectaddmonth', zeroCell);
			setValByKeyAndIndex(props, index, 'paymentday', emptyCell);
		} else {
			// 清空固定结账日的同时清空生效月和附加月
			setValByKeyAndIndex(props, index, 'effectmonth', emptyCell);
			setValByKeyAndIndex(props, index, 'effectaddmonth', emptyCell);
		}
	} else if (key == 'accrate') {
		// 付款比例
		let sum = 0;
		let allrows = props.cardTable.getAllRows(payBodyId);
		//let accrates = props.cardTable.getColValue(payBodyId, 'accrate');
		for (let allrow of allrows) {
			let linevalue = allrow.values.accrate.value;
			if (allrow.status != 3) {
				if (linevalue == null) {
					continue;
				}
				linevalue = parseFloat(linevalue);
				if (linevalue == 0) {
					/* 国际化处理： 提示,付款比例不允许为0，请重新输入*/
					showErrorInfo(null, getLangByResId(this, '4004POORDER-000105'));
					setValByKeyAndIndex(props, index, 'accrate', emptyCell);
					continue;
				}
				sum += linevalue;
			}
		}
		if (sum > 100) {
			/* 国际化处理： 提示,付款比例之和不允许超过100！*/
			showErrorInfo(null, getLangByResId(this, '4004POORDER-000106'));
			setValByKeyAndIndex(props, index, 'accrate', zeroCell);
		}
	} else if (key == 'accountday') {
		// 出账日编辑后事件
		setValByKeyAndIndex(props, index, 'paymentday', emptyCell);
	} else if (key == 'paymentday') {
		// 账期天数编辑后事件
		setValByKeyAndIndex(props, index, 'checkdata', emptyCell);
		setValByKeyAndIndex(props, index, 'effectmonth', emptyCell);
		setValByKeyAndIndex(props, index, 'effectaddmonth', emptyCell);
		setValByKeyAndIndex(props, index, 'accountday', emptyCell);
	} else if (key == 'effectaddmonth') {
		// 附加月编辑后事件
		if (!value) {
			setValByKeyAndIndex(props, index, 'effectaddmonth', zeroCell);
		}
	}
}

function setValByKeyAndIndex(props, index, key, cell) {
	props.cardTable.setValByKeyAndIndex(payBodyId, index, key, cell);
}
