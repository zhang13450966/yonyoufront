import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';

/**
 * 采购订单关闭行选择设置按钮的禁用状态
 * @param {*} props
 */
function selectedChange(props) {
	let rows = props.editTable.getCheckedRows(PAGECODE.tableId);
	let flag = true;
	let Whole_Final_Close_f = flag;
	let Whole_Open_f = flag;
	let Row_Close_f = flag;
	let Row_Open_f = flag;
	let Arrival_Close = flag;
	let stock_Close = flag;
	let invoic_Close = flag;
	let Payment_Close = flag;
	let Arrival_Open = flag;
	let stock_Open = flag;
	let invoic_Open = flag;
	let Payment_Open = flag;
	let rowsflag = true;
	let noprint = rowsflag;
	if (rows.length > 0) {
		rowsflag = false;
		noprint = false;
		rows.map((item) => {
			let bfinalclose = item.data.values.bfinalclose.value; //最终关闭
			let barriveclose = item.data.values.barriveclose.value; //到货关闭
			let bstockclose = item.data.values.bstockclose.value; //入库关闭
			let binvoiceclose = item.data.values.binvoiceclose.value; //收票关闭
			let bpayclose = item.data.values.bpayclose.value; //付款关闭
			if (bfinalclose) {
				Whole_Open_f = !flag;
			} else {
				Whole_Final_Close_f = !flag;
			}
			if (barriveclose || bstockclose || binvoiceclose || bpayclose) {
				//只要有一个关闭了，行打开就可见
				Row_Open_f = !flag;
				Whole_Open_f = !flag; //@add by lichao 整单打开可见
			}
			if (!barriveclose || !bstockclose || !binvoiceclose || !bpayclose) {
				//只要有一个打开的，行关闭就可见
				Row_Close_f = !flag;
				Whole_Final_Close_f = !flag; //@add by lichao 整单关闭可见
			}
			if (barriveclose) {
				Arrival_Open = !flag;
			} else {
				Arrival_Close = !flag;
			}
			if (bstockclose) {
				stock_Open = !flag;
			} else {
				stock_Close = !flag;
			}
			if (binvoiceclose) {
				invoic_Open = !flag;
			} else {
				invoic_Close = !flag;
			}
			if (bpayclose) {
				Payment_Open = !flag;
			} else {
				Payment_Close = !flag;
			}
		});
		if (rows.length == 1) {
			rows.forEach((item) => {
				let bfrozen = item.data.values.bfrozen.value;
				if (bfrozen == 'false' || bfrozen == false) {
					noprint = false;
				} else {
					noprint = true;
				}
			});
		}
	} else {
		Whole_Open_f = flag;
		Whole_Final_Close_f = flag;
		Row_Open_f = flag;
		Arrival_Close = flag;
		stock_Open = flag;
		stock_Close = flag;
		invoic_Open = flag;
		invoic_Close = flag;
		Payment_Open = flag;
		Payment_Close = flag;
	}
	let disableArr = {
		[BUTTON.Whole_Final_Close]: Whole_Final_Close_f, //整单关闭-->组
		[BUTTON.Whole_Arrival_Close]: Arrival_Close,
		[BUTTON.Whole_Stock_Close]: stock_Close,
		[BUTTON.Whole_Invoic_Close]: invoic_Close,
		[BUTTON.Whole_Payment_Close]: Payment_Close,
		[BUTTON.Whole_Open]: Whole_Open_f,
		[BUTTON.Whole_Open]: Whole_Open_f, //整单打开-->组
		[BUTTON.Whole_Arrival_Open]: Arrival_Open,
		[BUTTON.Whole_Stock_Open]: stock_Open,
		[BUTTON.Whole_Invoic_Open]: invoic_Open,
		[BUTTON.Whole_Payment_Open]: Payment_Open,
		[BUTTON.Row_Close]: Row_Close_f, //行关闭-->组
		[BUTTON.Row_Arrival_Close]: Arrival_Close,
		[BUTTON.Row_Stock_Close]: stock_Close,
		[BUTTON.Row_Invoic_Close]: invoic_Close,
		[BUTTON.Row_Payment_Close]: Payment_Close,
		[BUTTON.Row_Open]: Row_Open_f, //行打开-->组
		[BUTTON.Row_Arrival_Open]: Arrival_Open,
		[BUTTON.Row_Stock_Open]: stock_Open,
		[BUTTON.Row_Invoic_Open]: invoic_Open,
		[BUTTON.Row_Payment_Open]: Payment_Open,
		[BUTTON.QueryAboutBusiness]: rowsflag,
		[BUTTON.Print]: noprint,
		[BUTTON.PrintOut]: noprint
	};
	props.button.setDisabled(disableArr);
}

/**
 * 初始化默认关闭等按钮禁用
 * @param {*} props
 */
function modifyButtonDisabled(props) {
	let flag = true;
	let disableArr = {
		[BUTTON.Whole_Final_Close]: flag, //整单关闭-->组
		[BUTTON.Whole_Arrival_Close]: flag,
		[BUTTON.Whole_Stock_Close]: flag,
		[BUTTON.Whole_Invoic_Close]: flag,
		[BUTTON.Whole_Payment_Close]: flag,
		[BUTTON.Whole_Open]: flag,
		[BUTTON.Whole_Open]: flag, //整单打开-->组
		[BUTTON.Whole_Arrival_Open]: flag,
		[BUTTON.Whole_Stock_Open]: flag,
		[BUTTON.Whole_Invoic_Open]: flag,
		[BUTTON.Whole_Payment_Open]: flag,
		[BUTTON.Row_Close]: flag, //行关闭-->组
		[BUTTON.Row_Arrival_Close]: flag,
		[BUTTON.Row_Stock_Close]: flag,
		[BUTTON.Row_Invoic_Close]: flag,
		[BUTTON.Row_Payment_Close]: flag,
		[BUTTON.Row_Open]: flag, //行打开-->组
		[BUTTON.Row_Arrival_Open]: flag,
		[BUTTON.Row_Stock_Open]: flag,
		[BUTTON.Row_Invoic_Open]: flag,
		[BUTTON.Row_Payment_Open]: flag,
		[BUTTON.QueryAboutBusiness]: flag,
		[BUTTON.Print]: flag,
		[BUTTON.PrintOut]: flag
	};
	props.button.setDisabled(disableArr);
}

export default { selectedChange, modifyButtonDisabled };
