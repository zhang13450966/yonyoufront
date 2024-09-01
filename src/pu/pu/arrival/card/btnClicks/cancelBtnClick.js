/*
 * @Author: zhangshqb
 * @PageInfo: 到货单卡片态取消按钮逻辑
 * @Date: 2018-04-28 10:17:14
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-09 15:41:37
 */
import { ajax } from 'nc-lightapp-front';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { URL, AREA, PAGECODE, ALLBUTTONS, FREEBUTTONS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import buttonController from '../viewControl/buttonController';
import cancelPastBtnClick from './cancelPastBtnClick';
export default function(props) {
	let _this = this;
	showWarningDialog(getLangByResId(_this, '4004ARRIVAL-000036'), getLangByResId(_this, '4004ARRIVAL-000001'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			cancelPastBtnClick.call(this);
			if (this.props.getPageStatus() != 'add') {
				if (this.props.getUrlParam('type')) {
					if (this.props.transferTable.getTransformFormAmount(AREA.leftarea) == 1) {
						let allprocess = this.props.transferTable.getTransformFormStatus(AREA.leftarea);
						if (allprocess === false) {
							let type = this.props.getUrlParam('type');
							let url = '/ref21';
							let pagecode = PAGECODE.transferOrder;
							if (type == 'arrivaltransfer61') {
								url = '/ref61';
								pagecode = PAGECODE.transferSubcont;
							} else if (type == 'arrivalreturn21') {
								url = '/return21';
								pagecode = PAGECODE.returnOrder;
							} else if (type == 'arrivalreturn61') {
								url = '/return61';
								pagecode = PAGECODE.returnSubcont;
							} else if (type == 'quickArr') {
								url = '/list';
								pagecode = PAGECODE.head;
							}
							this.props.cardTable.setStatus(AREA.body, 'browse');
							if (this.srcappcode) {
								this.props.pushTo(url, { appcode: _this.srcappcode, pagecode: pagecode });
							} else if (url == '/ref21') {
								this.props.pushTo(url, { app: _this.appcode, type: 'transfer21', pagecode: pagecode });
							} else {
								this.props.pushTo(url, { pagecode: pagecode });
							}
						} else {
							//表单返回上一次的值

							this.props.cardTable.selectAllRows(AREA.body, false);
							this.indexstatus[_this.state.index] = 'browse';
						}
					} else {
						let pk_arriveorder = props.form.getFormItemsValue(AREA.head, 'pk_arriveorder');
						if (pk_arriveorder && pk_arriveorder.value) {
							props.cardTable.resetTableData(AREA.body);
							//表单返回上一次的值
							props.form.cancel(AREA.head);
							// props.button.setButtonVisible(ALLBUTTONS, false);
							// props.button.setButtonVisible(TRANSFERFREEBUTTONS, true);
							props.cardTable.selectAllRows(AREA.body, false);
							_this.indexstatus[_this.state.index] = 'browse';
							buttonController.call(this, 'borwse');
						} else {
							props.transferTable.setTransformFormStatus(AREA.leftarea, {
								status: false,
								onChange: (current, next, currentIndex) => {
									delete this.indexstatus[currentIndex];
									let keys = Object.keys(this.indexstatus);
									let indexstatusTemp = {};
									keys.forEach((item, index) => {
										indexstatusTemp[index] = this.indexstatus[item];
									});
									_this.indexstatus = indexstatusTemp;
									showSuccessInfo(getLangByResId(_this, '4004ARRIVAL-000021')); /* 国际化处理： 取消成功*/
								}
							});
						}
					}
				} else if (this.props.getUrlParam('status') == 'return23') {
					this.props.pushTo(URL.list, { pagecode: PAGECODE.head });
					return;
				} else if (this.props.getUrlParam('status') == 'returnArrival') {
					let id = this.props.getUrlParam('id');
					this.props.setUrlParam({ status: 'browse' });
					// initTemplate.call(this);
					let data = { id: this.props.getUrlParam('id'), pageid: PAGECODE.card, templateid: this.templateid };
					let url = URL.queryCard;
					ajax({
						url: url,
						data: data,
						success: (res) => {
							if (res && res.data && res.data.head) {
								let vbillcode = res.data.head[this.formId].rows[0].values.vbillcode.value;
								this.props.form.setAllFormValue({
									[this.formId]: res.data.head[this.formId]
								});
								let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
								this.setState({ billstatus: billstatus });
								// this.toggleShow(billstatus);
								this.setState({ vbillcode: vbillcode });
								this.props.BillHeadInfo.setBillHeadInfoVisible({
									billCode: vbillcode
								});
							}
							if (res && res.data && res.data.body) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
								// let billstatus = this.props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
								// this.toggleShow(billstatus);
								// setTimeout(() => {
								RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
								// }, 0);
								buttonController.call(this);
							}
						}
					});
				}
				this.props.cardTable.resetTableData(AREA.body);
				//表单返回上一次的值
				this.props.form.cancel(AREA.head);
				//编辑返回上一次的值
				// props.pushTo(URL.card, {  });
				this.props.setUrlParam({ status: 'browse' });
				this.setState({ status: 'browse', id: props.getUrlParam('id') });
				buttonController.call(this);
			}
		}
	});
}
