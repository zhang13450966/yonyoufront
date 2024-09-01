/*
 * @Author: zhangchangqing 
 * @PageInfo: 按钮点击事件 
 * @Date: 2018-04-19 10:37:30 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-06 10:43:32
 */
import backBtnClick from '../btnClicks/backBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import delRowRule from '../btnClicks/delRowRule';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import rowBtnClick from '../btnClicks/rowBtnClick';
import linkBtnClick from '../btnClicks/linkBtnClick'; //单据追溯
import onHandBtnClick from '../btnClicks/onHandQueryBtn'; //存量查拣
import print_BtnClick from '../btnClicks/print_BtnClick'; //打印n
import output_BtnClick from '../btnClicks/output_BtnClick'; //输出
import reviseHistory_BtnClick from '../btnClicks/reviseHistory_BtnClick'; //修订历史
import commitBtnClick from '../btnClicks/commitBtnClick'; //提交
import unCommitBtnClick from '../btnClicks/unCommitBtnClick'; //收回
import saveAndCommit from '../btnClicks/saveAndCommit'; //保存提交
import reviseDeleteBtnClick from '../btnClicks/reviseDeleteBtnClick'; //修订删除
import { BUYINGREQ_CARD_BUTTON, BUYINGREQ_CARD, ATTRCODES, ATTRCODE } from '../../siconst';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { toast } from 'nc-lightapp-front';
import pageInfoClick from '../btnClicks/pageInfoClick';
import { buttonController } from './index';
import linkPoPlanBtnClick from '../btnClicks/linkPoPlanBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
export default function(props, id, text, record, index) {
	let _this = this;
	let _props = props;
	let tableId = BUYINGREQ_CARD.tableId;
	switch (id) {
		//刷新
		case BUYINGREQ_CARD_BUTTON.Refresh:
			let refresh = true;
			pageInfoClick.bind(this, props, null, null, refresh)();
			return;
		// 保存
		case BUYINGREQ_CARD_BUTTON.Save:
			cancelCommon.call(this, this.props);
			let save = saveBtnClick.bind(this);
			return save(props);
		//查看修订详情
		case BUYINGREQ_CARD_BUTTON.ReviseHistory:
			return reviseHistory_BtnClick.bind(this)(props);
		case BUYINGREQ_CARD_BUTTON.Cancel:
			cancelCommon.call(this, this.props);
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		//打印
		case BUYINGREQ_CARD_BUTTON.Print:
			let print = print_BtnClick.bind(this, props);
			return print(props);
		//输出
		case BUYINGREQ_CARD_BUTTON.output:
			let output = output_BtnClick.bind(this, props);
			return output(props);
		// 新增行
		case BUYINGREQ_CARD_BUTTON.AddLine:
			//props.cardTable.addRow(tableId);
			//RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			// RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			let rowCount = props.cardTable.getNumberOfRows(tableId);
			props.cardTable.addRow(
				tableId,
				rowCount,
				{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
				true
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			break;
		// 删除行 record有值走行删除逻辑，没有值走批量处理逻辑
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
					// break;
				}
				// props.cardTable.delRowsByIndex(tableId, index);
				props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
				buttonController.lineSelected.call(this);
			} else {
				let rows = this.props.cardTable.getCheckedRows(BUYINGREQ_CARD.tableId);
				let rowIds = [];
				rows.map((item, index) => {
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
				// this.props.cardTable.delRowsByIndex(BUYINGREQ_CARD.tableId, rowIds);
				rows.map((index) => {
					props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
				});
				buttonController.lineSelected.call(this);
			}
			break;
		case BUYINGREQ_CARD_BUTTON.InsertLine: //插入行
			props.cardTable.addRow(tableId, index);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
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
				[
					ATTRCODES.crowno,
					ATTRCODES.pk_praybill_b,
					ATTRCODES.pk_srcpraybillb,
					ATTRCODES.nquotebill,
					ATTRCODES.npriceauditbill,
					ATTRCODES.ngenct,
					ATTRCODES.naccumulatenum
				]
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			// 效率优化关闭
			props.updatePage(BUYINGREQ_CARD.formId, tableId);
			break;
		case BUYINGREQ_CARD_BUTTON.PasteThis: // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				_this,
				props,
				tableId,
				index,
				BUYINGREQ_CARD_BUTTON.cardBodyInit,
				BUYINGREQ_CARD_BUTTON.cardBodyCopy,
				[
					ATTRCODES.crowno,
					ATTRCODES.pk_praybill_b,
					ATTRCODES.pk_srcpraybillb,
					ATTRCODES.nquotebill,
					ATTRCODES.npriceauditbill,
					ATTRCODES.ngenct,
					ATTRCODES.naccumulatenum
				]
			);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
			buttonController.lineSelected.call(this);
			break;
		// 复制行
		case BUYINGREQ_CARD_BUTTON.CopyLine_row:
			props.cardTable.pasteRow(tableId, index);
			setPKempty(props, index);
			RownoUtils.setRowNo(props, tableId, ATTRCODES.crowno);
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
			props.cardTable.batchChangeTableData(BUYINGREQ_CARD.tableId);
			break;
		//重排行号
		case BUYINGREQ_CARD_BUTTON.EditRowNum:
			let rowB = rowBtnClick.bind(this);
			return rowB(props);
		// 返回
		case 'back':
			return backBtnClick(props);
		// 修改,修订
		case BUYINGREQ_CARD_BUTTON.Revise:
			let edit = editBtnClick.bind(this);
			return edit(props);
		//展开
		case BUYINGREQ_CARD_BUTTON.OpenRow:
			let status = props.getUrlParam(BUYINGREQ_CARD.status);
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
			let statuss = props.getUrlParam(BUYINGREQ_CARD.status);
			if (statuss == BUYINGREQ_CARD.browse) {
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
		//单据追溯
		case BUYINGREQ_CARD_BUTTON.QueryAboutBusiness:
			let linkQuery = linkBtnClick.bind(this);
			return linkQuery(props);
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
		// 提交
		case BUYINGREQ_CARD_BUTTON.Commit:
			let commit = commitBtnClick.bind(this);
			return commit(props);
		// 收回
		case BUYINGREQ_CARD_BUTTON.UnCommit:
			let uncommit = unCommitBtnClick.bind(this);
			return uncommit(props);
		// 保存提交
		case BUYINGREQ_CARD_BUTTON.SaveCommit:
			let saveCommit = saveAndCommit.bind(this);
			return saveCommit(props);
		// 修订删除
		case BUYINGREQ_CARD_BUTTON.ReviseDelete:
			let reviseDelete = reviseDeleteBtnClick.bind(this);
			return reviseDelete(props);
		case BUYINGREQ_CARD_BUTTON.PrintCountQuery: //打印次数查询
			let CONST = { hid: ATTRCODE.pk_praybill, area: BUYINGREQ_CARD.formId };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
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
