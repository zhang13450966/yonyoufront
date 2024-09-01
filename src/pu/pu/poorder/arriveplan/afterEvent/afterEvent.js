/*
 * @Author: CongKe
 * @PageInfo: 到货计划编辑后事件
 * @Date: 2018-06-28 10:44:50
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-16 13:42:51
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, FIELD, ARRIVEPLAN, STATUS } from '../../constance';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value && key != 'pk_arrvstoorg_v') {
		//新旧值相等不触发编辑后
		return;
	}
	//过滤空行
	let empty = { value: null, display: null, scale: '-1' };
	// props.editTable.filterEmptyRows(ARRIVEPLAN.TABLEID, new Array());
	let allRows = props.editTable.getAllRows(ARRIVEPLAN.TABLEID, false);
	let editRowid = record.rowid;
	let data = {};
	let array = new Array();
	array.push(record);
	let formData = {
		areacode: ARRIVEPLAN.TABLEID,
		areaType: 'table',
		rows: array
	};
	data.grid = {
		pageid: ARRIVEPLAN.PAGECODE,
		model: formData
	};
	data.attrcode = key;
	data.changedrows = changedrows;
	data.index = 0;
	if (moduleId === ARRIVEPLAN.TABLEID) {
		if (key == 'crownobb1') {
			//行号编辑后事件： //订单行号
			if (value && value.length > 0) {
				let arraynew = [];
				allRows.forEach((item, i) => {
					if (item.rowid == editRowid) {
						arraynew.push(item);
					}
				});
				formData.rows = arraynew;
				// data.index = index;
				getAfterData(props, data, index);
			}
		} else if (key == 'nnum') {
			let naccumdevnum = record && record.values && record.values.naccumdevnum.value;
			if (value.value - naccumdevnum < 0) {
				// 旧值设置回去
				props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'nnum', { value: changedrows.value });
				/* 国际化处理： 到货计划已经执行运输，不能将到货计划数量修改的比已经运输数量小！*/
				toast({ color: 'warning', content: getLangByResId(this, '4004POORDER-000000') });
				return;
			} else {
				getAfterData(props, data, index);
			}
		} else if (key == 'pk_arrvstoorg_v') {
			let insertNum = index;
			value &&
				value.forEach((element, i) => {
					if (i == 0) {
						record.index = index;
						record.values.pk_recvstordoc = empty; //收货仓库
						record.values[key] = { display: value[0].refname, value: value[0].refpk, scale: -1 };
						props.editTable.updateDataByIndexs(moduleId, record, true);
					} else if (element.refcode) {
						let newRecord = deepClone(record);
						newRecord.rowid = null;
						newRecord.values.nnum = { value: null, display: null, scale: record.values.nnum.scale }; //主数量
						newRecord.values.nastnum = { value: null, display: null, scale: record.values.nastnum.scale }; //数量
						newRecord.values.nqtunitnum = {
							value: null,
							display: null,
							scale: record.values.nqtunitnum.scale
						}; //报价数量
						newRecord.values.pk_recvstordoc = empty; //收货仓库
						newRecord.values.pk_order_bb1 = empty; //收货仓库
						newRecord.values[key] = { display: element.refname, value: element.refpk, scale: -1 };
						props.editTable.pasteRow(ARRIVEPLAN.TABLEID, newRecord, insertNum++);
					}
				});
			getAfterData(props, data, index);
			//收货库存组织 --收货库存组织，清空收货仓库 pk_recvstordoc
		} else if (key == 'pk_recvstordoc') {
			//收货仓库 -- 后台
			getAfterData(props, data, index);
		} else if (key == 'pk_receiveaddress') {
			//收货地址  如果表体地址清空，则表体相关地区 cdevareaid 、地点也清空 cdevaddrid
			if (value == null || value.value == null) {
				props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'cdevareaid', empty);
				props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'cdevaddrid', empty);
			}
		} else if (key == 'vvenddevaddr') {
			//供应商发货地址 表体地址清空，则表体相关地区 cvenddevareaid 、地点也清空 cvenddevaddrid
			if (value == null || value.value == null) {
				props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'cvenddevareaid', empty);
				props.editTable.setValByKeyAndIndex(ARRIVEPLAN.TABLEID, index, 'cvenddevaddrid', empty);
			}
		} else if (key == 'nastnum' || key == 'nqtunitnum') {
			// 数量、主数量、报价数量
			getAfterData(props, data, index);
		}
	}
}

function getAfterData(props, viewvo, index) {
	ajax({
		url: URL.arriveplanafterevent,
		data: viewvo,
		method: 'POST',
		async: false, //同步
		success: (res) => {
			let { success, data } = res;
			if (success && data) {
				let insertArray = [];
				let updateArray = [];
				data[ARRIVEPLAN.TABLEID].rows.forEach((element, i) => {
					if (element.rowid) {
						updateArray.push(element);
					} else {
						insertArray.push(element);
					}
				});
				props.editTable.updateDataByRowId(ARRIVEPLAN.TABLEID, { rows: updateArray });
				props.editTable.insertRowsAfterIndex(ARRIVEPLAN.TABLEID, insertArray, index);
				// props.editTable.setTableData(ARRIVEPLAN.TABLEID, data[ARRIVEPLAN.TABLEID]);
				buttonController.togglePageShow.call(this, props, STATUS.edit);
			}
		}
	});
}
