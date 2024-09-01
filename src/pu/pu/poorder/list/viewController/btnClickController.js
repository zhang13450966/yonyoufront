/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-09 11:29:02
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-12-07 17:13:20
 */
import {
	LIST_BUTTON,
	PAGECODE,
	FIELD,
	STATUS,
	URL,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	OrderCache,
	TRANSFER49
} from '../../constance';
import {
	commonSearch,
	searchBtnClick,
	pageInfoClick,
	addBtnClick,
	deleteBtnClick,
	commonClose,
	commit,
	uncommit,
	freezeBtn,
	arrivePlanBtn,
	print_BtnClick,
	printList_BtnClick,
	printOut,
	checkDataPermission,
	deleteLine,
	payPlan,
	requestCheckData,
	transportstatusquery,
	commonCheckData,
	payExecStatBtnClick,
	bizInfoBtnClick
} from '../btnClicks/index';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

import { YYC_BUTTON_ARRAY } from '../../../yyc/constance';
import { orderYYCBtnClick } from '../../../yyc/ext/yycBtnClick';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function(props, key, text, record, index) {
	let pk = null;
	let _this = this;
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	let rowsdata = [];
	let rowindex = [];
	if (rows.length > 0) {
		rows.map((item) => {
			let data = {
				[FIELD.pks]: item.data.values.pk_order.value,
				[FIELD.ts]: item.data.values.ts.value
			};
			rowsdata.push(data);
			rowindex.push(item.index);
		});
	}
	let _url = null;
	switch (key) {
		case LIST_BUTTON.search: // 查询
			searchBtnClick.call(this);
			break;
		case LIST_BUTTON.selfmake: // 自制
			addBtnClick.bind(this, props)();
			break;
		case LIST_BUTTON.Req_GenerateOrder: // 请购生成订单
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER20.GOTO20, { pagecode: TRANSFER20.PAGEID });
			break;
		case LIST_BUTTON.Pu_GenerateOrder: // 采购合同生成订单
			//合同模块校验
			requestCheckData.call(this, '4020', getLangByResId(this, '4004POORDER-000050'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFERZ2.GOTOZ2, { pagecode: TRANSFERZ2.PAGEID });
			});
			break;
		case LIST_BUTTON.OpenBill: // 整单打开
			// 拼装json
			let openedata = {
				closedto: rowsdata,
				[FIELD.pagecode]: PAGECODE.listcode
			};
			if (openedata != '' && !(openedata instanceof Array) && Object.keys(openedata).length != 0) {
				_url = URL.gridfinalopen;
				commonClose.call(
					this,
					_url,
					openedata,
					rowindex,
					getLangByResId(this, '4004POORDER-000025')
				); /* 国际化处理： 整单打开*/
			}
			break;
		case LIST_BUTTON.CloseBill: // 整单关闭
			// 拼装json
			let closedata = {
				closedto: rowsdata,
				[FIELD.pagecode]: PAGECODE.listcode
			};
			if (closedata != '' && !(closedata instanceof Array) && Object.keys(closedata).length != 0) {
				_url = URL.gridfinalClose;
				commonClose.call(
					this,
					_url,
					closedata,
					rowindex,
					getLangByResId(this, '4004POORDER-000026')
				); /* 国际化处理： 整单关闭*/
			}
			break;
		case LIST_BUTTON.D_Sale_GenerateOrder: // 直运销售生成订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFER30TO21.GOTO30SALE, { pagecode: TRANSFER30TO21.PAGEID });
			});
			break;
		case LIST_BUTTON.Pu_co_GenerateOrder: // 销售协同生成订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				clearTransferCache(props, OrderCache.OrderTransferCache);
				props.pushTo(TRANSFER30TO21COOP.GOTO30COOP, { pagecode: TRANSFER30TO21COOP.PAGEID });
			});
			break;
		case LIST_BUTTON.Replenishment: // 补货
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFERMULTI.GOTOMULTI, { pagecode: TRANSFERMULTI.PAGEID });
			break;
		case LIST_BUTTON.Delete: // 删除
			deleteBtnClick.call(this, props, record);
			break;
		case LIST_BUTTON.Commit: // 提交
			commit.call(this, this.props, record);
			break;
		case LIST_BUTTON.UnCommit: // 收回
			uncommit.call(this);
			break;
		case LIST_BUTTON.Freeze: // 冻结
			_url = URL.gridfreeze;
			freezeBtn.call(this, props, record, _url, getLangByResId(this, '4004POORDER-000023')); /* 国际化处理： 冻结*/
			break;
		case LIST_BUTTON.UnFreeze: // 解冻
			_url = URL.gridunfreeze;
			freezeBtn.call(this, props, record, _url, getLangByResId(this, '4004POORDER-000024')); /* 国际化处理： 解冻*/
			break;
		case LIST_BUTTON.Annex_Management: // 附件管理
			pk = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_order.value;
			let vbillcode = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.vbillcode.value;
			let fileManage = {
				pk_order: pk,
				showUploader: true,
				// target: event.target, //确定弹窗位置，不传则默认为正中央
				vbillcode: vbillcode
			};
			this.setState(fileManage);
			break;
		case LIST_BUTTON.QueryAboutBusiness: // 单据追溯
			pk = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_order.value;
			this.setState({ pk_order: pk, showTrack: true });
			break;
		case LIST_BUTTON.Arrival_Plan: // 到货计划
			pk = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_order.value;
			let arriveRows = new Array();
			let arriveInfo = {
				pks: pk,
				ts: null
			};
			arriveRows.push(arriveInfo);
			let arriveData = {
				closedto: arriveRows,
				pagecode: null,
				extstr: null
			};
			commonCheckData.call(this, URL.arrivalplancheck, arriveData, () => {
				let avalues = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values;
				let pk_org = avalues.pk_org.value;
				let pk_customer = avalues.pk_recvcustomer.value;
				let pk_supplier = avalues.pk_supplier.value;
				this.pk_org = pk_org;
				this.pk_customer = pk_customer;
				this.pk_supplier = pk_supplier;
				this.setState({ pk_order: pk, showModal: true });
			});
			break;
		case LIST_BUTTON.Payment_Plan: // 付款计划
			//单选且审批过的单据可用openTO付款计划
			payPlan.call(this, this.props);
			break;
		case LIST_BUTTON.Refresh: // 刷新
			let tabCode = getDefData.call(this, OrderCache.OrderCacheKey, OrderCache.OrderListTabCode);
			let currentTab = tabCode && tabCode.tabCode != null ? tabCode.tabCode : '0';
			if (0 == currentTab) {
				currentTab = FIELD.tocommit;
			} else if (1 == currentTab) {
				currentTab = FIELD.approving;
			} else if (2 == currentTab) {
				currentTab = FIELD.executing;
			} else if (3 == currentTab) {
				currentTab = FIELD.all;
			}
			let queryInfo = getDefData(OrderCache.OrderCacheKey, 'queryInfo');
			commonSearch.call(this, currentTab, queryInfo, 'isRefresh');
			break;
		case LIST_BUTTON.Print: // 打印
			print_BtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.Print_list: // 打印清单
			printList_BtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.PrintOut: // 输出
			printOut.call(this, this.props);
			break;
		case LIST_BUTTON.List_Inner_Commit: // 行提交
			commit.call(this, this.props, record);
			break;
		case LIST_BUTTON.Edit: // 行
			checkDataPermission.call(this, record, 'edit', () => {
				let scene = this.props.getUrlParam('scene');
				pk = record && record.pk_order && record.pk_order.value;
				props.pushTo(URL.gotoCard, {
					status: STATUS.edit,
					id: pk,
					scene: scene,
					tempstatus: STATUS.edit,
					pagecode: PAGECODE.cardcode
				});
			});
			break;
		case LIST_BUTTON.Delete: // 行删除
			deleteLine.call(this, this.props, record);
			break;
		case LIST_BUTTON.Copy: // 行复制
			pk = record && record.pk_order && record.pk_order.value;
			props.pushTo(URL.gotoCard, {
				status: STATUS.copy,
				id: pk,
				tempstatus: STATUS.add,
				pagecode: PAGECODE.cardcode
			});
			break;
		case LIST_BUTTON.List_Inner_UnCommit: // 行收回
			uncommit.bind(props, record);
			break;
		case LIST_BUTTON.ApproveInfo: // 行查看审批意见
			pk = record && record.pk_order && record.pk_order.value;
			let vtrantypecode = record && record.vtrantypecode && record.vtrantypecode.value;
			this.setState({ show: true, pk_order: pk, vtrantypecode: vtrantypecode });
			break;
		case LIST_BUTTON.OrderTOSaleBill: // 生成协同销售订单
			requestCheckData.call(this, '4006', getLangByResId(this, '4004POORDER-000103'), () => {
				// 拼装json
				let pushdata = {
					closedto: rowsdata,
					[FIELD.pagecode]: PAGECODE.listcode,
					extstr: 'grid' //列表标识
				};
				if (pushdata != '' && !(pushdata instanceof Array) && Object.keys(pushdata).length != 0) {
					_url = URL.pushcoopsale;
					commonClose.call(
						this,
						_url,
						pushdata,
						rowindex,
						getLangByResId(this, '4004POORDER-000030')
					); /* 国际化处理： 生成销售协同订单*/
				}
			});
			break;
		case LIST_BUTTON.Transport_State: // 运输状态
			transportstatusquery.call(this);
			break;
		case LIST_BUTTON.PayExecStat: // 付款执行情况
			payExecStatBtnClick.call(this, this.props);
			break;
		case LIST_BUTTON.Bi_GenerateOrder: // 借入
			clearTransferCache(props, OrderCache.OrderTransferCache);
			props.pushTo(TRANSFER49.GOTO49, { pagecode: TRANSFER49.PAGEID });
			break;
		case LIST_BUTTON.ToInformation: // 内部交易信息
			bizInfoBtnClick.call(this, props);
			break;
		case LIST_BUTTON.printCountQuery: // 打印次数查询
			let CONST = { hid: FIELD.pk_order, area: PAGECODE.tableId };
			printCountQuery.call(this, props, { type: 1, CONST, modal: 'code-config' });
			break;
		//导出
		case LIST_BUTTON.Export:
			this.props.modal.show('exportFileModal');
			break;
		default:
			break;
	}
	// 友云采扩展 add by guozhq
	if (YYC_BUTTON_ARRAY.includes(key)) {
		orderYYCBtnClick.call(this, props, key, {
			isList: true,
			listArea: PAGECODE.tableId,
			billidField: FIELD.pk_order,
			pageCode: PAGECODE.listcode
		});
	}
}
