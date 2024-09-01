/*
 * @Author: CongKe
 * @PageInfo: 根据页面状态，修改页面及按钮状态
 * @Date: 2018-05-25 17:29:25
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-22 16:10:24
 */
import {
	URL,
	PAGECODE,
	BUTTON,
	STATUS,
	FIELD,
	TRANSFER20,
	TRANSFER,
	TRANSFER30TO21COOP,
	OrderCache,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFERMULTI,
	TRANSFER49
} from '../../constance';
import {
	getDefData,
	getCurrentLastId,
	getCacheDataByPk,
	changeUrlParam,
	setDefData
} from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { pageInfoClick, refresh } from '../btnClicks/index';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { orderBtnControl } from '../../../yyc/ext/yycBtnControl';

function setOprationBtnsRenderStatus(props) {
	props.button.setOprationBtnsRenderStatus([ PAGECODE.material_table_row ], false);
}

/**
 * 获取付款协议表格行操作按钮
 * @param {*} props
 */
function getPayMentOprButton(props) {
	let paymentStatus = props.cardTable.getStatus(PAGECODE.head_payment);
	let buttonAryp = paymentStatus != STATUS.browse ? [ BUTTON.Pay_DeleteLine ] : [];
	return buttonAryp;
}

/**
 * 获取物料表格行操作按钮
 * @param {*} props
 * @param {*} record
 */
function getMaterialOprButtons(props, record) {
	let buttonAry = [];
	let forderstatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus); //单据状态
	let barriveclose = record.values.barriveclose.value; // 到货关闭
	let bstockclose = record.values.bstockclose.value; // 入库关闭
	let binvoiceclose = record.values.binvoiceclose.value; // 收票关闭
	let bpayclose = record.values.bpayclose.value; // 付款关闭
	if (this.props.cardTable.getStatus(PAGECODE.cardbody) === STATUS.browse) {
		buttonAry = [ BUTTON.openbrowse, BUTTON.SetPiece, BUTTON.SupplementaryInfo ];
		if (forderstatus && forderstatus.value == FIELD.approved) {
			if (barriveclose && bstockclose && binvoiceclose && bpayclose) {
				buttonAry = [ BUTTON.openbrowse, BUTTON.RowOpen, BUTTON.SetPiece, BUTTON.SupplementaryInfo ];
			} else {
				buttonAry = [ BUTTON.openbrowse, BUTTON.RowClose, BUTTON.SetPiece, BUTTON.SupplementaryInfo ];
			}
		}
	} else {
		if (this.copyRowDatas == null) {
			// 协同生成订单不显示插行
			if (this.props.getUrlParam(TRANSFER.transfer) == TRANSFER30TO21COOP.CSOURCETYPECODE) {
				buttonAry = [ BUTTON.openedit, BUTTON.Material_DeleteLine, BUTTON.SetPiece, BUTTON.SupplementaryInfo ];
			} else {
				buttonAry = [
					BUTTON.openedit,
					BUTTON.Material_DeleteLine,
					BUTTON.CopyLine_row,
					BUTTON.InsertLine,
					BUTTON.SetPiece,
					BUTTON.SupplementaryInfo
				];
			}
		} else {
			buttonAry = [ BUTTON.PasteThis ];
		}
	}
	return buttonAry;
}

/**
 * 订单页面按钮主控方法
 * @param {*} props
 * @param {*} type
 * @param {*} pk_org_v
 */
