/*
 * @Author: zhangchangqing 
 * @PageInfo: 取消按钮事件
 * @Date: 2018-04-19 10:37:17 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-15 09:49:34
 */
import { base, ajax } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { getParentURlParme } from '../btnClicks';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import pageInfoClick from './pageInfoClick';
import { setBtnShow } from './pageInfoClick';

//import { cachedata } from '../afterEvents/headAfterEvent';
//import { setBtnShow } from './pageInfoClick';
import { changeUrlParam, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
const { NCMessage } = base;
let tableId = BUYINGREQ_CARD.tableId;
let formId = BUYINGREQ_CARD.formId;
export default function clickCancelBtn(props) {
	showWarningDialog(getLangByResId(this, '4004PRAYBILL-000061'), getLangByResId(this, '4004PRAYBILL-000006'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			window.onbeforeunload = null; //关闭弹出框提示
			//将勾选框设置为非勾选状态
			this.props.cardTable.selectAllRows(BUYINGREQ_CARD.tableId, false);
			//推单标识
			let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
			let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
			//如果是推单过来的直接返回到
			if (channelType || transfer) {
				let pk = this.props.getUrlParam(BUYINGREQ_CARD.id);
				if (pk == null || pk == 'undefined') {
					pk = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill);
					pk = pk && pk.value;
				}
				pk = pk == 'undefined' ? null : pk;
				if (
					props.transferTable.getTransformFormCompleteStatus('leftarea', parseInt(this.state.index)) == true
				) {
					this.props.form.cancel(BUYINGREQ_CARD.formId);
					this.props.cardTable.resetTableData(BUYINGREQ_CARD.tableId);
					changeUrlParam(this.props, {
						status: BUYINGREQ_CARD.browse,
						id: pk
					});
					this.indexstatus[this.state.index] = 'browse';
					let data = { keyword: this.state.billId, pageid: this.pageId };
					if (channelType || transfer) {
						ajax({
							url: BUYINGREQ_CARD.queryCardInfoURL,
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
											status: BUYINGREQ_CARD.browse,
											vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
											billId: res.data.head[formId].rows[0].values.pk_praybill.value,
											billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
										},
										() => {
											//pageInfoClick.bind(this)();
											//this.toggleShow();
											let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
											//设置按钮显示
											setBtnShow(this, fbillstatus);
										}
									);
									//let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
									//设置按钮显示
									//setBtnShow(_this, fbillstatus);
								}
								//cachedata.call(this, formId);
								//cachedata.call(this, tableId);

								//showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000051')); /* 国际化处理： 刷新成功！*/
							}
						});
					}
				} else {
					if (props.transferTable.getTransformFormAmount('leftarea') == 1) {
						if (channelType) {
							this.props.pushTo(this.state.returnURL, {
								type: this.state.returnType,
								appcode: this.state.appcode,
								pagecode: BUYINGREQ_LIST.transferList
							});
						} else {
							props.pushTo(BUYINGREQ_LIST.transferUrl, {
								type: BUYINGREQ_LIST.transfer,
								pagecode: BUYINGREQ_LIST.transferList
							});
							// history.go(-1);
						}
					} else {
						props.transferTable.setTransformFormStatus('leftarea', {
							status: false,
							onChange: (current, next, currentIndex) => {
								delete this.indexstatus[currentIndex];
								let keys = Object.keys(this.indexstatus);
								let indexstatusTemp = {};
								keys.forEach((item, index) => {
									indexstatusTemp[index] = this.indexstatus[item];
								});
								this.indexstatus = indexstatusTemp;
								showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000007')); /* 国际化处理： 取消成功*/
							}
						});
					}
				}
				//this.props.pushTo(this.state.returnURL, { type: this.state.returnType, appcode: this.state.appcode });
			} else {
				//判断是新增总点击取消，从缓存中获取数据 ；修改点击取消，返回至浏览态
				let id = getCurrentLastId(BUYINGREQ_LIST.dataSource);
				if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.add) {
					if (this.state.copy_billId) {
						id = this.state.copy_billId;
						this.setState({
							copy_billId: ''
						});
					}
					this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
						status: BUYINGREQ_CARD.browse,
						id: id,
						comeType: true,
						pagecode: BUYINGREQ_CARD.cardpageid
					});
					this.props.resMetaAfterPkorgEdit(); //恢复字段编辑性
					pageInfoClick.bind(this)();
				} else if (this.props.getUrlParam(BUYINGREQ_CARD.status) == BUYINGREQ_CARD.edit) {
					let pk_praybill = this.props.getUrlParam(BUYINGREQ_CARD.id);
					let parentURL = getParentURlParme(BUYINGREQ_CARD.pageMsgType);
					if (parentURL) {
						this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
							status: BUYINGREQ_CARD.browse,
							id: pk_praybill,
							pagecode: BUYINGREQ_CARD.cardpageid
						});
						this.toggleShow();
						props.form.cancel(BUYINGREQ_CARD.formId);
						// 表格返回上一次的值
						props.cardTable.resetTableData(BUYINGREQ_CARD.tableId);
					} else {
						this.props.pushTo(BUYINGREQ_CARD.cardUrl, {
							status: BUYINGREQ_CARD.browse,
							id: pk_praybill,
							comeType: true,
							pagecode: BUYINGREQ_CARD.cardpageid
						});
						pageInfoClick.bind(this)();
					}
				}
				this.forceUpdate();
			}
			setDefData(BUYINGREQ_CARD.tempCardCacheKey, 'tempsave', false);
		}
	});
}
