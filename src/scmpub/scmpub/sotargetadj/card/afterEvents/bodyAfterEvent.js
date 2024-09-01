/*
 * @Author: zhangchangqing 
 * @PageInfo: 表体编辑后事件  
 * @Date: 2018-05-03 14:38:54 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-08-27 01:11:33
 */

import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, ATTRCODES, ATTRCODE } from '../../siconst';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// 初始化自定义参数
	let userobject = {};
	if (key == ATTRCODES.crowno) {
		return;
	}
	let data = createBodyAfterEventData(
		props,
		TARGETADJ_CARD.cardpageid,
		TARGETADJ_CARD.formId,
		TARGETADJ_CARD.tableId,
		moduleId,
		key,
		changedrows,
		index,
		userobject
	);
	data.card.head['card_head'].rows[0].values['ctargetid'] = {
		value: props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.ctargetid).value
	};
	data.card.head['card_head'].rows[0].values['vperiod'] = {
		value: props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.vperiod).value
	};
	data.card.head['card_head'].rows[0].values['cmarsetid'] = {
		value: props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.cmarsetid).value
	};
	userobject['ctargetid'] = props.form.getFormItemsValue(TARGETADJ_CARD.headf, ATTRCODE.ctargetid).value;

	if (key.indexOf('changenewyear') != -1 || key === ATTRCODES.ccustomerid) {
		ajax({
			url: TARGETADJ_CARD.bodyAfterEditURL,
			data: data,
			async: false,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
				}
				if (res.data.userObject) {
					if (key != ATTRCODES.ccustomerid) {
						let row = res.data.billCard.body['card_body'].rows[0].values;
						if (res.data.userObject) {
							for (let key in res.data.userObject) {
								row[key] = { value: res.data.userObject[key] };
							}
						}
						let dat = props.cardTable.getAllRows(moduleId);
						for (var value of dat) {
							if (value.rowid == res.data.billCard.body['card_body'].rows[0].rowid) {
								for (let key in res.data.billCard.body['card_body'].rows[0].values) {
									value.values[key] = res.data.billCard.body['card_body'].rows[0].values[key];
								}
							}
						}

						res.data.billCard.body['card_body'].rows = dat;
						props.cardTable.setTableData(
							TARGETADJ_CARD.tableId,
							res.data.billCard.body['card_body'],
							null,
							true,
							true
						);
					} else {
						let rows = res.data.billCard.body['card_body'].rows;
						rows.forEach(function(value, index) {
							let custmid = res.data.billCard.body['card_body'].rows[index].values.ccustomerid.value;
							if (res.data.userObject) {
								for (let key in res.data.userObject) {
									if (custmid == key) {
										let custmap = res.data.userObject[key];
										for (let k in custmap) {
											res.data.billCard.body['card_body'].rows[index].values[custmap[k]] = {
												value: res.data.userObject[custmid + ',' + custmap[k]]
											};
										}
									}
								}
							}
						});
						processBillCardBodyEditResult(props, moduleId, res.data, index);
					}
				}
			}
		});
	}
}