function togglePageShow(props, type, pk_org_v) {
	props.beforeUpdatePage();
	props.button.setButtonVisible([ BUTTON.ShowDraft ], true);
	//add by zhaochyu 修改状态暂存按钮不可用
	let tempstatus = props.getUrlParam(STATUS.tempstatus);
	if (tempstatus == STATUS.edit) {
		props.button.setDisabled({ [BUTTON.TemporaryStorage]: true });
	}
	//转单或推单标识
	let transfer = props.getUrlParam(TRANSFER.transfer);
	let channelType = props.getUrlParam(TRANSFER.channelType);
	transfer = transfer == null ? channelType : transfer;
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
	pk_order = pk_order && pk_order.value;
	// 已保存过的数据有主键,如果没有取url中的id
	pk_order = pk_order == null ? props.getUrlParam(FIELD.id) : pk_order;
	pk_order = pk_order == '' || pk_order == 'null' ? null : pk_order;
	//场景参数
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	let status = props.getUrlParam(STATUS.status); //拉单或是推单时参数没有status
	status = status == null || transfer != null ? props.form.getFormStatus(PAGECODE.cardhead) : status;
	// 转单已保存的显示为浏览态
	status = transfer && pk_order ? STATUS.browse : transfer ? STATUS.edit : status;
	// 转单已经保存过的数据点击修改触发
	status = type == STATUS.edit ? STATUS.edit : status;
	// 采购订单新增页面默认进入即编辑
	status = scene == 'ADD' && !pk_order && !props.getUrlParam(STATUS.status) ? STATUS.edit : status;
	// status = scene == 'ADD' && !pk_order ? STATUS.edit : status;
	let bodyVals = props.cardTable.getVisibleRows(PAGECODE.cardbody);
	//只有参照请购单且非浏览态时显示参照增行按钮
	let refAddLindShow = false;
	if (props.getUrlParam(TRANSFER.transfer) == TRANSFER20.CSOURCETYPECODE && status != STATUS.browse) {
		refAddLindShow = true;
		// props.button.setButtonVisible([ BUTTON.RefAddLind ], true);
	} else {
		// 编辑态且表体来源是请购单的显示参照增行
		if (status == STATUS.edit && bodyVals) {
			bodyVals.map((item) => {
				if (!refAddLindShow) {
					let csourcetypecode =
						item.values && item.values.csourcetypecode && item.values.csourcetypecode.value;
					if (csourcetypecode == '20') {
						refAddLindShow = true;
					}
				}
			});
		}
	}
	props.button.setButtonVisible([ BUTTON.RefAddLind ], refAddLindShow);
	if (transfer != null && type != BUTTON.Copy && !channelType) {
		// 退出转单需求变更，推单不需要这个按钮 add By CongKe
		props.button.setButtonVisible([ BUTTON.QuitTransferBill ], true);
	} else {
		// 转单的按钮-->退出转单
		props.button.setButtonVisible([ BUTTON.QuitTransferBill ], false);
	}
	let flag = false;
	let org_flag = true;
	if (status != STATUS.browse) {
		status = STATUS.edit;
		//表格改为编辑态
		flag = true;
		org_flag = pk_order != null || transfer != null ? true : false;
		pk_org_v = pk_org_v == null ? getDefData(OrderCache.OrderCardCache, FIELD.pk_org_v) : pk_org_v;
		if (type == null && transfer == null && pk_org_v == null && pk_order == null) {
			props.initMetaByPkorg(FIELD.pk_org_v);
			props.form.setFormItemsValue(PAGECODE.cardhead, {
				[FIELD.forderstatus]: {
					value: '0',
					display: getLangByResId(this, '4004POORDER-000020')
				} /* 国际化处理： 自由*/
			});
		}
	}
	if (pk_order == null && status == STATUS.edit) {
		//当页面为编辑态且主键为空时释放主组织的编辑性
		props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
	}
	props.button.setButtonVisible([ BUTTON.SupplierAp ], true);

	if (pk_order == null && status == STATUS.browse) {
		//当页面为浏览态且没有主键时不显示联查供应商应付
		props.button.setButtonVisible([ BUTTON.SupplierAp ], false);
	}
	if (!transfer && type == BUTTON.Copy && !channelType) {
		// 显示暂存
		props.button.setDisabled({ [BUTTON.TemporaryStorage]: false });
	}
	// if (pk_order != null && status == STATUS.edit) {
	// 	// 保存后 再点修改 暂存不可用
	// 	props.button.setDisabled({ [BUTTON.TemporaryStorage]: true });
	// }
	//edit
	props.button.setButtonVisible(
		[
			BUTTON.Save,
			BUTTON.TemporaryStorage,
			BUTTON.SaveCommit,
			BUTTON.Cancel,
			BUTTON.Pay_Addline,
			BUTTON.Pay_DeleteLine,
			BUTTON.Card_Body_Group1,
			BUTTON.Card_Body_Group2,
			BUTTON.Correct,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.CopyLine_row,
			BUTTON.InsertLine
			// BUTTON.ShowDraft,
		],
		flag
	);
	props.button.setButtonVisible([ BUTTON.PasteLast, BUTTON.PasteCancel, BUTTON.LinkPoPlan ], false);
	//browse
	if (!transfer) {
		//正常页面
		let new_pk_order = pk_order || getCurrentLastId(OrderCache.OrderCacheKey);
		let commonflag = !flag;
		if (new_pk_order == null) {
			//当前卡片和列表均无数据
			commonflag = false;
		}
		props.button.setButtonVisible(
			[
				BUTTON.Edit,
				BUTTON.Delete,
				BUTTON.Copy,
				BUTTON.Commit,
				BUTTON.print,
				BUTTON.printCountQuery,
				BUTTON.Refresh,
				BUTTON.LinkPoPlan
			],
			commonflag
		);
		let refBillDataCach = getDefData(OrderCache.refBillDataCach, 'refBillDataCach');
		let isshowselfmake = !flag;
		refBillDataCach &&
			refBillDataCach.forEach((element) => {
				if (element && element.makeflag) {
					// 可自制
					isshowselfmake = true;
				}
			});
		props.button.setButtonVisible([ BUTTON.selfmake ], isshowselfmake);
		props.button.setButtonVisible([ BUTTON.Add ], !flag);
	} else {
		//拉单推单
		props.button.setButtonVisible(
			[
				BUTTON.Edit,
				BUTTON.Delete,
				BUTTON.Commit,
				BUTTON.print,
				BUTTON.printCountQuery,
				BUTTON.Refresh,
				BUTTON.LinkPoPlan
			],
			!flag
		);
		//add by zhaochyu 退单拉单没有暂存按钮
		props.button.setButtonVisible([ BUTTON.TemporaryStorage, BUTTON.ShowDraft ], false);
		// 转单的数据不显示新增下拉组和复制
		props.button.setButtonVisible([ BUTTON.Add, BUTTON.Copy ], false);
		//平台现在还有问题，需手动激活按钮组
		props.button.setButtonVisible([ BUTTON.Head_Group2 ], !flag);
	}
	let bfrozen = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.bfrozen); //冻结
	bfrozen = bfrozen && bfrozen.value == true ? true : false;
	if (bfrozen) {
		props.button.setButtonVisible([ BUTTON.Freeze ], false);
		props.button.setButtonVisible([ BUTTON.UnFreeze ], true);
		// props.button.setButtonVisible([ BUTTON.print ], true);
		// props.button.setButtonVisible([ BUTTON.printCountQuery ], true);
	} else {
		props.button.setButtonVisible([ BUTTON.Freeze ], true);
		props.button.setButtonVisible([ BUTTON.UnFreeze ], false);
	}
	let printdisable = {
		[BUTTON.print]: bfrozen == true ? true : false,
		[BUTTON.PrintOut]: bfrozen == true ? true : false,
		[BUTTON.printCountQuery]: bfrozen == true ? true : false,
		[BUTTON.CombineShow]: bfrozen == true ? true : false
	};
	// 冻结不显示打印
	props.button.setDisabled(printdisable);
	// free: '0', //单据状态 自由 commit: '1', //提交  approve: '2', //审批中  approved: '3',审批通过
	// unapproved: '4', //审批不通过
	let forderstatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.forderstatus); //单据状态
	let revisionstatus = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.revisionstatus); //单据状态
	let approver = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.approver); //审批人
	//最终关闭
	let bfinalclose = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.bfinalclose);
	let close_f = false;
	let open_f = false;
	if (forderstatus) {
		if (forderstatus.value == FIELD.unapproved) {
			props.button.setButtonVisible([ BUTTON.Delete, BUTTON.Commit ], false);
		}
		let f_flag = false;
		if (forderstatus.value == FIELD.approved) {
			f_flag = true;
			if (bfinalclose && bfinalclose.value == true) {
				open_f = true;
			} else {
				close_f = true;
			}
		}
		if (forderstatus.value == FIELD.approve || forderstatus.value == FIELD.approved) {
			props.button.setButtonVisible([ BUTTON.Edit, BUTTON.Delete, BUTTON.Commit ], false);
			//审批中+浏览态+在审批中心才可修改（ scene=approvesce）
			if (status == STATUS.browse && scene == 'approvesce' && forderstatus.value == FIELD.approve) {
				if (revisionstatus.value == '0') {
					props.button.setButtonVisible([ BUTTON.Edit ], false);
				} else {
					props.button.setButtonVisible([ BUTTON.Edit ], true);
				}
			}
			if (approver || approver.value == null) {
				props.button.setButtonVisible([ BUTTON.UnCommit ], true);
			} else {
				props.button.setButtonVisible([ BUTTON.UnCommit ], false);
			}
		} else {
			props.button.setButtonVisible([ BUTTON.UnCommit ], false);
		}
		//付款计划、生成协同销售订单、运输状态、付款执行情况
		props.button.setButtonVisible(
			[ BUTTON.Payment_Plan, BUTTON.OrderTOSaleBill, BUTTON.Transport_State, BUTTON.PayExecStat ],
			f_flag
		);
		// props.button.setButtonVisible(
		// 	[BUTTON.PayExecStat ],
		// 	f_flag
		// );
	}
	props.button.setButtonVisible([ BUTTON.OpenBill ], open_f);
	props.button.setButtonVisible([ BUTTON.CloseBill ], close_f);
	let flag1;
	if (status == STATUS.edit || !pk_order) {
		flag1 = false;
	} else {
		flag1 = true;
	}
	props.button.setButtonVisible([ BUTTON.QueryAboutBusiness, BUTTON.ApproveInfo, BUTTON.Auxiliary ], flag1);
	props.cardTable.setStatus(PAGECODE.cardbody, status);
	props.cardTable.setStatus(PAGECODE.head_payment, status);
	props.form.setFormStatus(PAGECODE.cardhead, status);
	//修改组织的可编辑状态
	props.form.setFormItemsDisabled(PAGECODE.cardhead, { [FIELD.pk_org_v]: org_flag });
	//设置看片翻页的显隐性
	let isshow = pk_order == null ? false : !flag;
	isshow = scene == 'ADD' || scene == 'approvesce' ? false : isshow;
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', isshow);
	//物料按钮
	let rowsdata = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	let rowsflag = true;
	if (rowsdata.length > 0) {
		rowsflag = false;
	}
	let linkPlanFlag = true;
	if (rowsdata.length > 0 && status == STATUS.browse) {
		linkPlanFlag = false;
	}
	let pk_org_v_v = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org_v);
	pk_org_v_v = pk_org_v_v && pk_org_v_v.value;
	let disableArr = {
		[BUTTON.Material_AddLine]: pk_org_v_v == null ? true : !flag,
		[BUTTON.Pay_Addline]: pk_org_v_v == null ? true : !flag,
		[BUTTON.Resetno]: pk_org_v_v == null ? true : !flag,
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.SalesQuery]: rowsflag,
		[BUTTON.GrossProfit]: rowsflag,
		[BUTTON.LinkPoPlan]: linkPlanFlag
	};
	props.button.setDisabled(disableArr);
	// 协同生成订单不显示增行和复制行
	props.button.setButtonVisible(
		[ BUTTON.Material_AddLine, BUTTON.copyline ],
		transfer == TRANSFER30TO21COOP.CSOURCETYPECODE ? false : flag
	);
	// linksce 单据追溯 freeze 冻结小应用
	scene = scene == 'linksce' || scene == 'freeze' ? null : scene;
	let isBackBtnEnable = status == STATUS.browse && scene == null;
	isBackBtnEnable = scene == 'ADD' ? false : isBackBtnEnable;
	isBackBtnEnable = transfer != null ? true : isBackBtnEnable; //拉单推单任何情况都要返回
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: scene == 'ADD' || scene == 'approvesce' ? false : isBackBtnEnable,
		showBillCode: true,
		billCode: props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode).value //修改单据号---非必传
	});
	// 付款协议为空时收起
	//add by zhaochyu
	// props.button.setButtonVisible([BUTTON.ShowDraft], true);
	//----START 友云采按钮控制 add by guozhq-------
	orderBtnControl(props, {
		isCard: true,
		cardHeadArea: PAGECODE.cardhead,
		billStatusField: FIELD.forderstatus,
		pk_orderField: FIELD.pk_order,
		status: status
	});
	//----END-------------------------------
	//-----新增时，执行光标聚焦---------------------
	if (pk_order == null && status != STATUS.browse) {
		props.executeAutoFocus();
	}
	//设置saga相关按钮状态
	setSagaBtnState(props, status);
	let _this = this;
	let tabkey = _this.tabKey;
	//表体肩部按钮显隐控制
	tabChange.call(_this, props, null, tabkey, { channelType, status });
	props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
}

