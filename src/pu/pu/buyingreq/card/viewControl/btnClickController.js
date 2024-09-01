/*
 * @Author: zhangchangqing
 * @PageInfo: 按钮点击事件
 * @Date: 2018-04-19 10:37:30
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-05 17:31:34
 */
import backBtnClick from '../btnClicks/backBtnClick';
import addBtnClick from '../btnClicks/addBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import delRowRule from '../btnClicks/delRowRule';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import copyBtnClick from '../btnClicks/copyBtnClick';
import closeRowBtnClick from '../btnClicks/closeRowBtnClick';
import onHandBtnClick from '../btnClicks/onHandQueryBtn'; //存量查拣
import openRowBtnClick from '../btnClicks/openRowBtnClick';
import openButtonClick from '../btnClicks/openBillBtnClick'; //整单打开，整单关闭
import closeButtonClick from '../btnClicks/closeBillBtnClick'; //整单打开，整单关闭
import commitBtnClick from '../btnClicks/commitBtnClick'; //提交
import saveCommitBtnClick from '../btnClicks/saveCommitBtnClick'; //提交
import unCommitBtnClick from '../btnClicks/unCommitBtnClick'; //收回
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n
import output_BtnClick from '../btnClicks/output_BtnClick'; //打印n
import combineShow from '../btnClicks/combineShow'; //合并显示
import {
	BUYINGREQ_CARD_BUTTON,
	BUYINGREQ_CARD,
	BUYINGREQ_LIST,
	ATTRCODES,
	ATTRCODE,
	BUYINGREQ_LIST_BUTTON
} from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { setBtnShow } from '../btnClicks/pageInfoClick';
import pageInfoClick from '../btnClicks/pageInfoClick';
import { cachedata } from '../afterEvents/headAfterEvent';
import { ajax, toast } from 'nc-lightapp-front';
import { buttonController } from './index';
import { YYC_BUTTON_ARRAY } from '../../../yyc/constance';
import { reqYYCBtnClick } from '../../../yyc/ext/yycBtnClick';
import { saveAndCommit } from '../btnClicks/index';
import {
	showBackWarningDialog,
	showQuitTransferWarningDialog,
	showSuccessInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import linkPoPlanBtnClick from '../btnClicks/linkPoPlanBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
import tempStorageBtnClick from '../btnClicks/tempStorageBtnClick';

export default function(props, id, text, record, index) {
	let _this = this;
	let tableId = BUYINGREQ_CARD.tableId;
	let formId = BUYINGREQ_CARD.formId;
	//推单
	let channelType = props.getUrlParam(BUYINGREQ_CARD.channelType);
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	//拉单
	let transfer = props.getUrlParam(BUYINGREQ_CARD.type);

	switch (id) {
		//导出
		case BUYINGREQ_CARD_BUTTON.Export:
			props.modal.show('exportFileModal');
			break;
		case BUYINGREQ_CARD_BUTTON.Price:
			let pk = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
			setDefData(BUYINGREQ_LIST.dataSource, 'pricekeyword', pk);
			this.setState({
				showPrice: true
			});
			break;
		case 'Back':
			// 是否有未处理的单据
			let isleft = this.props.transferTable.getTransformFormStatus('leftarea');
			if (isleft === false) {
				showBackWarningDialog({
					/* 国际化处理： 提示,有未处理完的单据，是否退出转单*/
					beSureBtnClick: () => {
						window.onbeforeunload = null;
						this.props.pushTo(this.state.returnURL, {
							type: this.state.returnType,
							appcode: this.state.appcode,
							pagecode: BUYINGREQ_LIST.transferList
						});
					}
				});
			} else {
				this.props.pushTo(this.state.returnURL, {
					type: this.state.returnType,
					appcode: this.state.appcode,
					pagecode: BUYINGREQ_LIST.transferList
				});
			}
			break;
		//刷新
		case BUYINGREQ_CARD_BUTTON.Refresh:
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
							this.setState({
								lineShowType: [],
								vbillcode: res.data.head[formId].rows[0].values.vbillcode.value,
								billId: res.data.head[formId].rows[0].values.pk_praybill.value,
								billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
							});
							let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
							//设置按钮显示
							setBtnShow(_this, fbillstatus);
						}
						//跳转卡片弹出提示框
						showSagaErrorToasts(this.props, formId, ATTRCODE.pk_praybill);
						showSuccessInfo(getLangByResId(this, '4004PRAYBILL-000051')); /* 国际化处理： 刷新成功！*/
						cachedata.call(this, formId);
						cachedata.call(this, tableId);
					}
				});
				break;
			} else {
				let refresh = true;
				pageInfoClick.bind(this, props, null, refresh)();
				return;
			}
		// 保存
		case BUYINGREQ_CARD_BUTTON.Save:
			cancelCommon.call(this, this.props);
			let save = saveBtnClick.bind(this);
			return save(props);
		// 保存提交
		case BUYINGREQ_CARD_BUTTON.SaveCommit:
			cancelCommon.call(this, this.props);
			let savecommit = saveAndCommit.bind(this);
			return savecommit(props);
		// 提交
		case BUYINGREQ_CARD_BUTTON.Commit:
			let commit = commitBtnClick.bind(this);
			return commit(props);
		// 收回
		case BUYINGREQ_CARD_BUTTON.UnCommit:
			let uncommit = unCommitBtnClick.bind(this);
			return uncommit(props);
		//打印
		case BUYINGREQ_CARD_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//合并显示
		case BUYINGREQ_CARD_BUTTON.mergeShow:
			let mergeShow = combineShow.bind(this);
			return mergeShow(props);
		//输出
		case BUYINGREQ_CARD_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		// 取消
		case BUYINGREQ_CARD_BUTTON.Cancel:
			cancelCommon.call(this, this.props);
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		// 新增行
		case BUYINGREQ_CARD_BUTTON.AddLine:
			//let addRow = addRowBtnClick.bind(this);
			//return addRow(props);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			let rowCount = props.cardTable.getNumberOfRows(tableId);
			props.cardTable.addRow(
				tableId,
				rowCount,
				{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
				true
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			break;
		case BUYINGREQ_CARD_BUTTON.TemporaryStorage: //暂存
			tempStorageBtnClick.call(this, this.props);
			break;
		case BUYINGREQ_CARD_BUTTON.ShowDraft: //显示草稿
			this.setState({ showTemp: true });
			break;
		//删除行-肩上按钮 cardTable   record有值走行删除逻辑，没有值走批量处理逻辑
		case BUYINGREQ_CARD_BUTTON.DeleteLine:
			if (record) {
				let indexs = [];
				indexs.push(index);
				let errorMessage = delRowRule.bind(this, props, indexs)();
				if (errorMessage.length > 0) {
					toast({
						color: 'warning',
						content: errorMessage
					});
					break;
				}
				props.cardTable.delRowsByIndex(tableId, index);
				props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
				buttonController.lineSelected.call(this);
			} else {
				let rows = this.props.cardTable.getCheckedRows(BUYINGREQ_CARD.tableId);
				let rowIds = [];
				rows.map((item) => {
					rowIds.push(item.index);
				});
				let errorMess = delRowRule.bind(this, props, rowIds)();
				if (errorMess.length > 0) {
					toast({
						color: 'warning',
						content: errorMess
					});
					break;
				}
				this.props.cardTable.delRowsByIndex(BUYINGREQ_CARD.tableId, rowIds);
				rows.map((index) => {
					props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
				});
				buttonController.lineSelected.call(this);
			}
			break;
		// 肩上-复制行
		case BUYINGREQ_CARD_BUTTON.CopyLine:
			rowCopyPasteUtils.copyRows.call(
				_this,
				props,
				tableId,
				BUYINGREQ_CARD_BUTTON.cardBodyInit,
				BUYINGREQ_CARD_BUTTON.cardBodyCopy
			);
			//RownoUtils.resetRowNo(props, tableId, ATTRCODES.crowno);
			break;
		// 肩上- 复制取消
		case BUYINGREQ_CARD_BUTTON.PasteCancel:
			cancelCommon.call(this, this.props);
			buttonController.lineSelected.call(this);
			break;
		case BUYINGREQ_CARD_BUTTON.PasteLast: // 物料 粘贴至末行
			// 效率优化开启
			props.beforeUpdatePage();
			rowCopyPasteUtils.pasteRowsToTail.call(
				_this,
				props,
				tableId,
				BUYINGREQ_CARD_BUTTON.cardBodyInit,
				BUYINGREQ_CARD_BUTTON.cardBodyCopy,
				[ ATTRCODES.crowno ]
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			// 效率优化关闭
			props.updatePage(formId, tableId);
			break;
		case BUYINGREQ_CARD_BUTTON.PasteThis: // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				_this,
				props,
				tableId,
				index,
				BUYINGREQ_CARD_BUTTON.cardBodyInit,
				BUYINGREQ_CARD_BUTTON.cardBodyCopy,
				[ ATTRCODES.crowno ]
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			break;
		// 复制行
		case BUYINGREQ_CARD_BUTTON.CopyLine_row:
			props.cardTable.pasteRow(tableId, index);
			setPKempty(props, index);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			break;
		// 存量查拣
		case BUYINGREQ_CARD_BUTTON.OnhandQuery:
			let onHand = onHandBtnClick.bind(this, props);
			return onHand(props);
		case BUYINGREQ_CARD_BUTTON.LinkPoPlan: // 联查采购计划
			linkPoPlanBtnClick.call(this, this.props);
			break;
		//批改
		case BUYINGREQ_CARD_BUTTON.BatchUpdate:
			props.cardTable.batchChangeTableData(tableId);
			break;
		//重排行号
		case BUYINGREQ_CARD_BUTTON.EditRowNum:
			this.props.beforeUpdatePage();
			RownoUtils.resetRowNo(props, tableId, ATTRCODES.crowno);
			this.forceUpdate();
			this.props.updatePage(formId, tableId);
			break;
		// 新增
		case BUYINGREQ_CARD_BUTTON.Add:
			let add = addBtnClick.bind(this);
			return add(props);
		// 复制单据
		case BUYINGREQ_CARD_BUTTON.Copy:
			let copy = copyBtnClick.bind(this);
			return copy(props);
		// 返回
		case 'back':
			return backBtnClick(props);
		// 修改
		case BUYINGREQ_CARD_BUTTON.Edit:
			let edit = editBtnClick.bind(this);
			return edit(props);
		// 删除
		case BUYINGREQ_CARD_BUTTON.Delete:
			let del = delBtnClick.bind(this);
			return del(props);
		//展开
		case BUYINGREQ_CARD_BUTTON.OpenRow:
			if (channelType) {
				status = this.state.status;
			}
			console.log(transfer, 111);
			if (transfer) {
				console.log(222);

				status = this.state.status;
			} else {
				console.log(333);
			}
			if (status == BUYINGREQ_CARD.browse) {
				//浏览态
				props.cardTable.toggleRowView(tableId, record);
				this.state.lineShowType[index] = 1;
				this.setState({
					lineShowType: this.state.lineShowType
				});
			} else {
				//编辑态
				props.cardTable.openModel(tableId, BUYINGREQ_CARD.edit, record, index);
			}
			break;
		//收起
		case BUYINGREQ_CARD_BUTTON.CloseRow:
			if (channelType) {
				status = this.state.status;
			}
			if (transfer) {
				status = this.state.status;
			}
			if (status == BUYINGREQ_CARD.browse) {
				//浏览态
				props.cardTable.toggleRowView(tableId, record);
				this.state.lineShowType[index] = 0;
				this.setState({
					lineShowType: this.state.lineShowType
				});
			} else {
				//编辑态
				props.cardTable.openModel(tableId, BUYINGREQ_CARD.edit, record, index);
			}
			break;
		// //删除行-行上按钮
		// case BUYINGREQ_CARD_BUTTON.Delete_row:
		// 	let indexs = [];
		// 	indexs.push(index);
		// 	let errorMessage = delRowRule.bind(this, props, indexs)();
		// 	if (errorMessage.length > 0) {
		// 		toast({
		// 			color: 'warning',
		// 			content: errorMessage
		// 		});
		// 		break;
		// 	}
		// 	props.cardTable.delRowsByIndex(tableId, index);
		// 	props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
		// 	buttonController.lineSelected.call(this);
		// 	break;
		case BUYINGREQ_CARD_BUTTON.InsertLine: //插入行
			props.cardTable.addRow(tableId, index);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			break;
		//整单打开
		case BUYINGREQ_CARD_BUTTON.OpenBill:
			let open = openButtonClick.bind(this);
			return open(props);
		//整单关闭
		case BUYINGREQ_CARD_BUTTON.CloseBill:
			let close = closeButtonClick.bind(this);
			return close(props);
		//行关闭-行上按钮
		case BUYINGREQ_CARD_BUTTON.LineClose:
			let lineClose = closeRowBtnClick.bind(this, props, text, record, index);
			return lineClose(props);
		//行打开-行上按钮
		case BUYINGREQ_CARD_BUTTON.LineOpen:
			let lineOpen = openRowBtnClick.bind(this, props, text, record, index);
			return lineOpen(props);
		case BUYINGREQ_CARD_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		//请购单拉单
		case BUYINGREQ_CARD_BUTTON.StorereqBtn:
			//跳转卡片页之前先清除缓存
			clearTransferCache(props, BUYINGREQ_LIST.transferDataSource);
			props.pushTo(BUYINGREQ_LIST.transferUrl, {
				type: BUYINGREQ_LIST.transfer,
				pagecode: BUYINGREQ_LIST.transferList
			});
			break;
		//退出转单
		case BUYINGREQ_CARD_BUTTON.CancelTransfer:
			let allprocess = props.transferTable.getTransformFormStatus('leftarea');
			if (allprocess === false) {
				showQuitTransferWarningDialog({
					/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
					beSureBtnClick: () => {
						//关闭浏览器提示
						window.onbeforeunload = null;
						//如果是推单过来的直接返回到
						if (channelType) {
							this.props.pushTo(this.state.returnURL, {
								type: this.state.returnType,
								appcode: this.state.appcode,
								pagecode: BUYINGREQ_LIST.transferList
							});
						} else {
							this.props.pushTo(BUYINGREQ_LIST.listUrl, { pagecode: BUYINGREQ_LIST.listpageid });
						}
					}
				});
			} else {
				//关闭浏览器提示
				window.onbeforeunload = null;
				//如果是推单过来的直接返回到
				if (channelType) {
					this.props.pushTo(this.state.returnURL, {
						type: this.state.returnType,
						appcode: this.state.appcode,
						pagecode: BUYINGREQ_LIST.transferList
					});
				} else {
					this.props.pushTo(BUYINGREQ_LIST.listUrl, { pagecode: BUYINGREQ_LIST.listpageid });
				}
			}

			break;
		//附件管理
		case BUYINGREQ_CARD_BUTTON.File:
			let flag = this.state.showUploader;
			this.setState({
				showUploader: !flag
				// target: event.target
			});
			break;
		//审批详情
		case BUYINGREQ_CARD_BUTTON.ApproveInfo:
			let billId = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value;
			let billtype = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.vtrantypecode).value;
			this.setState({
				show: true,
				billId: billId,
				billtype: billtype
			});
			break;
		case BUYINGREQ_LIST_BUTTON.PrintCountQuery:
			let CONST = { hid: ATTRCODE.pk_praybill, area: BUYINGREQ_CARD.formId };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
	}
	// 友云采按钮扩展 add by guozhq
	if (YYC_BUTTON_ARRAY.includes(id)) {
		reqYYCBtnClick.call(this, props, id, {
			isCard: true,
			cardheadarea: formId,
			cardbodyarea: tableId,
			billidField: 'pk_praybill',
			billbidField: 'pk_praybill_b',
			pageCode: BUYINGREQ_CARD.cardpageid
		});
	}
}
function setPKempty(props, index) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	props.cardTable.setValByKeyAndIndex(BUYINGREQ_CARD.tableId, index, 'crowno', empty);
}
function cancelCommon(props) {
	//防止有人脑残，点击肩上复制行之后直接点击保存或者取消导致 肩部和行按钮显示出错
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		BUYINGREQ_CARD.tableId,
		BUYINGREQ_CARD_BUTTON.cardBodyInit,
		BUYINGREQ_CARD_BUTTON.cardBodyCopy
	);
}
