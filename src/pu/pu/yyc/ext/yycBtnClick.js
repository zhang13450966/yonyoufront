/*
 * 友云采扩展按钮
 * @Author: guozhq 
 * @Date: 2019-05-16 16:48:52 
 * @Last Modified by: guozhq
 * @Last Modified time: 2019-05-29 10:43:14
 */

import { ajax } from 'nc-lightapp-front';
import { showErrorInfo, showSuccessInfo, showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { updateCacheData } from '../../../../scmpub/scmpub/pub/cache';
import { BUYINGREQ_LIST } from '../../buyingreq/siconst';
import { OrderCache, STATUS } from '../../../pu/poorder/constance';
import { YYC_BUTTON_ID, Req_URL, Order_URL } from '../constance';
/**
 * 发送或取消YYC
 * @param {*} props 
 * @param {*} param1 
 */
function sendOrCancel(
	props,
	{
		url,
		msg,
		isSingleTable,
		isList,
		isCard,
		listArea,
		cardheadarea,
		cardbodyarea,
		billidField,
		billbidField,
		pageCode,
		needBody = true
	}
) {
	let data = null;
	if (isList) {
		let rows = props.table.getCheckedRows(listArea);
		if (rows && rows.length > 0) {
			let dataArray = rows.map((row) => {
				return { headid: row.data.values[billidField].value };
			});
			data = {
				data: dataArray,
				iscard: false,
				pageid: pageCode
			};
		} else {
			return;
		}
	} else if (isCard) {
		let headid = props.form.getFormItemsValue(cardheadarea, billidField).value;
		if (needBody) {
			let rows = props.cardTable.getCheckedRows(cardbodyarea);
			if (rows && rows.length > 0) {
				let bodyids = rows.map((row) => {
					return row.data.values[billbidField].value;
				});
				data = {
					data: [
						{
							headid: headid,
							bodyids: bodyids
						}
					],
					iscard: true,
					pageid: pageCode
				};
			} else {
				let message = getLangByResId(this, '4004pub-000010'); /* 国际化处理： 请选择表体数据！*/
				showWarningInfo(null, message);
				return;
			}
		} else {
			data = {
				data: [
					{
						headid: headid
					}
				],
				iscard: true,
				pageid: pageCode
			};
		}
	} else if (isSingleTable) {
		let rows = props.editTable.getCheckedRows(listArea);
		if (rows && rows.length > 0) {
			let map = {};
			rows.forEach((row) => {
				let headid = row.data.values[billidField].value;
				let bodyid = row.data.values[billbidField].value;
				if (map.hasOwnProperty(headid)) {
					let array = map[headid];
					array.push(bodyid);
				} else {
					let array = [ bodyid ];
					map[headid] = array;
				}
			});
			let dataArray = [];
			for (let headid in map) {
				dataArray.push({ headid: headid, bodyids: map[headid] });
			}
			data = {
				data: dataArray,
				iscard: false,
				pageid: pageCode
			};
		}
	}
	if (data) {
		console.log(url, 'url');
		console.log(data, 'data');
		ajax({
			url: url,
			data: data,
			success: (res) => {
				if (res.data) {
					let status = res.data.status;
					if (status && status === 'failed') {
						showErrorInfo(null, res.data.failedMessage);
					} else {
						if(isSingleTable) {
							updateCacheDataArrange(props, listArea, billidField, res.data);
						}else if(isCard) {
							let pkid = res.data.head[cardheadarea].rows[0].values[billidField].value;
							if (res.data.head) {
								props.form.setAllFormValue({ [cardheadarea]: res.data.head[cardheadarea] });
							}
							if (billidField == "pk_praybill") {
								updateCacheData(props, billidField, pkid, res.data, cardheadarea, BUYINGREQ_LIST.dataSource);
								if (res.data.body) {
									props.cardTable.setTableData(cardbodyarea, res.data.body[cardbodyarea]);
								}
							} else if (billidField == "pk_order"){
								updateCacheData(props, billidField, pkid, res.data, cardheadarea, OrderCache.OrderCacheKey);
								if (res.data.bodys) {
									props.cardTable.setTableData("card_material", res.data.bodys["card_material"]);
								}
								props.form.setFormStatus(cardheadarea, STATUS.browse);
							}
						}else {
							updateCacheDataForList(props, listArea, billidField, res.data);
						}
						showSuccessInfo(null, res.data.successMessage ? res.data.successMessage : msg);
					}
				}
			}
		});
	}
}

/**
 * 查看报价信息
 * @param {} props 
 * @param {*} param1 
 */
function lookYCQtInfo(
	props,
	{ url, isSingleTable, isList, isCard, listArea, cardheadarea, cardbodyarea, billidField, billbidField }
) {
	if (isCard) {
		let checkArr = props.cardTable.getCheckedRows(cardbodyarea);
		if (checkArr && checkArr.length > 0) {
			let param = checkArr[0].data.values[billbidField].value;
			openOut(props, url, param);
		}
	} else if (isSingleTable) {
		let rows = props.editTable.getCheckedRows(listArea);
		if (rows && rows.length > 0) {
			let param = rows[0].data.values[billbidField].value;
			openOut(props, url, param);
		}
	}
}

/**
 * 查看进度
 * @param {*} props 
 * @param {*} param1 
 */
function lookYCSchedule(
	props,
	{ url, isSingleTable, isList, isCard, listArea, cardheadarea, cardbodyarea, billidField, billbidField }
) {
	let param = null;
	if (isList) {
		let rows = props.table.getCheckedRows(listArea);
		if (rows && rows.length > 0) {
			param = rows[0].data.values['vbillcode'].value;
		}
	} else if (isCard) {
		param = props.form.getFormItemsValue(cardheadarea, 'vbillcode').value;
	} else if (isSingleTable) {
		let rows = props.editTable.getCheckedRows(listArea);
		if (rows && rows.length > 0) {
			param = rows[0].data.values['vbillcode'].value;
		}
	}
	if (param) {
		openOut(props, url, param);
	}
}

/**
 * 打开云采界面
 * @param {*} props 
 * @param {*} url 
 * @param {*} param 
 */
function openOut(props, url, param) {
	console.log(url, '111');
	console.log(param, '222');

	ajax({
		url: url,
		data: param,
		success: (res) => {
			if (res.data) {
				props.openOut(res.data);
			}
		}
	});
}

/**
 * 请购单YYC按钮点击事件
 * @param {*} props 
 * @param {*} buttonid 
 * @param {*} param 
 */
function reqYYCBtnClick(
	props,
	buttonid,
	param = { isSingleTable, isList, isCard, listArea, cardheadarea, cardbodyarea, billidField, billbidField }
) {
	switch (buttonid) {
		case YYC_BUTTON_ID.SendToYC:
			let sendMsg = getLangByResId(this, '4004pub-000008'); /* 国际化处理： 发布至云采成功！*/
			sendOrCancel(props, { msg: sendMsg, url: Req_URL.SendToYC, ...param });
			break;
		case YYC_BUTTON_ID.CancelSendToYC:
			let cancelMsg = getLangByResId(this, '4004pub-000009'); /* 国际化处理： 取消发布至云采成功！*/
			sendOrCancel(props, { msg: cancelMsg, url: Req_URL.CancelSendToYC, ...param });
			break;
		case YYC_BUTTON_ID.LookYCQtInfo:
			lookYCQtInfo(props, { url: Req_URL.LookYCQtInfo, ...param });
			break;
		case YYC_BUTTON_ID.LookYCSchedule:
			lookYCSchedule(props, { url: Req_URL.LookYCSchedule, ...param });
			break;
	}
}

/**
 * 采购订单YYC按钮点击事件
 * @param {*} props 
 * @param {*} buttonid 
 * @param {*} param 
 */
function orderYYCBtnClick(props, buttonid, param = { isList, isCard, listArea, cardheadarea, billidField }) {
	switch (buttonid) {
		case YYC_BUTTON_ID.SendToYC:
			let sendMsg = getLangByResId(this, '4004pub-000008'); /* 国际化处理： 发布至云采成功！*/
			sendOrCancel(props, { msg: sendMsg, url: Order_URL.SendToYC, ...param, needBody: false });
			break;
		case YYC_BUTTON_ID.CancelSendToYC:
			let cancelMsg = getLangByResId(this, '4004pub-000009'); /* 国际化处理： 取消发布至云采成功！*/
			sendOrCancel(props, { msg: cancelMsg, url: Order_URL.CancelSendToYC, ...param, needBody: false });
			break;
	}
}

/**
 *
 * @param {*} props
 * @param {区域ID} tableId
 * @param {主键字段code} pk_field
 * @param {批量处理后台返回的数据结构} messageInfo
 */
 function updateCacheDataArrange(props, tableId, pk_field, messageInfo, index) {
	if (messageInfo == null || messageInfo[tableId] == null || messageInfo[tableId].length == 0) {
		return;
	}

	// 组装更新数据
	let updateDatas = [];
	// 列表表头按钮
	if (index == undefined) {
		// 更新成功的数据
		//1. 构建界面选择的信息 主键和index的对应关系
		let selMap = {};
		let selrows = props.editTable.getCheckedRows(tableId);
		selrows.forEach((row) => {
			let selpk = row.data.values[pk_field].value;
			selMap[selpk] = row.index;
		});
		messageInfo[tableId].rows.forEach((sucessrow, index) => {
			let pkvalue = sucessrow.values[pk_field].value;
			let updateData = {
				index: selMap[pkvalue],
				data: { values: sucessrow.values }
			};
			updateDatas.push(updateData);
		});
	} else {
		let updateData = {
			index: index,
			data: { values: messageInfo[tableId].rows[0].values }
		};
		updateDatas.push(updateData);
	}
	props.editTable.updateDataByIndexs(tableId, updateDatas);
}

function updateCacheDataForList(props, tableId, pk_field, messageInfo, index) {
	if (messageInfo == null || messageInfo[tableId] == null || messageInfo[tableId].length == 0) {
		return;
	}

	// 组装更新数据
	let updateDatas = [];
	// 列表表头按钮
	if (index == undefined) {
		// 更新成功的数据
		//1. 构建界面选择的信息 主键和index的对应关系
		let selMap = {};
		let selrows = props.table.getCheckedRows(tableId);
		selrows.forEach((row) => {
			let selpk = row.data.values[pk_field].value;
			selMap[selpk] = row.index;
		});
		messageInfo[tableId].rows.forEach((sucessrow, index) => {
			let pkvalue = sucessrow.values[pk_field].value;
			let updateData = {
				index: selMap[pkvalue],
				data: { values: sucessrow.values }
			};
			updateDatas.push(updateData);
		});
	} else {
		let updateData = {
			index: index,
			data: { values: messageInfo[tableId].rows[0].values }
		};
		updateDatas.push(updateData);
	}
	props.table.updateDataByIndexs(tableId, updateDatas);
}
export { reqYYCBtnClick, orderYYCBtnClick };