/**
 * 卡片共享页签切换事件
 * @param {*} props
 * @param {*} moduleId
 * @param {*} key
 */
function tabChange(props, moduleId, key, params = { channelType: '', status: '' }) {
	let { channelType, status } = params;
	let flag = false;
	if (channelType == TRANSFER.priceaudit && PAGECODE.cardbody == key && STATUS.browse != status) {
		// 价格审批单走这里
		flag = true;
	} else if (PAGECODE.cardbody == key && STATUS.browse != status) {
		flag = true;
	}
	if (PAGECODE.cardbody != key) {
		props.button.setButtonVisible([ BUTTON.StockQuery ], false);
		props.button.setButtonVisible([ BUTTON.SalesQuery ], false);
		props.button.setButtonVisible([ BUTTON.GrossProfit ], false);
		props.button.setButtonVisible([ BUTTON.LinkPoPlan ], false);
	} else {
		props.button.setButtonVisible([ BUTTON.StockQuery ], true);
		props.button.setButtonVisible([ BUTTON.SalesQuery ], true);
		props.button.setButtonVisible([ BUTTON.GrossProfit ], true);
		if (status == STATUS.browse) {
			props.button.setButtonVisible([ BUTTON.LinkPoPlan ], true);
		} else {
			props.button.setButtonVisible([ BUTTON.LinkPoPlan ], false);
		}
	}
	props.button.setButtonVisible([ BUTTON.Card_Body_Group1, BUTTON.Card_Body_Group2, BUTTON.Resetno ], flag);
	metarialSelected(props);
}

