/*
 * @Author: zhangchangqing
 * @PageInfo: 按钮点击事件
 * @Date: 2018-04-19 10:37:30
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-24 18:40:38
 */
import backBtnClick from '../btnClicks/backBtnClick';
import addBtnClick from '../btnClicks/addBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import saveCommitBtnClick from '../btnClicks/saveCommitBtnClick';
import rowBtnClick from '../btnClicks/rowBtnClick';
import copyBtnClick from '../btnClicks/copyBtnClick';
import closeRowBtnClick from '../btnClicks/closeRowBtnClick';
import onHandBtnClick from '../btnClicks/onHandQueryBtn';
import openRowBtnClick from '../btnClicks/openRowBtnClick';
import openButtonClick from '../btnClicks/openBillBtnClick'; //整单打开，整单关闭
import closeButtonClick from '../btnClicks/closeBillBtnClick'; //整单打开，整单关闭
import commitBtnClick from '../btnClicks/commitBtnClick'; //提交
import unCommitBtnClick from '../btnClicks/unCommitBtnClick'; //提交
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n
import output_BtnClick from '../btnClicks/output_BtnClick'; //打印n
import pageInfoClick from '../btnClicks/pageInfoClick';
import combineShow from '../btnClicks/combineShow'; //合并显示
import { setBtnShow } from '../btnClicks/pageInfoClick';
import {
	STOREREQ_LIST_BUTTON,
	STOREREQ_CARD_BUTTON,
	STOREREQ_LIST,
	STOREREQ_CARD,
	ATTRCODES,
	ATTRCODE,
	NCMODULE
} from '../../siconst';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import {
	showWarningDialog,
	showSuccessInfo,
	showQuitTransferWarningDialog,
	showBackWarningDialog
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax } from 'nc-lightapp-front';
import { buttonController } from './index';
import { saveAndCommit } from '../btnClicks/index';
import sysModuleCheck from '../../../pub/remoteCall/sysModuleCheck';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
import tempStorageBtnClick from '../btnClicks/tempStorageBtnClick';

