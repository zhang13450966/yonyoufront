/*
 * @Author: CongKe
 * @PageInfo: 采购订单付款计划编辑后
 * @Date: 2018-06-11 09:36:39
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-05-31 16:09:23
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { simplifyData } from '../../../../../scmpub/scmpub/pub/tool/simplifyDataUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

import moment from 'moment';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	if (changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
		//新旧值相等不触发编辑后
		return;
	}
	//过滤空行
	props.editTable.filterEmptyRows(PAGECODE.tableId, new Array());
	let allRows = props.editTable.getAllRows(PAGECODE.tableId, true);
	let data = {};
	let array = new Array();
	if (allRows != undefined) {
		let formData = {
			areacode: PAGECODE.tableId,
			areaType: 'table',
			rows: array
		};
		data.grid = {
			pageid: PAGECODE.listcode,
			model: formData
		};
	}
	// rows的目的是将同一个订单的所有行拿出来，便于后台联动
	let pk_order = record.values.pk_order.value;

	allRows.forEach((item, i) => {
		if (pk_order == item.values.pk_order.value) {
			array.push(item);
		}
	});
	data.attrcode = key;
	data.changedrows = changedrows;
	data.index = 0;
	data.grid.model = simplifyData(data.grid.model);
	let dbegindate = props.editTable.getValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DBEGINDATE);
	let iitermdays = props.editTable.getValByKeyAndIndex(PAGECODE.tableId, index, FIELD.IITERMDAYS);
	dbegindate = dbegindate == null ? null : dbegindate.value;
	iitermdays = iitermdays == null ? null : iitermdays.value;
	if (FIELD.DBEGINDATE == key) {
		//起算日期
		if (!value) {
			// props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.IITERMDAYS, {
			// 	value: 0
			// });
			props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DENDDATE, {
				value: null
			});
		} else {
			if (iitermdays != null) {
				//起算日期加上账期天数
				//let enddate = getAfterDay(value, iitermdays, 'YYYY-MM-DD HH:MM:SS');
				//支持网问题NCdp205669836 账期到期日默认成那天的23:59:59
				let enddate = getAfterDay(value, iitermdays, 'YYYY-MM-DD 23:59:59');
				props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DENDDATE, {
					value: enddate
				}); //账期到期日
			}
		}
	} else if (FIELD.DENDDATE == key) {
		//账期到期日
		if (!value) {
			// props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.IITERMDAYS, {
			// 	value: 0
			// });
		} else {
			if (dbegindate) {
				let days = delDays(value, dbegindate); //两个日期相减
				props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.IITERMDAYS, {
					value: days
				});
			} else if (iitermdays) {
				let begin = getAfterDay(value, -iitermdays, 'YYYY-MM-DD HH:MM:SS');
				props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DBEGINDATE, {
					value: begin
				});
			}
		}
	} else if (key == FIELD.IITERMDAYS) {
		//账期天数
		if (!value) {
			props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DBEGINDATE, {
				value: null
			});
		}
		if (dbegindate) {
			let denddate = getAfterDay(dbegindate, value, 'YYYY-MM-DD HH:MM:SS');
			props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.DENDDATE, {
				value: denddate
			});
		}
	} else if (FIELD.NORIGMNY == key) {
		// 金额
		let naccumpayorgmny = props.editTable.getValByKeyAndIndex(PAGECODE.tableId, index, FIELD.NACCUMPAYORGMNY);
		let naccumpayapporgmny = props.editTable.getValByKeyAndIndex(PAGECODE.tableId, index, FIELD.NACCUMPAYAPPORGMNY);
		let content = null;
		if (value == null || value == '') {
			content = getLangByResId(this, '4004OPAYPLAN-000000'); /* 国际化处理： 金额不能为空！*/
		} else if (value.value <= 0) {
			content = getLangByResId(this, '4004OPAYPLAN-000001'); /* 国际化处理： 金额必须大于0！*/
		} else if (naccumpayorgmny != null && parseFloat(value, 10) < parseFloat(naccumpayorgmny.value, 10)) {
			//modify by zhaoypm for jira NCCLOUD-60506 @2018-09-17 原代码为 value.value < naccumpayorgmny
			content = getLangByResId(this, '4004OPAYPLAN-000002'); /* 国际化处理： 付款计划的金额不可小于累计付款金额！*/
		} else if (naccumpayapporgmny != null && parseFloat(value, 10) < parseFloat(naccumpayapporgmny.value, 10)) {
			//modify by zhaoypm for jira NCCLOUD-60506  @2018-09-17 原代码为 value.value < naccumpayorgmny
			content = getLangByResId(this, '4004OPAYPLAN-000003'); /* 国际化处理： 付款计划的金额不可小于累计付款申请金额！*/
		}
		if (content != null) {
			toast({
				color: 'warning',
				content: content
			});
			props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.NORIGMNY, {
				value: changedrows[0].oldvalue.value
			});
		} else {
			let rowArray = new Array();
			data.grid.model.rows.forEach((item) => {
				if ('3' != item.status) {
					rowArray.push(item);
				}
			});
			data.grid.model.rows = rowArray;
			getAfterData(props, data, index);
		}
	} else if (FIELD.NRATE == key) {
		// 比率
		let content = null;
		if (value == null || value == '') {
			content = getLangByResId(this, '4004OPAYPLAN-000004'); /* 国际化处理： 比率不能为空！*/
		} else if (value.value < 0) {
			content = getLangByResId(this, '4004OPAYPLAN-000005'); /* 国际化处理： 比率必须大于等于0！*/
		}
		if (content != null) {
			toast({
				color: 'warning',
				content: content
			});
			props.editTable.setValByKeyAndIndex(PAGECODE.tableId, index, FIELD.NRATE, {
				value: changedrows[0].oldvalue.value
			});
		} else {
			getAfterData(props, data, index);
		}
	} else if (FIELD.feffdatetype == key) {
		// 起算依据
		getAfterData.call(this, props, data, index, key, changedrows);
	}
}
// YYYY-MM-DD HH:MM:SS
//得到某个日期后几天是哪天
function getAfterDay(date, number, format) {
	//传入的日期，几天后，日期的格式
	const newDate = moment(date).add(number, 'days').format(format);
	return newDate;
}