/**
 * 物料表格勾选事件
 * @param {*} props
 */
function metarialSelected(props) {
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
		[BUTTON.GrossProfit]: rowsflag,
		[BUTTON.LinkPoPlan]: rowsflag
	};
	props.button.setDisabled(disableArr);
}

/**
 * 物料肩部按钮初始化
 * @param {*} props
 */
function materialButtonInit(props) {
	let rowsflag = true;
	let disableArr = {
		[BUTTON.materialDeleteLine]: rowsflag,
		[BUTTON.copyline]: rowsflag,
		[BUTTON.puinquiry]: rowsflag,
		[BUTTON.checkpuinquiry]: rowsflag,
		[BUTTON.StockQuery]: rowsflag,
		[BUTTON.SalesQuery]: rowsflag,
		[BUTTON.GrossProfit]: rowsflag,
		[BUTTON.LinkPoPlan]: rowsflag
	};
	props.button.setDisabled(disableArr);
}

/**
 * 判断付款协议是否展开
 * @param {*} props
 */
function paymentShow(props) {
	// 需求（刘兰娇）变更为不处理
	return;
	let payShow = false;
	let payTable = props.cardTable.getVisibleRows(PAGECODE.head_payment);
	if (payTable && payTable.length > 0) {
		payShow = true;
	}
	props.cardTable.toggleCardTable(PAGECODE.head_payment, payShow);
}