export default function clickBtn(props, id, text, record, index) {
	let _this = this;

	let tableId = STOREREQ_CARD.tableId;
	let formId = STOREREQ_CARD.formId;
	//拉单
	let transfer = props.getUrlParam(STOREREQ_CARD.type);
	switch (id) {
		//刷新
		case STOREREQ_CARD_BUTTON.Refresh:
			let data = { keyword: this.state.billId, pageid: this.pageId };
			if (transfer) {
				ajax({
					url: STOREREQ_CARD.queryCardInfoURL,
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
								billId: res.data.head[formId].rows[0].values.pk_storereq.value,
								billtype: res.data.head[formId].rows[0].values.vtrantypecode.value
							});
							let fbillstatus = res.data.head[formId].rows[0].values.fbillstatus.value;
							//设置按钮显示
							setBtnShow(_this, fbillstatus);
						}
						showSuccessInfo(getLangByResId(this, '4004STOREREQ-000040')); /* 国际化处理： 刷新成功！*/
						//cachedata.call(this, formId);
						//cachedata.call(this, tableId);
					}
				});
				break;
			} else {
				let refresh = true;
				pageInfoClick.bind(this, props, null, refresh)();
				return;
			}
		// 保存
		case STOREREQ_CARD_BUTTON.Save:
			cancelCommon.call(this, this.props);
			let save = saveBtnClick.bind(this);
			return save(props);
		// 保存提交
		case STOREREQ_CARD_BUTTON.SaveCommit:
			cancelCommon.call(this, this.props);
			saveAndCommit.call(this);
			return;
		// 提交
		case STOREREQ_CARD_BUTTON.Commit:
			let commit = commitBtnClick.bind(this);
			return commit(props);
		//合并显示
		case STOREREQ_CARD_BUTTON.mergeShow:
			let mergeShow = combineShow.bind(this);
			return mergeShow(props);
		//打印
		case STOREREQ_CARD_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//输出
		case STOREREQ_CARD_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		// 收回
		case STOREREQ_CARD_BUTTON.UnCommit:
			let uncommit = unCommitBtnClick.bind(this);
			return uncommit(props);
		// 取消
		case STOREREQ_CARD_BUTTON.Cancel:
			cancelCommon.call(this, this.props);
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		case STOREREQ_CARD_BUTTON.TemporaryStorage: //暂存
			tempStorageBtnClick.call(this, this.props);
			break;
		case STOREREQ_CARD_BUTTON.ShowDraft: //显示草稿
			this.setState({ showTemp: true });
			break;
		// 新增行
		case STOREREQ_CARD_BUTTON.AddLine:
			// props.cardTable.addRow(STOREREQ_CARD.tableId);
			let rowCount = props.cardTable.getNumberOfRows(STOREREQ_CARD.tableId);
			props.cardTable.addRow(
				STOREREQ_CARD.tableId,
				rowCount,
				{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
				true
			);
			RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			break;
		// 删除行  record有值走行删除逻辑，没有值走批量处理逻辑
		case STOREREQ_CARD_BUTTON.DeleteLine:
			if (record) {
				props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, index);
				props.cardTable.saveChangedRowsOldValue(STOREREQ_CARD.tableId, index, ATTRCODES.pk_material, null);
				buttonController.lineSelected.call(this);
			} else {
				let rows = this.props.cardTable.getCheckedRows(STOREREQ_CARD.tableId);
				let rowIds = [];
				rows.map((item) => {
					rowIds.push(item.index);
				});
				this.props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, rowIds, false);
				rows.map((index) => {
					props.cardTable.saveChangedRowsOldValue(STOREREQ_CARD.tableId, index, ATTRCODES.pk_material, null);
				});
				buttonController.lineSelected.call(this);
			}
			break;
		// 肩上-复制行
		case STOREREQ_CARD_BUTTON.CopyLine:
			rowCopyPasteUtils.copyRows.call(
				_this,
				props,
				STOREREQ_CARD.tableId,
				STOREREQ_CARD_BUTTON.cardBodyInit,
				STOREREQ_CARD_BUTTON.cardBodyCopy
			);
			//RownoUtils.resetRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			break;
		// 肩上- 复制取消
		case STOREREQ_CARD_BUTTON.PasteCancel:
			cancelCommon.call(this, this.props);
			buttonController.lineSelected.call(this);
			break;
		case STOREREQ_CARD_BUTTON.PasteLast: // 物料 粘贴至末行
			// 效率优化开启
			props.beforeUpdatePage();
			rowCopyPasteUtils.pasteRowsToTail.call(
				_this,
				props,
				STOREREQ_CARD.tableId,
				STOREREQ_CARD_BUTTON.cardBodyInit,
				STOREREQ_CARD_BUTTON.cardBodyCopy,
				[ ATTRCODES.crowno ]
			);
			RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			// 效率优化关闭
			props.updatePage(STOREREQ_CARD.formId, tableId);
			break;
		case STOREREQ_CARD_BUTTON.PasteThis: // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				_this,
				props,
				STOREREQ_CARD.tableId,
				index,
				STOREREQ_CARD_BUTTON.cardBodyInit,
				STOREREQ_CARD_BUTTON.cardBodyCopy,
				[ ATTRCODES.crowno ]
			);
			RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			break;
		// 行上-复制行
		case STOREREQ_CARD_BUTTON.CopyLine_row:
			props.cardTable.pasteRow(STOREREQ_CARD.tableId, index);
			setPKempty(props, index);
			RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			break;
		case STOREREQ_CARD_BUTTON.InsertLine: //插入行
			props.cardTable.addRow(STOREREQ_CARD.tableId, index);
			RownoUtils.setRowNo(props, STOREREQ_CARD.tableId, ATTRCODES.crowno);
			break;
		//批改
		case STOREREQ_CARD_BUTTON.BatchUpdate:
			props.cardTable.batchChangeTableData(STOREREQ_CARD.tableId);
			break;
		//重排行号
		case STOREREQ_CARD_BUTTON.EditRowNum:
			let rowB = rowBtnClick.bind(this);
			return rowB(props);
		// 新增
		case STOREREQ_CARD_BUTTON.Add:
			let add = addBtnClick.bind(this);
			return add(props);
		case STOREREQ_CARD_BUTTON.AddFrom4D14:
			sysModuleCheck.call(this, NCMODULE.PIM, getLangByResId(this, '4004STOREREQ-000059'), () => {
				//跳转卡片页之前先清除缓存
				clearTransferCache(props, STOREREQ_LIST.transferDataSource);
				props.pushTo(STOREREQ_LIST.transferUrl, {
					type: STOREREQ_LIST.transfer,
					pagecode: STOREREQ_LIST.transferList
				});
			});
			break;
		// 复制单据
		case STOREREQ_CARD_BUTTON.Copy:
			let copy = copyBtnClick.bind(this);
			return copy(props);
		// 返回
		case 'Back':
			// 是否有未处理的单据
			let isleft = this.props.transferTable.getTransformFormStatus('leftarea');
			if (isleft === false) {
				showBackWarningDialog({
					/* 国际化处理： 提示,有未处理完的单据，是否退出转单*/
					beSureBtnClick: () => {
						window.onbeforeunload = null;
						this.props.pushTo(this.state.returnURL, {
							type: this.state.returnType
						});
					}
				});
			} else {
				this.props.pushTo(this.state.returnURL, {
					type: this.state.returnType
				});
			}
			break;
		//退出转单
		case STOREREQ_CARD_BUTTON.CancelTransfer:
			let allprocess = props.transferTable.getTransformFormStatus('leftarea');
			if (allprocess === false) {
				showQuitTransferWarningDialog({
					/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
					beSureBtnClick: () => {
						//关闭浏览器提示
						window.onbeforeunload = null;
						//如果是推单过来的直接返回到
						if (transfer) {
							this.props.pushTo(STOREREQ_LIST.listUrl, { pagecode: STOREREQ_LIST.listpageid });
						}
					}
				});
			} else {
				//关闭浏览器提示
				window.onbeforeunload = null;
				//如果是推单过来的直接返回到
				if (transfer) {
					this.props.pushTo(STOREREQ_LIST.listUrl, { pagecode: STOREREQ_LIST.listpageid });
				}
			}

			break;
		// 修改
		case STOREREQ_CARD_BUTTON.Edit:
			let edit = editBtnClick.bind(this);
			return edit(props);
		// 删除
		case STOREREQ_CARD_BUTTON.Delete:
			let del = delBtnClick.bind(this);
			return del(props);
		//展开
		case STOREREQ_CARD_BUTTON.OpenRow:
			let status = props.getUrlParam(STOREREQ_CARD.status);

			if (status == STOREREQ_CARD.browse) {
				//浏览态
				props.cardTable.toggleRowView(STOREREQ_CARD.tableId, record);
				this.state.lineShowType[index] = 1;
				this.setState({
					lineShowType: this.state.lineShowType
				});
			} else {
				//编辑态
				props.cardTable.openModel(STOREREQ_CARD.tableId, STOREREQ_CARD.edit, record, index);
			}
			break;
		//收起
		case STOREREQ_CARD_BUTTON.CloseRow:
			let statuss = props.getUrlParam(STOREREQ_CARD.status);

			if (statuss == STOREREQ_CARD.browse) {
				//浏览态
				props.cardTable.toggleRowView(STOREREQ_CARD.tableId, record);
				this.state.lineShowType[index] = 0;
				this.setState({
					lineShowType: this.state.lineShowType
				});
			} else {
				//编辑态
				props.cardTable.openModel(STOREREQ_CARD.tableId, STOREREQ_CARD.edit, record, index);
			}
			break;
		// //删除行-行上按钮
		// case STOREREQ_CARD_BUTTON.Delete_row:
		// 	props.cardTable.delRowsByIndex(STOREREQ_CARD.tableId, index);
		// 	props.cardTable.saveChangedRowsOldValue(STOREREQ_CARD.tableId, index, ATTRCODES.pk_material, null);
		// 	buttonController.lineSelected.call(this);
		// 	break;
		//整单打开
		case STOREREQ_CARD_BUTTON.OpenBill:
			let open = openButtonClick.bind(this);
			return open(props);
		//整单关闭
		case STOREREQ_CARD_BUTTON.CloseBill:
			let close = closeButtonClick.bind(this);
			return close(props);
		//行关闭-行上按钮
		case STOREREQ_CARD_BUTTON.LineClose:
			let lineClose = closeRowBtnClick.bind(this, props, text, record, index);
			return lineClose(props);
		//行打开-行上按钮
		case STOREREQ_CARD_BUTTON.LineOpen:
			let lineOpen = openRowBtnClick.bind(this, props, text, record, index);
			return lineOpen(props);
		//单据追溯
		case STOREREQ_CARD_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
		//附件管理
		case STOREREQ_CARD_BUTTON.File:
			let flag = this.state.showUploader;
			this.setState({
				showUploader: !flag
				// target: event.target
			});
			break;
		//审批详情
		case STOREREQ_CARD_BUTTON.ApproveInfo:
			let billId = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq).value;
			let billtype = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.vtrantypecode).value;
			this.setState({
				show: true,
				billtype: billtype,
				billId: billId
			});
			break;
		//存量查拣
		case STOREREQ_CARD_BUTTON.OnhandQuery:
			let onHand = onHandBtnClick.bind(this, props);
			return onHand(props);
		case STOREREQ_LIST_BUTTON.PrintCountQuery: //打印次数查询
			let CONST = { hid: ATTRCODE.pk_storereq, area: STOREREQ_CARD.formId };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
	}
}
function showOnhandBtnSelected(props) {
	let rowsdata = props.cardTable.getCheckedRows(STOREREQ_CARD.tableId);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[STOREREQ_CARD_BUTTON.DeleteLine]: rowsflag,
		[STOREREQ_CARD_BUTTON.CopyLine]: rowsflag,
		//[STOREREQ_CARD_BUTTON.OnhandQuery]: rowsflag,
		[STOREREQ_CARD_BUTTON.EditRowNum]: rowsflag
	};
	props.button.setDisabled(disableArr);
}
function setPKempty(props, index) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	props.cardTable.setValByKeyAndIndex(STOREREQ_CARD.tableId, index, 'crowno', empty);
}
function cancelCommon(props) {
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		STOREREQ_CARD.tableId,
		STOREREQ_CARD_BUTTON.cardBodyInit,
		STOREREQ_CARD_BUTTON.cardBodyCopy
	);
}