/**
 * 计算两个日期相差的天数
 * @param {*} date1
 * @param {*} date2
 */
function delDays(date1, date2) {
	// var date1Str = date1.split('-'); //将日期字符串分隔为数组,数组元素分别为年.月.日
	// //根据年 . 月 . 日的值创建Date对象
	// var date1Obj = new Date(date1Str[0], date1Str[1] - 1, date1Str[2]);
	// var date2Str = date2.split('-');
	// var date2Obj = new Date(date2Str[0], date2Str[1] - 1, date2Str[2]);
	// var t1 = date1Obj.getTime();
	// var t2 = date2Obj.getTime();
	// var dateTime = 1000 * 60 * 60 * 24; //每一天的毫秒数
	// var minusDays = Math.floor((t2 - t1) / dateTime); //计算出两个日期的天数差

	var data = (new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24);
	data = parseInt(data);
	var days = Math.abs(data); //取绝对值
	return days;
}

/**
 * 编辑后事件请求
 * @param {*} props
 * @param {*} viewvo
 */
function getAfterData(props, viewvo, index, key, changedrows) {
	ajax({
		url: URL.afterEvent,
		data: viewvo,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				let updatedata = {};
				if (data === undefined) {
					props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
					updatedata = { index: index, data: [] };
					props.editTable.updateDataByIndexs(PAGECODE.tableId, [ updatedata ]);
				} else {
					let rowsData = data[PAGECODE.tableId].rows;
					props.editTable.updateDataByRowId(PAGECODE.tableId, { rows: rowsData }, false, false);
					if (FIELD.feffdatetype == key) {
						let oriEff = changedrows[0].oldvalue.value;

						let curEff = '';
						for (let i = 0; i < rowsData.length; i++) {
							if (changedrows[0].rowid == rowsData[i].rowid) {
								curEff = rowsData[i].values[FIELD.feffdatetype]
									? rowsData[i].values[FIELD.feffdatetype]
									: null;
							}
						}
						// let curEff = rowsData[index].values[FIELD.feffdatetype]
						// 	? rowsData[index].values[FIELD.feffdatetype].value
						// 	: null;

						if (curEff && (curEff.value == oriEff || (!curEff.value && !oriEff))) {
							showErrorInfo('', getLangByResId(this, '4004OPAYPLAN-000021'));
						}
					}
				}
			}
		}
	});
}