function cachedata() {
	this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
	return;
	// 转单标识
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	if (transfer == null) {
		transfer = this.props.getUrlParam(TRANSFER.channelType);
	}
	if (transfer) {
		let headVals = this.props.form.getAllFormValue(PAGECODE.cardhead);
		let bodyVals = this.props.cardTable.getVisibleRows(PAGECODE.cardbody);
		let pay = this.props.cardTable.getVisibleRows(PAGECODE.head_payment);
		let curindex = parseInt(this.curindex);
		let transferData = {};
		let head = { card_head: { rows: headVals.rows } };
		let body = { card_material: { rows: bodyVals } };
		if (pay && pay.length > 0) {
			body.card_payment = { rows: pay };
		} else {
			body.card_payment = { rows: [], areacode: PAGECODE.head_payment };
		}
		transferData.head = head;
		transferData.body = body;
		this.props.transferTable.setTransferListValueByIndex(PAGECODE.leftarea, transferData, curindex);
	}
}

/**
 * 物料表体复制取消
 * @param {*} props
 */
function materialPasteCancel(props) {
	props.button.setButtonVisible(
		[
			BUTTON.Card_Body_Group1,
			BUTTON.Card_Body_Group2,
			BUTTON.Correct,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.CopyLine_row,
			BUTTON.InsertLine,
			BUTTON.Material_DeleteLine,
			BUTTON.StockQuery,
			BUTTON.SalesQuery,
			BUTTON.GrossProfit
		],
		true
	);
	props.button.setButtonVisible([ BUTTON.PasteThis, BUTTON.PasteLast, BUTTON.PasteCancel ], false);
	rowCopyPasteUtils.cancel.call(
		this,
		props,
		PAGECODE.cardbody,
		BUTTON.materialCardInitBtn,
		BUTTON.materialCardPastBtn
	);
}

