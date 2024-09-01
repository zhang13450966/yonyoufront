/*
 * @Author: CongKe 
 * @PageInfo: 付款计划按钮功能
 * @Date: 2018-05-09 11:29:02 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-08 09:34:30
 */
import { toast } from 'nc-lightapp-front';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { LIST_BUTTON, ARRIVEPLAN, STATUS, PAGECODE } from '../../constance';
import { searchBtnClick, cancelButton, saveButton, print_BtnClick, deleteCheck } from '../btnClicks/index';
import { buttonController } from './index';

export default function(props, key, text, record, index) {
	let pk;
	let rowindex = [];
	let rows = props.editTable.getCheckedRows(ARRIVEPLAN.TABLEID);
	let closerows = [];
	if (rows.length > 0) {
		rows.map((item) => {
			rowindex.push(item.index);
		});
	}
	pk = rows && rows[0] && rows[0].rows && rows[0].rows.values.pk_order.value;
	switch (key) {
		case LIST_BUTTON.Edit: // 修改
			// 单表也需要适配 在浏览态时勾选行去掉勾选
			props.editTable.selectAllRows(ARRIVEPLAN.TABLEID, false);
			buttonController.togglePageShow.call(this, this.props, STATUS.edit);
			break;
		case LIST_BUTTON.SMS_CIRCULAR: // 短信通知
			break;
		case LIST_BUTTON.Print: // 打印
			print_BtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.Refresh: //刷新
			searchBtnClick.call(this, this.props, this.model.pk_order, true);
			break;
		case LIST_BUTTON.Add: //新增
			props.editTable.addRow(ARRIVEPLAN.TABLEID);
			break;
		case LIST_BUTTON.Delete: //删除
			if (rows.length > 0) {
				let emptyline = [];
				rows.map((item) => {
					let index = item.index;
					let pk_order_bb1 = item.data.values.pk_order_bb1.value;
					pk_order_bb1 = pk_order_bb1 == null ? '' : pk_order_bb1;
					if (pk_order_bb1 == '') {
						emptyline.push(index);
					}
				});
				if (emptyline && emptyline.length > 0) {
					props.editTable.deleteTableRowsByIndex(ARRIVEPLAN.TABLEID, emptyline);
				}
				buttonController.togglePageShow.call(this, this.props, STATUS.edit);
				rows = props.editTable.getCheckedRows(ARRIVEPLAN.TABLEID);
			}
			if (rows && rows.length > 0) {
				let ndata = new Array();
				rows.map((item) => {
					ndata.push(item.data);
				});
				let model = {
					areacode: ARRIVEPLAN.TABLEID,
					areaType: 'table',
					rows: ndata
				};
				let checkdata = {
					pageid: ARRIVEPLAN.PAGECODE,
					model: model
				};
				deleteCheck.call(this, checkdata, () => {
					if (rowindex && rowindex.length > 0) {
						props.editTable.deleteTableRowsByIndex(ARRIVEPLAN.TABLEID, rowindex);
					}
					buttonController.togglePageShow.call(this, this.props, STATUS.edit);
				});
			}
			break;
		case LIST_BUTTON.Save: //保存
			saveButton.call(this, props);
			break;
		case LIST_BUTTON.Cancel: //取消
			cancelButton.call(this);
			break;
		case LIST_BUTTON.DelLine: //删行
			if (rows && rows.length > 0) {
				let model = {
					areacode: ARRIVEPLAN.TABLEID,
					areaType: 'table',
					rows: rows
				};
				let data = {
					pageid: ARRIVEPLAN.PAGECODE,
					model: model
				};
				deleteCheck.call(this, data, () => {
					props.editTable.deleteTableRowsByRowId(ARRIVEPLAN.TABLEID, record.rowid);
					buttonController.togglePageShow.call(this, this.props, STATUS.edit);
				});
			}
			break;
		case LIST_BUTTON.CopyLine: //复制行
			let planrows = props.editTable.getAllRows(ARRIVEPLAN.TABLEID);
			let vbillcode = record.values.vbillcode.value;

			// 校验是否行关闭且累计到货数量是否大于0
			if (record.values.naccumreceivenum && record.values.naccumreceivenum.value > 0) {
				showWarningInfo(null, getLangByResId(this, '4004POORDER-000133', { 0: vbillcode })); // 到货计划{0}存在后续单据，不能复制！
				return;
			}
			// let fisactive = record.values.fisactive.value;
			// if(fisactive && fisactive == 1) {
			// 	showWarningInfo(null, '到货计划' + vbillcode + '相关订单行已关闭，不能复制！');
			// 		return;
			// }
			let pk_order_b = record.values.pk_order_b.value;
			let cardrows = props.cardProps.cardTable.getAllRows(PAGECODE.cardbody);
			for (let i = 0; i < cardrows.length; i++) {
				if (
					cardrows[i].values.pk_order_b.value == pk_order_b &&
					cardrows[i].values.fisactive &&
					cardrows[i].values.fisactive.value &&
					cardrows[i].values.fisactive.value == 1
				) {
					// 行已关闭
					showWarningInfo(null, getLangByResId(this, '4004POORDER-000134', { 0: vbillcode })); // 到货计划{0}相关订单行已关闭，不能复制！
					return;
				}
			}
			if (vbillcode) {
				let MAX_CODE = 1;
				planrows.forEach((row) => {
					let num = new Number(row.values.vbillcode.value.split('-')[1]);
					if (num > MAX_CODE) {
						MAX_CODE = num;
					}
				});

				let newnum = prefixInteger(MAX_CODE + 1, 4);
				let newcode = vbillcode.split('-')[0] + '-' + newnum;
				let newrecord = deepClone(record);
				newrecord.values.vbillcode.value = newcode;
				newrecord.values['pk_order_bb1'] = { value: null, display: null, scale: '-1' };
				props.editTable.pasteRow(ARRIVEPLAN.TABLEID, newrecord, planrows.length - 1);
			} else {
				let newrecord = deepClone(record);
				newrecord.values['pk_order_bb1'] = { value: null, display: null, scale: '-1' };
				props.editTable.pasteRow(ARRIVEPLAN.TABLEID, newrecord, planrows.length - 1);
			}
			// setPKempty(props, index + 1);
			break;
		default:
			break;
	}
}

function prefixInteger(num, length) {
	return (Array(length).join('0') + num).slice(-length);
}

function setPKempty(props, index) {
	props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'pk_order_bb1', {
		value: null,
		display: null,
		scale: '-1'
	});
}
