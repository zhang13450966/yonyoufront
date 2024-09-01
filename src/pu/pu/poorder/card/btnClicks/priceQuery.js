/*
 * @Author: CongKe
 * @PageInfo: 采购询价
 * @Date: 2018-04-19 10:24:43
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-05-12 15:42:55
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD, TRANSFER } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { createExtBillHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processExtBillCardBodyEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let bodyids = [ PAGECODE.cardbody ];
let _this;

export default function pricequery(modelIndex) {
	_this = this;
	let rows = [];
	let checkedRows = _this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (modelIndex != undefined) {
		//编辑侧拉只取当前值
		rows.push(modelIndex);
	} else if (!checkedRows || checkedRows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000040') /* 国际化处理： 请选择需要询价的表体数据！*/
		});
		return;
	}
	let noopenrow = new Array(); // 非侧拉勾选的行重新排序
	if (modelIndex == undefined) {
		checkedRows.map((item, index) => {
			rows.push(item.index);
			noopenrow.push(index);
		});
	}
	//过滤空行
	this.props.cardTable.filterEmptyRows(PAGECODE.cardbody);
	this.props.cardTable.filterEmptyRows(PAGECODE.head_payment);
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
	if (modelIndex != undefined) {
		//编辑侧拉只取当前值
		aggvo.card.bodys[PAGECODE.cardbody].rows = rows;
		rows = [ 0 ];
	} else {
		// 非侧拉勾选的行重新排序
		aggvo.card.bodys[PAGECODE.cardbody].rows = newRows;
		rows = noopenrow;
	}

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
		url: URL.pricequery,
		data: datas,
		method: 'POST',
		success: (res) => {
			if (res.data) {
				let extCard = {
					extbillcard: res.data
				};
				processExtBillCardBodyEditResult(props, PAGECODE.cardbody, extCard);
				// buttonController.materialButtonInit(props);
			}
		}
	});
}
