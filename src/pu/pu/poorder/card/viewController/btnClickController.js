/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片页面按钮事件
 * @Date: 2018-05-03 20:28:55
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-07 15:19:04
 */
import { toast } from 'nc-lightapp-front';
import {
	BUTTON,
	TRANSFER,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	TRANSFER49,
	LIST_BUTTON
} from '../../constance';
import { PAGECODE, URL, STATUS, FIELD, OrderCache } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/RownoUtil';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { clearTransferCache, changeUrlParam, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import {
	backButton,
	cancelButton,
	deleteBtnClick,
	editButton,
	saveBtnClick,
	addBtnClick,
	commit,
	uncommit,
	copyAddBtn,
	pageInfoClick,
	print_BtnClick,
	quitTransferButton,
	stockQuery,
	salesQuery,
	grossProfitQuery,
	supplierApQuery,
	savecommit,
	pricequery,
	checkDataPermission,
	printOut,
	combineShow,
	coopPriceQuery,
	handleOrderBtn,
	payPlan,
	requestCheckData,
	refresh,
	transportstatusquery,
	commonCheckData,
	payExecStatBtnClick,
	tempStorageBtnClick,
	supplmentaryinfoBtnClick,
	saveAndCommit,
	linkPoPlanBtnClick,
	bizInfoBtnClick
} from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from './index';
import setPieceBtnClick from '../btnClicks/setPieceBtnClick';