function doCancel(props, flag, currentindex) {
	const { setStatus } = this.props.cardTable;
	const { setFormStatus } = this.props.form;
	// 卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
	setDefData(OrderCache.OrderCardCache, 'tempsave', false);
	props.cardTable.selectAllRows(PAGECODE.head_payment, false);
	props.cardTable.selectAllRows(PAGECODE.cardbody, false);
	//回到页面上次状态
	let type = this.props.getUrlParam(TRANSFER.transfer);
	let channelType = this.props.getUrlParam(TRANSFER.channelType);
	type = type == null ? channelType : type;
	let pk_order = this.props.getUrlParam(FIELD.id);
	if (pk_order == null || pk_order == 'undefined' || pk_order == 'null') {
		pk_order = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
		pk_order = pk_order && pk_order.value;
	}
	materialPasteCancel.call(this, this.props);
	pk_order = pk_order == 'undefined' ? null : pk_order;
	pk_order = flag == 'error' ? null : pk_order;
	if (type) {
		this.indexstatus[currentindex] = 'browse';
		if (props.transferTable.getTransformFormCompleteStatus(PAGECODE.leftarea, parseInt(currentindex)) == true) {
			changeUrlParam(this.props, { status: STATUS.browse, id: pk_order });
			refresh.call(this, this.props, pk_order, false);
		} else {
			if (props.transferTable.getTransformFormAmount(PAGECODE.leftarea) == 1) {
				// 移除浏览器监听提示
				window.removeEventListener('beforeunload', this.onMove);
				if (channelType) {
					// add by CongKe 推单取消需求变更
					this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
				} else {
					//页面回退 处理拉单
					gobackTransferPage.call(this, props, type);
				}
			} else {
				props.transferTable.setTransformFormStatus(PAGECODE.leftarea, {
					status: false,
					onChange: (current, next) => {
						showSuccessInfo(null, getLangByResId(this, '4004POORDER-000032')); /* 国际化处理： 取消成功*/
					}
				});
			}
		}
	} else {
		this.props.resMetaAfterPkorgEdit();
		this.props.form.cancel(PAGECODE.cardhead);
		this.props.cardTable.resetTableData(PAGECODE.cardbody);
		this.props.cardTable.resetTableData(PAGECODE.head_payment);
		// 缓存处理 begin
		pk_order = this.props.getUrlParam(FIELD.id);
		pk_order = pk_order == 'null' ? null : pk_order;
		let copy = this.props.getUrlParam('copyType');
		if (copy == 'Y') {
			pk_order = pk_order == null ? getDefData(OrderCache.OrderCardCache, 'copypk') : pk_order;
		} else {
			pk_order = pk_order == null ? getCurrentLastId(OrderCache.OrderCacheKey) : pk_order;
		}
		pk_order = flag == 'error' ? null : pk_order;
		if (pk_order != null && pk_order != 'null') {
			let cardData = getCacheDataByPk(props, OrderCache.OrderCacheKey, pk_order);
			// 先从缓存中获取，缓存中有，使用缓存中的，缓存中没有，发请求查询
			if (cardData) {
				this.props.form.setAllFormValue({ [PAGECODE.cardhead]: cardData.head[PAGECODE.cardhead] });
				this.props.cardTable.setTableData(PAGECODE.head_payment, cardData.bodys[PAGECODE.head_payment]);
				this.props.cardTable.setTableData(PAGECODE.cardbody, cardData.bodys[PAGECODE.cardbody]);
			} else {
				changeUrlParam(this.props, { status: STATUS.browse });
				pageInfoClick.call(this, this.props, pk_order);
			}
		} else {
			props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
			//执行跳出堆栈
			props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
			props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
			props.form.setFormItemsValue(PAGECODE.cardhead, {
				[FIELD.forderstatus]: {
					value: '0',
					display: getLangByResId(this, '4004POORDER-000020')
				} /* 国际化处理： 自由*/
			});
		}
		// 缓存处理 end
		// 取消时，放开对组织的控制，
		props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
		// 将页面状态置为浏览态
		props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
		this.props.pushTo(URL.gotoCard, { status: STATUS.browse, id: pk_order, pagecode: PAGECODE.cardcode });
		togglePageShow.call(this, this.props, null);
	}
}

