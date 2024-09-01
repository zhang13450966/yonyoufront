/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-03 20:28:55
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-05-16 14:30:12
 */
import { BUTTON } from '../../constance';
import {
	cancelButton,
	deleteBtnClick,
	editButton,
	saveBtnClick,
	print_BtnClick,
	stockQuery,
	supplierApQuery,
	checkDataPermission,
	pageInfoClick,
	linkPoPlanBtnClick,
	commitButton,
	uncommitButton,
	saveAndCommitButton,
	bizInfoBtnClick,
	delRowRule,
	pricequery,
	coopPriceQuery
} from '../btnClicks/index';
import reviseHistory_BtnClick from '../btnClicks/reviseHistory_BtnClick';
import { PAGECODE, URL, STATUS, FIELD, LIST_BUTTON } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { showSuccessInfo, showErrorInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from './index';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';
import { ajax } from 'nc-lightapp-front';

export default function(props, key, text, record, index) {
	let _this = this;
	// let pk = this.props.getUrlParam(FIELD.id);
	let pk = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	let pk_src = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_srcorder).value;
	let clearitems = [
		FIELD.crowno,
		'pk_order_b',
		'pk_srcorder_b',
		'bcompare',
		'naccumarrvnum',
		'naccumstorenum',
		'naccuminvoicenum',
		'naccumwastnum',
		'nbackstorenum',
		'naccumrpnum',
		'nbackarrvnum',
		'naccumdevnum',
		'nfeemny',
		'naccuminvoicemny',
		'nacccancelinvmny',
		'naccumpickupnum',
		'bstockclose',
		'binvoiceclose',
		'barriveclose',
		'bpayclose'
	];

	if (pk_src != null) {
		pk = pk_src;
	}

	let first = true;
	// let isbcompare = false;
	let table = props.cardTable.getAllData(PAGECODE.cardbody);

	switch (key) {
		case BUTTON.Revise: // 修改
			let bfinalclose = props.form.getFormItemsValue(PAGECODE.cardhead, 'bfinalclose');
			if (bfinalclose && bfinalclose.value) {
				showWarningInfo(getLangByResId(this, '4004ORDERREVISE-000028') /* 国际化处理： 该订单已最终关闭，如需修订，请打开*/);
			} else {
				checkDataPermission.call(this, record, 'revise', () => {
					editButton.bind(this, props)();
				});
			}
			break;
		case BUTTON.Revised_Record_Info: //修订历史
			return reviseHistory_BtnClick.call(this, props);
			break;
		case BUTTON.Delete: // 删除
			//取到表体所有行 判断每行是否存在下游单据，存在则不能删除
			// table.rows.map((o) => {
			// 	if (first) {
			// 		let naccumarrvnum = o.values.naccumarrvnum.value;
			// 		let naccumstorenum = o.values.naccumstorenum.value;
			// 		let naccuminvoicenum = o.values.naccuminvoicenum.value;
			// 		naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
			// 		naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
			// 		naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
			// 		if (naccumarrvnum > 0 || naccumstorenum > 0 || naccuminvoicenum > 0) {
			// 			first = false;
			// 		}
			// 	}
			// });
			// setTimeout(() => {
			// 	if (first != false) {
			// 		deleteBtnClick.call(this, this.props);
			// 	} else {
			// 		showErrorInfo(
			// 			getLangByResId(this, '4004ORDERREVISE-000004'),
			// 			getLangByResId(this, '4004ORDERREVISE-000005'),
			// 			null
			// 		); /* 国际化处理： 提示,不能删除*/
			// 	}
			// }, 0);
			deleteBtnClick.call(this, this.props);
			break;
		case BUTTON.Back:
			props.linkBack();
			break;
		case BUTTON.Cancel: // 取消
			cancelButton.bind(this, props)();
			break;
		case BUTTON.Save: // 保存
			saveBtnClick.call(this, props);
			break;
		case BUTTON.Commit: // 提交
			commitButton.call(this, props);
			break;
		case BUTTON.SaveCommit: // 保存提交
			saveAndCommitButton.call(this, this.skipCodes);
			break;
		case BUTTON.UnCommit: // 收回
			uncommitButton.call(this);
			break;
		case BUTTON.Material_AddLine: // 物料信息增行
			// props.cardTable.addRow(PAGECODE.cardbody);
			let rowCount = props.cardTable.getNumberOfRows(PAGECODE.cardbody);
			props.cardTable.addRow(
				PAGECODE.cardbody,
				rowCount,
				{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
				true
			);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			break;
		case BUTTON.openbrowse: //展开物料浏览行
			props.cardTable.toggleRowView(PAGECODE.cardbody, record);
			break;
		case BUTTON.openedit: //侧拉物料信息
			props.cardTable.openModel(PAGECODE.cardbody, STATUS.edit, record, index);
			break;
		case BUTTON.Material_AddLine: //物料肩部 增行
			props.cardTable.addRow(PAGECODE.cardbody);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			break;
		case BUTTON.materialDeleteLine: //物料肩部 删行
			// let pk_src = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_srcorder).value;
			let conditionData = {
				pks: [ pk_src ],
				pageid: PAGECODE.cardcode
			};
			if (!pk_src || pk_src == '' || pk_src == null) {
				//原始版本按照当前页面的数据判断
				if (record) {
					let errorMessage = '';
					let naccumarrvnum = record.values.naccumarrvnum.value;
					let naccumstorenum = record.values.naccumstorenum.value;
					let naccuminvoicenum = record.values.naccuminvoicenum.value;
					let naccumdevnum = record.values.naccumdevnum.value;

					let naccpayreqmny = record.values.naccpayreqmny.value;
					let naccpaymny = record.values.naccpaymny.value;

					let binvoiceclose = record.values.binvoiceclose.value; //开票关闭
					let barriveclose = record.values.barriveclose.value; //到货关闭
					let bpayclose = record.values.bpayclose.value; //付款关闭
					let bstockclose = record.values.bstockclose.value; //入库关闭

					naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
					naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
					naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
					naccumdevnum = naccumdevnum == null ? 0 : naccumdevnum;

					naccpayreqmny = naccpayreqmny == null ? 0 : naccpayreqmny;
					naccpaymny = naccpaymny == null ? 0 : naccpaymny;

					let crowno = record.values.crowno.value;
					if (
						naccumarrvnum > 0 ||
						naccumstorenum > 0 ||
						naccuminvoicenum > 0 ||
						naccumdevnum > 0 ||
						naccpayreqmny > 0 ||
						naccpaymny > 0 ||
						binvoiceclose ||
						barriveclose ||
						bpayclose ||
						bstockclose
					) {
						errorMessage = errorMessage + getLangByResId(this, '4004ORDERREVISE-000005', { 0: crowno });
					} else {
						props.cardTable.delRowsByIndex(PAGECODE.cardbody, index);
						materialSelected(props);
					}
					if (errorMessage.length > 0) {
						showErrorInfo(errorMessage); /* 国际化处理： 提示,不能删除*/
					}
				} else {
					let errorMessage = '';
					let selectedRow = props.cardTable.getCheckedRows(PAGECODE.cardbody);
					if (selectedRow == null || selectedRow.length == 0) {
						toast({
							color: 'warning',
							content: getLangByResId(this, '4004ORDERREVISE-000006')
						});
						return;
					}
					let deleteIndex = new Array();
					selectedRow.map((item) => {
						let naccumarrvnum = item.data.values.naccumarrvnum.value;
						let naccumstorenum = item.data.values.naccumstorenum.value;
						let naccuminvoicenum = item.data.values.naccuminvoicenum.value;
						let naccumdevnum = item.data.values.naccumdevnum.value;

						let naccpayreqmny = item.data.values.naccpayreqmny.value;
						let naccpaymny = item.data.values.naccpaymny.value;

						let crowno = item.data.values.crowno.value;
						naccumarrvnum = naccumarrvnum == null ? 0 : naccumarrvnum;
						naccumstorenum = naccumstorenum == null ? 0 : naccumstorenum;
						naccuminvoicenum = naccuminvoicenum == null ? 0 : naccuminvoicenum;
						naccumdevnum = naccumdevnum == null ? 0 : naccumdevnum;

						naccpayreqmny = naccpayreqmny == null ? 0 : naccpayreqmny;
						naccpaymny = naccpaymny == null ? 0 : naccpaymny;

						let binvoiceclose = item.data.values.binvoiceclose.value; //开票关闭
						let barriveclose = item.data.values.barriveclose.value; //到货关闭
						let bpayclose = item.data.values.bpayclose.value; //付款关闭
						let bstockclose = item.data.values.bstockclose.value; //入库关闭
						if (
							naccumarrvnum > 0 ||
							naccumstorenum > 0 ||
							naccuminvoicenum > 0 ||
							naccumdevnum > 0 ||
							naccpayreqmny > 0 ||
							naccpaymny > 0 ||
							binvoiceclose ||
							barriveclose ||
							bpayclose ||
							bstockclose
						) {
							errorMessage = errorMessage + getLangByResId(this, '4004ORDERREVISE-000005', { 0: crowno });
						} else {
							deleteIndex.push(item.index);
						}
					});
					if (errorMessage.length > 0) {
						showErrorInfo(errorMessage); /* 国际化处理： 提示,不能删除*/
					}
					props.cardTable.delRowsByIndex(PAGECODE.cardbody, deleteIndex);
					materialSelected(props);
				}
			} else {
				if (record) {
					let map = new Map();
					let rownummap = new Map();
					let pk_srcorder_b = record.values.pk_srcorder_b.value;
					if (pk_srcorder_b == null || pk_srcorder_b == '') {
						props.cardTable.delRowsByIndex(PAGECODE.cardbody, index);
						materialSelected(props);
					} else {
						let srcpks = [];
						let indexs = [];
						let crowno = record.values.crowno.value;
						indexs.push(index);
						map.set(pk_srcorder_b, index);
						rownummap.set(pk_srcorder_b, crowno);
						srcpks.push(pk_srcorder_b);
						let errorMessage = delRowRule.bind(
							this,
							props,
							conditionData,
							indexs,
							map,
							rownummap,
							srcpks
						)();
						if (errorMessage.length > 0) {
							showErrorInfo(errorMessage); /* 国际化处理： 提示,不能删除*/
						}
						props.cardTable.delRowsByIndex(PAGECODE.cardbody, this.delindex);
						this.delindex = [];
						materialSelected(props);
					}
				} else {
					let rows = this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
					let rowIds = [];
					let srcpks = [];
					let map = new Map();
					let rownummap = new Map();
					rows.map((item, index) => {
						let pk_srcorder_b = item.data.values.pk_srcorder_b.value;
						let crowno = item.data.values.crowno.value;
						if (pk_srcorder_b == null || pk_srcorder_b == '') {
							this.delindex.push(item.index);
						} else {
							srcpks.push(pk_srcorder_b);
							map.set(pk_srcorder_b, item.index);
							rownummap.set(pk_srcorder_b, crowno);
							rowIds.push(item.index);
						}
					});
					let errorMessage = delRowRule.bind(this, props, conditionData, rowIds, map, rownummap, srcpks)();
					if (errorMessage.length > 0) {
						showErrorInfo(errorMessage); /* 国际化处理： 提示,不能删除*/
					}
					props.cardTable.delRowsByIndex(PAGECODE.cardbody, this.delindex);
					this.delindex = [];
					materialSelected(props);
				}
			}

			break;
		case BUTTON.Resetno: //物料肩部 重排行号
			// 效率优化开启
			props.beforeUpdatePage();
			RownoUtils.resetRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			// 效率优化关闭
			props.updatePage(PAGECODE.cardhead, PAGECODE.cardbody);
			break;
		// case BUTTON.Material_DeleteLine: //物料行 删行
		// 	setTimeout(() => {
		// 		if (first != false) {
		// 			props.cardTable.delRowsByIndex(PAGECODE.cardbody, index);
		// 			materialSelected(props);
		// 		} else {
		// 			showErrorInfo(
		// 				getLangByResId(this, '4004ORDERREVISE-000004'),
		// 				getLangByResId(this, '4004ORDERREVISE-000005'),
		// 				null
		// 			); /* 国际化处理： 提示,不能删除*/
		// 		}
		// 	}, 0);
		// 	break;
		case BUTTON.copyline: //物料 肩部复制行
			// 效率优化开启
			props.beforeUpdatePage();
			props.button.setButtonVisible(
				[
					BUTTON.Card_Body_Group1,
					BUTTON.Resetno,
					BUTTON.openedit,
					BUTTON.materialDeleteLine,
					BUTTON.StockQuery,
					BUTTON.puinquiry,
					BUTTON.checkpuinquiry
				],
				false
			);
			props.button.setButtonVisible(
				[ BUTTON.Material_PastLast, BUTTON.PasteThis, BUTTON.PasteLast, BUTTON.PasteCancel ],
				true
			);
			rowCopyPasteUtils.copyRows.call(
				_this,
				props,
				PAGECODE.cardbody,
				BUTTON.materialCardInitBtn,
				BUTTON.materialCardPastBtn
			);
			// 效率优化关闭
			props.updatePage(PAGECODE.cardhead, PAGECODE.cardbody);
			break;
		case BUTTON.CopyLine_row: //物料 复制行
			props.cardTable.pasteRow(PAGECODE.cardbody, index);
			setPKempty(props, index + 1);
			break;
		case BUTTON.PasteLast: // 物料 粘贴至末行
			// 效率优化开启
			props.beforeUpdatePage();
			rowCopyPasteUtils.pasteRowsToTail.call(
				_this,
				props,
				PAGECODE.cardbody,
				BUTTON.materialCardInitBtn,
				BUTTON.materialCardPastBtn,
				clearitems
			);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			props.button.setButtonVisible(
				[
					BUTTON.Card_Body_Group1,
					BUTTON.Resetno,
					BUTTON.openedit,
					BUTTON.materialDeleteLine,
					BUTTON.StockQuery,
					BUTTON.puinquiry,
					BUTTON.checkpuinquiry
				],
				true
			);
			let rowsdata = props.cardTable.getVisibleRows(PAGECODE.cardbody);
			let rowsflag = true;
			if (rowsdata.length > 0) {
				rowsflag = false;
			}
			let disableArr = {
				[BUTTON.materialDeleteLine]: rowsflag,
				[BUTTON.copyline]: rowsflag,
				[BUTTON.StockQuery]: rowsflag
			};
			props.button.setDisabled(disableArr);
			// 效率优化关闭
			props.updatePage(PAGECODE.cardhead, PAGECODE.cardbody);
			break;
		case BUTTON.PasteThis: // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				_this,
				props,
				PAGECODE.cardbody,
				index,
				BUTTON.materialCardInitBtn,
				BUTTON.materialCardPastBtn,
				clearitems
			);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			materialSelected(props);
			break;
		case BUTTON.PasteCancel: // 物料 复制取消
			buttonController.materialPasteCancel.call(this, this.props);
			materialSelected(props);
			break;
		case BUTTON.InsertLine: //物料插行
			props.cardTable.addRow(PAGECODE.cardbody, index);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			break;
		case BUTTON.Print: //打印
			print_BtnClick.call(this, this.props);
			break;
		case BUTTON.Annex_Management: //附件管理
			this.setState({
				pk_order: pk,
				showUploader: true
				// target: event.target
			});
			break;
		case BUTTON.QueryAboutBusiness: //单据追溯
			this.setState({ pk_order: pk, showTrack: true });
			break;
		case BUTTON.ApproveInfo: //审批详情
			let billId = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
			let billtype = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vtrantypecode).value;
			this.setState({
				show: true,
				billtype: billtype,
				billId: billId
			});

			break;
		case BUTTON.Refresh: //刷新
			pageInfoClick.call(this, this.props, null, true);
			// showSuccessInfo(getLangByResId(this, '4004ORDERREVISE-000025'), null, null);
			break;
		case BUTTON.StockQuery: //存量查询
			stockQuery.call(this, this.props);
			break;
		case BUTTON.puinquiry: // 采购询价
			pricequery.call(this);
			break;
		case BUTTON.checkpuinquiry: // 询协同售价
			coopPriceQuery.call(this);
			break;
		case BUTTON.puinquirys: // 采购询价-侧拉
			pricequery.call(this, index);
			break;
		case BUTTON.checkpuinquirys: // 询协同售价-侧拉
			coopPriceQuery.call(this, index);
			break;
		case BUTTON.SupplierAp: // 供应商应付
			supplierApQuery.call(this, this.props);
			break;
		case BUTTON.LinkPoPlan: // 联查采购计划
			linkPoPlanBtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.PrintCountQuery: // 打印次数查询
			let mark = FIELD.pk_order;
			if (pk_src != null) {
				mark = FIELD.pk_srcorder;
			}
			let CONST = { hid: mark, area: PAGECODE.cardhead };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
		case LIST_BUTTON.ToInformation: //内部交易信息
			bizInfoBtnClick.call(this, props);
			break;
		default:
			break;
	}
}

function materialSelected(props) {
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.StockQuery]: rowsflag
	};
	props.button.setDisabled(disableArr);
}

function setPKempty(props, index) {
	props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, 'pk_order_b', {
		value: null,
		display: null,
		scale: '-1'
	});
}
