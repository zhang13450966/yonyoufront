/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:58:51
 */
import { ajax } from 'nc-lightapp-front';
import { TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODE, TARGETADJ_CARD_BUTTON } from '../../siconst';
import { getParentURlParme } from '../btnClicks';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
import { setBtnShow } from './pageInfoClick';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewControl';
let tableId = TARGETADJ_CARD.tableId;
let formId = TARGETADJ_CARD.formId;
export default function clickCancelBtn(props) {
	showWarningDialog(getLangByResId(this, '4001TARGETADJ-000061'), getLangByResId(this, '4001TARGETADJ-000006'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			window.onbeforeunload = null; //关闭弹出框提示
			this.props.button.setButtonVisible([ TARGETADJ_CARD_BUTTON.SaveCommit ], false);
			//将勾选框设置为非勾选状态
			this.props.cardTable.selectAllRows(TARGETADJ_CARD.tableId, false);
			//推单标识
			let channelType = this.props.getUrlParam(TARGETADJ_CARD.channelType);
			let transfer = this.props.getUrlParam(TARGETADJ_CARD.type);
			//如果是推单过来的直接返回到
			if (channelType || transfer) {
				let pk = this.props.getUrlParam(TARGETADJ_CARD.id);
				if (pk == null || pk == 'undefined') {
					pk = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj);
					pk = pk && pk.value;
				}
				pk = pk == 'undefined' ? null : pk;
				if (
					props.transferTable.getTransformFormCompleteStatus('leftarea', parseInt(this.state.index)) == true
				) {
					this.props.form.cancel(TARGETADJ_CARD.formId);
					this.props.cardTable.resetTableData(TARGETADJ_CARD.tableId);
					changeUrlParam(this.props, {
						status: TARGETADJ_CARD.browse,
						id: pk
					});
					this.indexstatus[this.state.index] = 'browse';
					let data = { keyword: this.state.billId, pageid: this.pageId };
					if (channelType || transfer) {
						ajax({
							url: TARGETADJ_CARD.queryCardInfoURL,
							data: data,
							success: (res) => {
								if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
									props.dealFormulamsg(res.formulamsg);
								}

								if (data === undefined) {
									//订单编号
									this.setState({
										vbillcode: '',
										billId: ''
									});
									return;
								}
								if (res.data.body) {
									this.props.cardTable.setTableData(tableId, res.data.body[tableId]);
								}
								//渲染数据前先清空值，
								if (res.data.head) {
									this.props.form.setAllFormValue({ [formId]: res.data.head[formId] });
									this.setState(
										{
											lineShowType: [],
											status: TARGETADJ_CARD.browse,
											vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
											billId: res.data.head[formId].rows[0].values.pk_targetadj.value
										},
										() => {
											this.toggleShow();
											let fstatusflag = res.data.head[formId].rows[0].values.fstatusflag.value;
											//设置按钮显示
											setBtnShow(this, fstatusflag);
										}
									);
								}
							}
						});
					}
				} else {
					if (props.transferTable.getTransformFormAmount('leftarea') == 1) {
						if (channelType) {
							this.props.pushTo(this.state.returnURL, {
								type: this.state.returnType,
								appcode: this.state.appcode
							});
						} else {
							history.go(-1);
						}
					} else {
						props.transferTable.setTransformFormStatus('leftarea', {
							status: false,
							onChange: (current, next, currentIndex) => {
								showSuccessInfo(getLangByResId(this, '4001TARGETADJ-000007')); /* 国际化处理： 取消成功*/
							}
						});
					}
				}
			} else {
				//判断是新增总点击取消，从缓存中获取数据 ；修改点击取消，返回至浏览态
				let id = getCurrentLastId(TARGETADJ_LIST.dataSource);
				let status = this.props.getUrlParam(TARGETADJ_CARD.status);
				if (!status) {
					buttonController.setBlankPageButtons.call(this, props);
				}
				if (status == TARGETADJ_CARD.add) {
					if (this.state.copy_billId) {
						id = this.state.copy_billId;
						this.setState({
							copy_billId: ''
						});
					}
					this.props.pushTo(TARGETADJ_CARD.cardUrl, {
						status: TARGETADJ_CARD.browse,
						id: id,
						comeType: true,
						pagecode: TARGETADJ_CARD.cardpageid
					});
					this.props.resMetaAfterPkorgEdit(); //恢复字段编辑性
					pageInfoClick.bind(this)();
				} else if (status == TARGETADJ_CARD.edit) {
					let pk_targetadj = this.props.getUrlParam(TARGETADJ_CARD.id);
					let parentURL = getParentURlParme(TARGETADJ_CARD.pageMsgType);
					if (parentURL) {
						this.props.pushTo(TARGETADJ_CARD.cardUrl, {
							status: TARGETADJ_CARD.browse,
							id: pk_targetadj,
							pagecode: TARGETADJ_CARD.cardpageid
						});
						this.toggleShow();
					} else {
						this.props.pushTo(TARGETADJ_CARD.cardUrl, {
							status: TARGETADJ_CARD.browse,
							id: pk_targetadj,
							comeType: true,
							pagecode: TARGETADJ_CARD.cardpageid
						});
						pageInfoClick.bind(this)();
					}
				}
				this.forceUpdate();
			}
		}
	});
}