function showEmptyBrowsePage() {
	this.props.button.setButtonVisible(
		[
			BUTTON.Save,
			BUTTON.TemporaryStorage,
			BUTTON.Commit,
			BUTTON.SaveCommit,
			BUTTON.Cancel,
			BUTTON.Edit,
			BUTTON.Delete,
			BUTTON.Copy,
			BUTTON.Auxiliary,
			BUTTON.LinkQuery,
			BUTTON.print,
			BUTTON.printCountQuery,
			BUTTON.Refresh,
			BUTTON.ShowDraft,
			BUTTON.Pay_Addline,
			BUTTON.Pay_DeleteLine,
			BUTTON.Card_Body_Group1,
			BUTTON.Card_Body_Group2,
			BUTTON.Correct,
			BUTTON.Resetno,
			BUTTON.openedit,
			BUTTON.materialDeleteLine,
			BUTTON.CopyLine_row,
			BUTTON.InsertLine,
			BUTTON.ShowDraft,
			BUTTON.LinkPoPlan
		],
		false
	);
	this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	//场景参数
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	this.props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: scene == 'ADD' ? false : true,
		showBillCode: false,
		billCode: ''
	});
}

function setSagaBtnState(props, status) {
	//冻结交互
	let sagaStatus = props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.sagaStatus);
	// 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == STATUS.browse && frozen) {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: true
		});
	} else {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: false
		});
	}
}

/**
 * 返回转单界面
 * @param {*} props
 * @param {*} transferType
 */
function gobackTransferPage(props, transferType) {
	let map = new Map();
	map.set('20', TRANSFER20.GOTO20);
	map.set('Z2', TRANSFERZ2.GOTOZ2);
	map.set('30TO21', TRANSFER30TO21.GOTO30SALE);
	map.set('30TO21COOP', TRANSFER30TO21COOP.GOTO30COOP);
	map.set('MULTI', TRANSFERMULTI.GOTOMULTI);
	map.set('49', TRANSFER49.GOTO49);
	let _url = map.get(transferType);
	if ('Z2' == transferType) {
		//合同无小应用
		_url = URL.gotoList;
	}
	let map2 = new Map();
	map2.set('20', TRANSFER20.PAGEID);
	map2.set('Z2', TRANSFERZ2.PAGEID);
	map2.set('30TO21', TRANSFER30TO21.PAGEID);
	map2.set('30TO21COOP', TRANSFER30TO21COOP.PAGEID);
	map2.set('MULTI', TRANSFERMULTI.PAGEID);
	map2.set('49', TRANSFER49.PAGEID);
	let pagecode = map2.get(transferType);
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	let srcappcode = getDefData(OrderCache.OrderCardCache, 'srcappcode');
	let userJson = { scene: scene, pagecode: pagecode };
	if (srcappcode && srcappcode != 'null') {
		userJson['appcode'] = srcappcode;
	}
	props.pushTo(_url, userJson);
}

export default {
	setOprationBtnsRenderStatus,
	getPayMentOprButton,
	getMaterialOprButtons,
	togglePageShow,
	tabChange,
	metarialSelected,
	materialButtonInit,
	paymentShow,
	cachedata,
	materialPasteCancel,
	doCancel,
	showEmptyBrowsePage,
	gobackTransferPage
};
