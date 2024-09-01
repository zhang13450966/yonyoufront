/*
 * @Author: CongKe
 * @PageInfo: 询协同售价
 * @Date: 2018-04-19 10:24:43
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-12-10 09:50:50
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createExtBillHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processExtBillCardBodyEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let bodyids = [ PAGECODE.cardbody ];
let _this;

export default function coopPriceQuery(modelIndex) {
	_this = this;
	let rows = [];
	let checkedRows = this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let newcheckedRows = [];
	if (modelIndex != undefined) {
		rows.push(modelIndex);
	} else if (!checkedRows || checkedRows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ORDERREVISE-000044') /* 国际化处理： 请选择需要询价的表体数据！*/
		});
		return;
	}
	if (checkedRows != null) {
		for (let i = 0; i < checkedRows.length; i++) {
			if (checkedRows[i].data.values.pk_material.value && checkedRows[i].data.values.pk_material.value != '') {
				newcheckedRows.push(checkedRows[i]);
			}
		}
	}
	if (modelIndex == undefined) {
		for (let i = 0; i < newcheckedRows.length; i++) {
			rows.push(newcheckedRows[i].index);
		}
	}
	//过滤空行
	this.props.cardTable.filterEmptyRows(PAGECODE.cardbody);
	//this.props.cardTable.filterEmptyRows(PAGECODE.head_payment);
	let aggvo = createExtBillHeadAfterEventData(
		this.props,
		PAGECODE.cardcode,
		PAGECODE.cardhead,
		bodyids,
		[ PAGECODE.cardbody ],
		null,
		null
	);
	let allRows = aggvo && aggvo.card && aggvo.card.bodys && aggvo.card.bodys[PAGECODE.cardbody].rows;
	let newRows = [];
	rows.forEach((i) => {
		newRows.push(allRows[i]);
	});
	// 因为侧拉有询价按钮，所以不直接取勾选行数据
	aggvo.card.bodys[PAGECODE.cardbody].rows = newRows;
	let datas = {
		rows: rows,
		cardEvent: aggvo
	};
	getAfterData(this.props, datas);
}

/**
 * 询价
 * @param {*} props
 * @param {*} url
 * @param {*} aggvo
 */
function getAfterData(props, datas) {
	ajax({
		url: URL.cooppricequery,
		data: datas,
		method: 'POST',
		success: (res) => {
			if (res.data) {
				let extCard = {
					extbillcard: res.data
				};
				processExtBillCardBodyEditResult(props, PAGECODE.cardbody, extCard);
			}
		}
	});
}
