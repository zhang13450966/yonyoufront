/*
 * @Author: zhangchangqing
 * @PageInfo: 按钮点击事件
 * @Date: 2018-04-19 10:37:30
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:26:56
 */
import backBtnClick from '../btnClicks/backBtnClick';
import addBtnClick from '../btnClicks/addBtnClick';
import delBtnClick from '../btnClicks/delBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import cancelBtnClick from '../btnClicks/cancelBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import commitBtnClick from '../btnClicks/commitBtnClick'; //提交
import unCommitBtnClick from '../btnClicks/unCommitBtnClick'; //收回
import { TARGETADJ_CARD_BUTTON, TARGETADJ_CARD, TARGETADJ_LIST, ATTRCODES, ATTRCODE } from '../../siconst';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import pageInfoClick from '../btnClicks/pageInfoClick';
import { buttonController } from './index';
import { saveAndCommit, refreshBtnClick } from '../btnClicks/index';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props, id, text, record, index) {
	let tableId = TARGETADJ_CARD.tableId;
	//推单
	let channelType = props.getUrlParam(TARGETADJ_CARD.channelType);
	let status = props.getUrlParam(TARGETADJ_CARD.status);
	//拉单
	let transfer = props.getUrlParam(TARGETADJ_CARD.type);

	switch (id) {
		case TARGETADJ_CARD_BUTTON.Price:
			let pk = this.props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value;
			setDefData(TARGETADJ_LIST.dataSource, 'pricekeyword', pk);
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
							appcode: this.state.appcode
						});
					}
				});
			} else {
				this.props.pushTo(this.state.returnURL, {
					type: this.state.returnType,
					appcode: this.state.appcode
				});
			}
			break;
		//刷新
		case TARGETADJ_CARD_BUTTON.Refresh:
			let data = { keyword: this.state.billId, pageid: this.pageId };
			if (channelType || transfer) {
				refreshBtnClick.call(props, data);
				break;
			} else {
				let refresh = true;
				pageInfoClick.bind(this, props, null, refresh)();
				return;
			}
		// 保存
		case TARGETADJ_CARD_BUTTON.Save:
			cancelCommon.call(this, this.props);
			let save = saveBtnClick.bind(this);
			return save(props);
		// 保存提交
		case TARGETADJ_CARD_BUTTON.SaveCommit:
			cancelCommon.call(this, this.props);
			saveAndCommit.call(this);
			return;
		// 提交
		case TARGETADJ_CARD_BUTTON.Commit:
			let commit = commitBtnClick.bind(this);
			return commit(props);
		// 收回
		case TARGETADJ_CARD_BUTTON.UnCommit:
			let uncommit = unCommitBtnClick.bind(this);
			return uncommit(props);
		// 取消
		case TARGETADJ_CARD_BUTTON.Cancel:
			cancelCommon.call(this, this.props);
			let cancel = cancelBtnClick.bind(this);
			return cancel(props);
		// 新增行
		case TARGETADJ_CARD_BUTTON.AddLine:
			props.cardTable.addRow(tableId);
			break;
		//删除行-肩上按钮 cardTable   record有值走行删除逻辑，没有值走批量处理逻辑
		case TARGETADJ_CARD_BUTTON.DeleteLine:
			if (record) {
				let indexs = [];
				indexs.push(index);
				props.cardTable.delRowsByIndex(tableId, index);
				props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.ccustomerid, null);
				buttonController.lineSelected.call(this);
			} else {
				let rows = this.props.cardTable.getCheckedRows(TARGETADJ_CARD.tableId);
				let rowIds = [];
				rows.map((item) => {
					rowIds.push(item.index);
				});
				this.props.cardTable.delRowsByIndex(TARGETADJ_CARD.tableId, rowIds);
				rows.map((index) => {
					props.cardTable.saveChangedRowsOldValue(tableId, index, ATTRCODES.pk_material, null);
				});
				buttonController.lineSelected.call(this);
			}
			break;
		// 新增
		case TARGETADJ_CARD_BUTTON.Adds:
			let add = addBtnClick.bind(this);
			return add(props);
		// 返回
		case 'back':
			return backBtnClick(props);
		// 修改
		case TARGETADJ_CARD_BUTTON.Edit:
			let edit = editBtnClick.bind(this);
			return edit(props);
		// 删除
		case TARGETADJ_CARD_BUTTON.Delete:
			let del = delBtnClick.bind(this);
			return del(props);
		case TARGETADJ_CARD_BUTTON.InsertLine: //插入行
			props.cardTable.addRow(tableId, index);
			break;
		//附件管理
		case TARGETADJ_CARD_BUTTON.File:
			let billId = props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value;

			let flag = this.state.showUploader;
			this.setState({
				billId: billId,
				showUploader: !flag
			});
			break;
		//审批详情
		case TARGETADJ_CARD_BUTTON.ApproveInfo:
			this.setState({
				show: true,
				billId: props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value
			});
			break;
	}
}
function cancelCommon(props) {
	//防止有人脑残，点击肩上复制行之后直接点击保存或者取消导致 肩部和行按钮显示出错
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		TARGETADJ_CARD.tableId,
		TARGETADJ_CARD_BUTTON.cardBodyInit,
		TARGETADJ_CARD_BUTTON.cardBodyCopy
	);
}
