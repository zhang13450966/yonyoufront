/*
 * @Author: zhaochyu
 * @PageInfo: 卡片自由态刷新
 * @Date: 2018-08-01 18:59:51
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-01-13 10:40:07
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, FIELD, URL, UISTATE, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';

export default function(props) {
	let flag = props.getUrlParam(FIELD.cardStatus) == UISTATE.transfer;
	let pk = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_initialest).value;
	let data = { id: pk, pagecode: PAGECODE.cardpagecode };
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: res => {
			showSuccessInfo(getLangByResId(this, '4004INITIALEST-000037')); /* 国际化处理： 刷新成功*/
			if (res.data == undefined) {
				this.props.form.setAllFormValue(PAGECODE.cardhead, { rows: [{}] });
				this.props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] });
			}
			if (res.data.head) {
				this.props.form.setAllFormValue({
					[PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead],
				});
				let billstatus = res.data.head.card_head.rows[0].values.fbillstatus.value;
				//如果是转单情况，则不刷新按钮
				if (!flag) {
					this.toggleShow(UISTATE.browse, billstatus);
				} else {
					cachedata.call(this, PAGECODE.cardhead);
					cachedata.call(this, PAGECODE.cardbody);
				}
			}
			if (res.data.body) {
				this.props.cardTable.setTableData(PAGECODE.cardbody, res.data.body[PAGECODE.cardbody]);
			}
			showSagaErrorToasts(this.props, PAGECODE.cardhead, FIELD.pk_initialest);
		},
	});
}
function cachedata(moduleId) {
	// 转单标识
	let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
	if (transfer) {
		let { currentindex, listdata } = this.state;
		let curindex = this.curindex;
		const { transferTable, form } = this.props;
		const { setTransferListValueByIndex } = transferTable;
		if (moduleId == PAGECODE.cardhead && listdata != '') {
			// 转单表头数据做缓存
			let headVals = form.getAllFormValue(moduleId);
			listdata[curindex].head[PAGECODE.cardhead].rows = headVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		} else if (moduleId == PAGECODE.cardbody && listdata != '') {
			// 表格数据
			let bodyVals = this.props.cardTable.getAllData(moduleId);
			listdata[curindex].body[PAGECODE.cardbody].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.leftarea, listdata[curindex], curindex);
		}
	}
}
