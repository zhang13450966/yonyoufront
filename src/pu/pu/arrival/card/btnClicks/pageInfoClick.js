/*
 * @Author: zhangshqb
 * @PageInfo: 点击翻页器的下一页或者上一页
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-21 16:19:37
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, ALLBUTTONS, EXEBUTTONS, FREEBUTTONS, COMMITBUTTONS, AREA, FIELD } from '../../constance';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { setSagaBtnState } from '../viewControl/buttonController';
export default function pageInfoClick(props, pk) {
	if (pk == null) {
		pk = this.props.getUrlParam('id');
	}
	if (pk) {
		this.props.setUrlParam(pk); //动态修改地址栏中的id的值(路径中一定要是id，否则会导致切换下一条的时候，pk取不到)
	}
	let data = { id: pk, pageid: PAGECODE.card, templateid: this.templateid };
	ajax({
		url: URL.queryCard,
		data: data,
		method: 'POST',
		success: res => {
			if (res.data) {
				let data = res.data;
				if (data.head) {
					this.props.form.setAllFormValue({ [AREA.form]: data.head[AREA.form] });
					//到货单编号
					this.setState({
						vbillcode: data.head[AREA.form].rows[0].values.vbillcode.value,
					});
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						billCode: data.head[AREA.form].rows[0].values.vbillcode.value,
					});
					let billstatus = data.head[AREA.form].rows[0].values.fbillstatus.value;
					if (billstatus == 0) {
						props.button.setButtonVisible(ALLBUTTONS, false);
						props.button.setButtonVisible(FREEBUTTONS, true);
					} else if (billstatus == 1) {
						props.button.setButtonVisible(ALLBUTTONS, false);
						props.button.setButtonVisible(COMMITBUTTONS, true);
					} else if (billstatus == 2) {
						props.button.setButtonVisible(ALLBUTTONS, false);
						props.button.setButtonVisible(COMMITBUTTONS, true);
					} else if (billstatus == 3) {
						props.button.setButtonVisible(ALLBUTTONS, false);
						props.button.setButtonVisible(EXEBUTTONS, true);
					}
				}
				if (data.body) {
					this.props.cardTable.setTableData(AREA.body, data.body[AREA.body], null, true, true);
				}
				let sagaStatus = this.props.form.getFormItemsValue([AREA.head], FIELD.sagaStatus); //获得saga状态 // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
				let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
				setSagaBtnState.call(this, 'browse', frozen);
				//跳转卡片弹出提示框
				showSagaErrorToasts(this.props, AREA.form, FIELD.pk_arriveorder);
			}
		},
	});
}