import { YYC_BUTTON_ARRAY } from '../../../yyc/constance';
import { orderYYCBtnClick } from '../../../yyc/ext/yycBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function(props, key, text, record, index) {
	let pk = null;
	let _this = this;
	let _url = null;
	let pk_order_b = null;
	let pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	pk_order =
		pk_order == null || pk_order == '' || pk_order == 'undefined' ? this.props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'undefined' ? null : pk_order;
	let pk_src = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_srcorder).value;
	if (pk_src != null) {
		pk_order = pk_src;
	}
	let ts = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts);
	ts = ts && ts.value;
	switch (key) {
		case BUTTON.Back: // 返回
			backButton.bind(this)();
			break;
		case BUTTON.Edit: // 修改
			checkDataPermission.call(this, record, 'edit', () => {
				editButton.call(this);
			});
			break;
		case BUTTON.Delete: // 删除
			deleteBtnClick.call(this, this.props);
			break;
		case BUTTON.Cancel: // 取消
			cancelButton.call(this, this.props, this.curindex);
			break;
		case BUTTON.Save: // 保存
			saveBtnClick.call(this, this.props);
			break;
		case BUTTON.TemporaryStorage: //暂存
			tempStorageBtnClick.call(this, this.props);
			break;
		case BUTTON.Commit: // 提交
			commit.call(this, this.props);
			break;
		case BUTTON.SaveCommit: // 保存提交
			saveAndCommit.call(this, this.skipCodes);
			// savecommit.call(this);
			break;
		case BUTTON.UnCommit: // 收回
			uncommit.call(this);
			break;
		case BUTTON.Copy: // 复制
			copyAddBtn.call(this);
			break;
		case BUTTON.QuitTransferBill: // 退出转单
			quitTransferButton.call(this, this.props);
			break;
		case BUTTON.QueryAboutBusiness: // 单据追溯
			this.setState({ pk_order: pk_order, showTrack: true });
			break;
		case BUTTON.annex_management: // 附件
			this.setState({
				pk_order: pk_order,
				showUploader: true
				// target: event.target //确定弹窗位置，不传则默认为正中央
			});
			break;
		case BUTTON.ApproveInfo: // 审批详情
			let vtrantypecode = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vtrantypecode).value;
			this.setState({ show: true, pk_order: pk_order, vtrantypecode: vtrantypecode });
			break;
		case BUTTON.SupplierAp: // 供应商应付
			supplierApQuery.call(this, this.props);
			break;
		case BUTTON.LinkPoPlan: // 联查采购计划
			linkPoPlanBtnClick.call(this, this.props);
			break;
		case BUTTON.print: //打印
			print_BtnClick.call(this, this.props);
			break;
		case BUTTON.PrintOut: //输出
			printOut.call(this, this.props);
			break;
		case BUTTON.CombineShow: // 合并显示
			combineShow.call(this, this.props);
			break;
		case BUTTON.Pay_Addline: // 付款协议增行
			props.cardTable.addRow(PAGECODE.head_payment);
			let allrow = props.cardTable.getAllRows(PAGECODE.head_payment);
			for (let i = 0; i < allrow.length; i++) {
				let value = allrow[i].values.numberindex.value;
				props.cardTable.setValByKeyAndIndex(PAGECODE.head_payment, i, 'showorder', {
					value: value,
					display: value
				});
			}

			break;
		case BUTTON.selfmake: // 自制
			//清空页面
			addBtnClick.call(this);
			break;
		case BUTTON.Add: // 新增
			//清空页面
			addBtnClick.call(this);
			break;
		case BUTTON.Freeze: //冻结
			handleOrderBtn.call(this, URL.freeze, getLangByResId(this, '4004POORDER-000023'), ''); /* 国际化处理： 冻结*/
			break;
		case BUTTON.UnFreeze: //解冻
			handleOrderBtn.call(this, URL.unfreeze, getLangByResId(this, '4004POORDER-000024'), ''); /* 国际化处理： 解冻*/
			break;
		case BUTTON.OpenBill: //整单打开
			handleOrderBtn.call(this, URL.finalopen, getLangByResId(this, '4004POORDER-000025'), ''); /* 国际化处理： 整单打开*/
			break;
		case BUTTON.CloseBill: //整单关闭
			handleOrderBtn.call(this, URL.finalClose, getLangByResId(this, '4004POORDER-000026'), ''); /* 国际化处理： 整单关闭*/
			break;
		case BUTTON.RowOpen: //行打开
			pk_order_b = record && record.values && record.values.pk_order_b && record.values.pk_order_b.value;
			let btso = record && record.values && record.values.ts && record.values.ts.value;
			let extstro = pk_order_b + ',' + btso;
			handleOrderBtn.call(this, URL.rowopen, getLangByResId(this, '4004POORDER-000027'), extstro); /* 国际化处理： 行打开*/
			break;
		case BUTTON.RowClose: //行关闭
			pk_order_b = record && record.values && record.values.pk_order_b && record.values.pk_order_b.value;
			let btsc = record && record.values && record.values.ts && record.values.ts.value;
			let extstrc = pk_order_b + ',' + btsc;
			handleOrderBtn.call(
				this,
				URL.rowclose,
				getLangByResId(this, '4004POORDER-000028'),
				extstrc
			); /* 国际化处理： 行关闭*/
			break;
		case BUTTON.StockQuery: //存量查询
			stockQuery.call(this, this.props);
			break;
		case BUTTON.SalesQuery: //销量查询
			salesQuery.call(this, this.props);
			break;
		case BUTTON.GrossProfit: //毛利预估
			grossProfitQuery.call(this, this.props);
			break;
		case BUTTON.Pay_DeleteLine: // 付款协议删行
			props.cardTable.delRowsByIndex(PAGECODE.head_payment, index);
			break;
		case BUTTON.openbrowse: //展开物料浏览行
			props.cardTable.toggleRowView(PAGECODE.cardbody, record);
			break;
		case BUTTON.openedit: //侧拉物料信息
			props.cardTable.openModel(PAGECODE.cardbody, STATUS.edit, record, index);
			break;
		case BUTTON.Material_AddLine: //物料肩部 增行
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
		case BUTTON.materialDeleteLine: //物料肩部 删行
			if (record) {
				props.cardTable.delRowsByIndex(PAGECODE.cardbody, index);
				materialSelected(props);
				if (_this.refsourcdata) {
					_this.refsourcdata.data.forEach((e) => {
						if (e.bodys && e.bodys.length > 0) {
							for (let i = 0; i < e.bodys.length; i++) {
								if (record.values.cfirstbid.value == e.bodys[i].pk.substr(0, 20)) {
									e.bodys.splice(i, 1);
								}
							}
						}
					});
				}
			} else {
				let selectedRow = props.cardTable.getCheckedRows(PAGECODE.cardbody);
				if (selectedRow == null || selectedRow.length == 0) {
					toast({
						color: 'warning',
						content: getLangByResId(this, '4004POORDER-000029') /* 国际化处理： 请选择数据！*/
					});
					return;
				}
				let rowparam = [];
				selectedRow.map((item) => {
					rowparam.push(item.index);
				});
				props.cardTable.delRowsByIndex(PAGECODE.cardbody, rowparam);
				materialSelected(props);
				let map = new Map();
				selectedRow.forEach((e) => {
					if (e.data && e.data.values && e.data.values.cfirstbid) {
						map.set(e.data.values.cfirstbid.value, e.data.values.cfirstbid.value);
					}
				});

				if (_this.refsourcdata) {
					_this.refsourcdata.data.forEach((e) => {
						if (e.bodys && e.bodys.length > 0) {
							for (let i = e.bodys.length - 1; i >= 0; i--) {
								if (
									map.get(e.bodys[i].pk.substr(0, 20)) != null ||
									map.get(e.bodys[i].pk.substr(0, 20)) != undefined
								) {
									e.bodys.splice(i, 1);
								}
							}
						}
					});
				}
			}
			break;
		case BUTTON.Resetno: //物料肩部 重排行号
			// 效率优化开启
			props.beforeUpdatePage();
			RownoUtils.resetRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			this.forceUpdate();
			// 效率优化关闭
			props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
			break;
		// case BUTTON.Material_DeleteLine: //物料行 删行
		// 	props.cardTable.delRowsByIndex(PAGECODE.cardbody, index);
		// 	materialSelected(props);
		// 	break;
		case BUTTON.copyline: //物料 肩部复制行
			props.button.setButtonVisible(
				[
					BUTTON.Card_Body_Group1,
					BUTTON.Card_Body_Group2,
					BUTTON.Resetno,
					BUTTON.openedit,
					BUTTON.materialDeleteLine,
					BUTTON.StockQuery,
					BUTTON.SalesQuery,
					BUTTON.GrossProfit
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
				[ FIELD.crowno, FIELD.pk_order_b ]
			);
			pasteBtnClick.call(this, props);
			// 效率优化关闭
			props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
			break;
		case BUTTON.PasteThis: // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				_this,
				props,
				PAGECODE.cardbody,
				index,
				BUTTON.materialCardInitBtn,
				BUTTON.materialCardPastBtn,
				[ FIELD.crowno, FIELD.pk_order_b ]
			);
			pasteBtnClick.call(this, props);
			break;
		case BUTTON.PasteCancel: // 物料 复制取消
			buttonController.materialPasteCancel.call(this, this.props);
			materialSelected(props);
			break;
		case BUTTON.Correct: //物料 批改
			props.cardTable.batchChangeTableData(PAGECODE.cardbody);
			break;
		case BUTTON.CopyLine_row: //物料 复制行
			props.cardTable.pasteRow(PAGECODE.cardbody, index, [ 'pk_order_b', 'crowno' ]);
			setPKempty(props, index + 1);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			break;
		case BUTTON.Refresh: //刷新
			refresh.call(this, this.props);
			// pageInfoClick.bind(this)();
			break;
		case BUTTON.ShowDraft: //显示草稿
			this.setState({ showTemp: true });
			break;
		case BUTTON.showDraft: // 不同于上一个按钮此处不能删除
			this.setState({ showTemp: true });
			break;
		case BUTTON.InsertLine: //物料插行
			// props.cardTable.addRow(PAGECODE.cardbody, index);
			props.cardTable.addRow(
				PAGECODE.cardbody,
				index,
				{ nitemdiscountrate: { display: '100.00', value: '100.00' } },
				true
			);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
			break;
		case BUTTON.Req_GenerateOrder: // 请购生成订单
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER20.GOTO20, { pagecode: TRANSFER20.PAGEID });
			break;
		case BUTTON.Pu_GenerateOrder: // 采购合同生成订单
			requestCheckData.call(this, '4020', getLangByResId(this, '4004POORDER-000050'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFERZ2.GOTOZ2, { pagecode: TRANSFERZ2.PAGEID });
			});
			break;
		case BUTTON.D_Sale_GenerateOrder: // 直运销售生成订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFER30TO21.GOTO30SALE, { pagecode: TRANSFER30TO21.PAGEID });
			});
			break;
		case BUTTON.Pu_co_GenerateOrder: // 销售协同生成订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFER30TO21COOP.GOTO30COOP, { pagecode: TRANSFER30TO21COOP.PAGEID });
			});
			break;
		case BUTTON.replenishment: // 补货
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFERMULTI.GOTOMULTI, { pagecode: TRANSFERMULTI.PAGEID });
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
		case BUTTON.RefAddLind: // 参照增行
			// clearTransferCache(this.props, OrderCache.OrderTransferCache);
			clearTransferCache(this.props, OrderCache.OrderRefAdd20);
			let initData = { pk_org: props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org) };
			setDefData(OrderCache.OrderRefAdd20, 'initData', initData);
			this.props.modal.show('RefAdd20Modal');
			break;
		case BUTTON.Payment_Plan: // 付款计划
			payPlan.call(this, this.props);
			break;
		case BUTTON.arrival_plan: // 到货计划
			let arriveRows = new Array();
			let arriveInfo = {
				pks: pk_order,
				ts: ts
			};
			arriveRows.push(arriveInfo);
			let arriveData = {
				closedto: arriveRows,
				pagecode: null,
				extstr: null
			};
			commonCheckData.call(this, URL.arrivalplancheck, arriveData, () => {
				let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				let pk_customer = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_recvcustomer').value;
				let pk_supplier = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_supplier).value;
				this.pk_org = pk_org;
				this.pk_customer = pk_customer;
				this.pk_supplier = pk_supplier;
				this.setState({ pk_order: pk_order, showModal: true });
			});
			break;
		case BUTTON.OrderTOSaleBill: // 生成协同销售订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				handleOrderBtn.call(
					this,
					URL.pushcoopsale,
					getLangByResId(this, '4004POORDER-000030'),
					''
				); /* 国际化处理： 生成销售协同订单*/
			});
			break;
		case BUTTON.Transport_State: // 运输状态
			transportstatusquery.call(this);
			break;
		case BUTTON.PayExecStat: //付款执行情况
			payExecStatBtnClick.call(this, this, props);
			break;
		case BUTTON.SetPiece: //成套件
			setPieceBtnClick.call(this, props, record, index);
			break;
		case BUTTON.SupplementaryInfo: //辅助信息
			supplmentaryinfoBtnClick.call(this, this.props, record, index);
			break;
		case BUTTON.Bi_GenerateOrder: // 借入
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER49.GOTO49, { pagecode: TRANSFER49.PAGEID });
			break;
		case BUTTON.ToInformation: // 内部交易信息
			bizInfoBtnClick.call(this, props);
			break;
		case LIST_BUTTON.printCountQuery: // 打印次数查询
			let CONST = { hid: FIELD.pk_order, area: PAGECODE.cardhead };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
		//导出
		case LIST_BUTTON.Export:
			this.props.modal.show('exportFileModal');
			break;
		default:
			break;
	}
	// 友云采按钮扩展 add by guozhq
	if (YYC_BUTTON_ARRAY.includes(key)) {
		orderYYCBtnClick.call(this, props, key, {
			isCard: true,
			cardheadarea: PAGECODE.cardhead,
			billidField: FIELD.pk_order,
			pageCode: PAGECODE.cardcode
		});
	}
}

function setPKempty(props, index) {
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, 'pk_order_b', empty);
}

function materialSelected(props) {
	let rowsflag = true;
	let table = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (table && table.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.LinkPoPlan]: rowsflag
	};
	props.button.setDisabled(disableArr);
}

function pasteBtnClick(props) {
	RownoUtils.setRowNo(props, PAGECODE.cardbody, FIELD.crowno);
	props.button.setButtonVisible(
		[
			BUTTON.Card_Body_Group1,
			BUTTON.Card_Body_Group2,
			BUTTON.Correct,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.StockQuery,
			BUTTON.SalesQuery,
			BUTTON.GrossProfit
		],
		true
	);
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.SalesQuery]: rowsflag,
		[BUTTON.GrossProfit]: rowsflag
	};
	props.button.setDisabled(disableArr);
}
function addOneNowRow(props, tableId) {
	props.cardTable.addRow(tableId, 0, { crowno: { display: '10', value: '10' } }, false);
}
