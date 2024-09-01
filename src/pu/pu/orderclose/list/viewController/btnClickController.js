/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-09 11:29:02
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-05 13:22:39
 */
import { toast } from 'nc-lightapp-front';
import { BUTTON, PAGECODE, FIELD, URL, ORDERCLOSECACHE } from '../../constance';
import { commonClose, print_BtnClick, searchBtnClick } from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
let rowidPkMap = new Map();

export default function(props, key) {
	let _url = '';
	let allRows = null;
	let checkedRows = null;
	if (key != BUTTON.Refresh) {
		if (key != BUTTON.QueryAboutBusiness) {
			allRows = this.props.editTable.getAllData(PAGECODE.tableId);
		}
		checkedRows = this.props.editTable.getCheckedRows(PAGECODE.tableId);
	}
	let templetid = getDefData(ORDERCLOSECACHE.CLOSECACHE, PAGECODE.templetid); //模板ID
	if (!checkedRows && key != BUTTON.Refresh) {
		toast({ color: 'info', content: getLangByResId(this, '4004ORDERCLOSE-000000') }); /* 国际化处理： 请选择数据*/
		return;
	}
	let closedata = {
		templetid: templetid,
		pagecode: PAGECODE.listcode,
		closedto: new Array()
	};
	switch (key) {
		case BUTTON.Refresh: //刷新
			searchBtnClick.call(this, this.props, null, true);
			break;
		case BUTTON.Whole_Final_Close: // 最终关闭
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			_url = URL.finalClose; /* 国际化处理： 最终关闭*/
			commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000001'), rowidPkMap);
			break;
		case BUTTON.Whole_Open: // 整单打开
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			_url = URL.finalopen; /* 国际化处理： 整单打开*/
			commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000002'), rowidPkMap);
			break;
		case BUTTON.Row_Close: // 行关闭
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.rowclose; /* 国际化处理： 行关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000003'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Open: // 行打开
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.rowopen; /* 国际化处理： 行打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000004'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Arrival_Close: //整单 到货关闭
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.arriveallclose; /* 国际化处理： 到货关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000005'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Stock_Close: //整单 入库关闭
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.storeallclose; /* 国际化处理： 入库关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000006'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Invoic_Close: //整单 开票关闭
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.invoiceallclose; /* 国际化处理： 开票关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000007'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Payment_Close: //整单 付款关闭
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.payallclosea; /* 国际化处理： 付款关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000008'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Arrival_Open: //整单 到货打开
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.arriveallopen; /* 国际化处理： 到货打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000009'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Stock_Open: //整单 入库打开
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.storeallopen; /* 国际化处理： 入库打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000010'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Invoic_Open: //整单 开票打开
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.invoiceallopen; /* 国际化处理： 开票打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000011'), rowidPkMap);
			}
			break;
		case BUTTON.Whole_Payment_Open: //整单 付款打开
			getAllDatasMap(allRows, checkedRows, false);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.payallopen; /* 国际化处理： 付款打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000012'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Arrival_Close: //行 到货关闭
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.arriverowclose; /* 国际化处理： 到货关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000005'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Stock_Close: //行 入库关闭
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.storerowclose; /* 国际化处理： 入库关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000006'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Invoic_Close: //行 收票关闭
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.invoicerowclose; /* 国际化处理： 收票关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000013'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Payment_Close: //行 付款关闭
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.payrowclose; /* 国际化处理： 付款关闭*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000008'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Arrival_Open: //行 到货打开
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.arriverowopen; /* 国际化处理： 到货打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000009'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Stock_Open: //行 入库打开
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.storerowopen; /* 国际化处理： 入库打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000010'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Invoic_Open: //行 开票打开
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.invoicerowopen; /* 国际化处理： 开票打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000011'), rowidPkMap);
			}
			break;
		case BUTTON.Row_Payment_Open: //行 付款打开
			getAllDatasMap(allRows, checkedRows, true);
			closedata.closedto = checkedRows.rows;
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.payrowopen; /* 国际化处理： 付款打开*/
				commonClose.call(this, _url, closedata, getLangByResId(this, '4004ORDERCLOSE-000012'), rowidPkMap);
			}
			break;
		case BUTTON.QueryAboutBusiness: //单据追溯
			let pk = this.props.editTable.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_order.value;
			this.setState({ pk_order: pk, showTrack: true });
			break;
		case BUTTON.Print: //打印
			print_BtnClick.call(this, this.props, 'print');
			break;
		case BUTTON.PrintOut: //输出
			print_BtnClick.call(this, this.props, 'printout');
			break;
		default:
			break;
	}
}

function getAllDatasMap(allRows, checkedRows, isLine) {
	rowidPkMap = new Map();
	let groupByMap = new Map();
	allRows.rows.map((o) => {
		let line = o.values;
		if (line.pk_order_b.value && line.pk_order_b.value != '') {
			// 全局表体主键和rowid映射
			rowidPkMap.set(line.pk_order_b.value, o.rowid);
		}
		if (line.pk_order && line.pk_order.value && line.pk_order != '') {
			let pk_order = line.pk_order.value;
			let array = new Array();
			//按pk_order进行分组，组装表体pk+表体ts
			if (groupByMap.has(pk_order)) {
				array = groupByMap.get(pk_order);
			}
			array.push({ pks: line.pk_order_b.value, ts: line.ts.value });
			groupByMap.set(pk_order, array);
		}
	});
	let checkArray = new Array();
	let reloadMap = new Map();
	checkedRows.forEach((element) => {
		let checkLine = element.data.values;
		if (isLine) {
			// 行操作事件
			let ts = checkLine && checkLine.ts && checkLine.ts.value;
			let pk_order_b = checkLine && checkLine.pk_order_b && checkLine.pk_order_b.value;
			checkArray.push({ ts: ts, pks: pk_order_b });
		} else {
			//整单操作
			let pk_order = checkLine && checkLine.pk_order && checkLine.pk_order.value;
			if (!reloadMap.has(pk_order)) {
				// 没有重装过的数据 重装勾选数据
				reloadMap.set(pk_order, true);
				let array = groupByMap.get(pk_order);
				// array合入到checkedArray里面
				checkArray = [ ...checkArray, ...array ];
			}
		}
	});
	checkedRows.rows = checkArray;
	return rowidPkMap;
}
