/*
 * @Author: zhangshqb
 * @PageInfo: 到货单卡片态按钮 删除
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-07-11 14:44:51
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, COMMON, AREA, PAGECODE, ALLBUTTONS } from '../../constance';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewControl/buttonController';
export default function() {
	let __this = this;
	showWarningDialog(getLangByResId(__this, '4004ARRIVAL-000002'), getLangByResId(__this, '4004ARRIVAL-000003'), {
		/* 国际化处理： 删除,确定要删除所选数据吗?*/
		beSureBtnClick: () => {
			let rows = __this.props.cardTable.getAllRows(AREA.body);
			let bodys = [];
			rows.forEach((row) => {
				bodys.push({
					id: row.values['pk_arriveorder_b'].value,
					ts: row.values['ts'].value
				});
			});
			let pk_arriveorder = __this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value;
			ajax({
				method: 'post',
				url: URL.delete,
				data: [
					{
						id: __this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value,
						ts: __this.props.form.getFormItemsValue(AREA.head, 'ts').value,
						bodys: bodys
					}
				],
				success: function(res) {
					// showSuccessInfo(getLangByResId(__this, '4004ARRIVAL-000004')); /* 国际化处理： 删除成功*/
					let nextId = getNextId(__this.props, pk_arriveorder, COMMON.arrivalCacheKey);
					deleteCacheData(__this.props, 'pk_arriveorder', pk_arriveorder, COMMON.arrivalCacheKey);
					changeUrlParam(__this.props, { status: 'browse', id: nextId });
					let data = { id: nextId, pageid: PAGECODE.card, templateid: __this.templateid };
					ajax({
						url: URL.queryCard,
						data: data,
						success: (res) => {
							if (__this.props.getUrlParam('type')) {
								if (__this.props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
									// history.go(-1);
									__this.props.form.EmptyAllFormValue(AREA.form);
									__this.setState({ vbillcode: '' });
									__this.props.BillHeadInfo.setBillHeadInfoVisible({
										billCode: ''
									});
									__this.props.cardTable.setTableData(AREA.body, { rows: [] });
									let url;
									let pagecode = '';
									//删除需要回到列表
									if (__this.props.getUrlParam('type') == 'arrivaltransfer21') {
										// 来源采购订单
										url = URL.transfer21;
										pagecode = PAGECODE.transferOrder;
									} else if (__this.props.getUrlParam('type') == 'arrivaltransfer61') {
										// 委外到货
										url = URL.transfer61;
										pagecode = PAGECODE.transferSubcont;
									} else if (__this.props.getUrlParam('type') == 'arrivalreturn21') {
										// 采购退货
										url = URL.return21;
										pagecode = PAGECODE.returnOrder;
									}
									__this.props.pushTo(url, { pagecode: pagecode });
								} else {
									__this.indexstatus = {};
									__this.props.transferTable.setTransformFormStatus(AREA.leftarea, {
										status: false,
										onChange: (current, next, currentIndex) => {
											showSuccessInfo(
												getLangByResId(__this, '4004ARRIVAL-000004')
											); /* 国际化处理： 删除成功*/
										}
									});
								}
								// 拉单分单，多条保存，删除其中一条之后，这里不用自动渲染，在createTransferList中的onTransferItemSelected的方法中已经设置过了
								if (__this.manyTrans) {
									buttonController.call(__this);
								}
							} else {
								if (res && res.data && res.data.head) {
									let vbillcode = res.data.head[AREA.head].rows[0].values.vbillcode.value;
									__this.props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
									let billstatus = __this.props.form.getFormItemsValue(AREA.head, 'fbillstatus')
										.value;
									__this.setState({ billstatus: billstatus });
									__this.setState({ vbillcode: vbillcode });
									__this.props.BillHeadInfo.setBillHeadInfoVisible({
										billCode: vbillcode
									});
									__this.props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
								} else {
									__this.props.form.EmptyAllFormValue(AREA.form);

									__this.setState({ vbillcode: '' });
									__this.props.BillHeadInfo.setBillHeadInfoVisible({
										billCode: ''
									});
									__this.props.cardTable.setTableData(AREA.body, { rows: [] });
								}
								showSuccessInfo(getLangByResId(__this, '4004ARRIVAL-000004')); /* 国际化处理： 删除成功*/
								buttonController.call(__this);
							}
						}
					});
				}
			});
		},
		cancelBtnClick: () => {}
	});
}
