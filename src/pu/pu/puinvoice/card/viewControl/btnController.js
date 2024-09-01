/*
 * @Author:jiangfw
 * @PageInfo:  界面状态控制
 * @Date: 2018-06-13 18:58:18
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-29 14:11:13
 */
import { UISTATE, BUTTONID, BILLSTATUS, FIELD, AREA, COMMON, SCENE } from '../../constance';
import { getHeadValue } from '../utils/cardUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import isSelfAdd from '../utils/isSelfAdd';
import { getAddBtnVisable } from '../../utils/getAddBtnVisable';

export default function(status, copyFlag) {
	if (!status) {
		status = this.props.getUrlParam('status'); //界面状态
		if (!status) {
			if (this.PU_INVOICE_TYPE) {
				status = UISTATE.add;
			} else {
				// 若浏览器刷新则状态更改为浏览态
				status = UISTATE.browse;
			}
		}
	}
	let sagaStatus = this.props.form.getFormItemsValue([ AREA.card_head ], FIELD.sagaStatus); //获得saga状态 // 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	let type = this.props.getUrlParam('type'); //转单类型

	// 1.设置界面状态
	setUIState.call(this, this.props, status);
	// 2.设置按钮的显示隐藏
	setCardButtonVisiable.call(this, status, type, copyFlag);
	// 3.设置主按钮
	setMainButton.call(this, this.props, status);
	// 4.返回按钮的显示隐藏
	setBackButtonVisiable.call(this, status, type);
	// 5.设置卡片分页器的显示隐藏
	setCardPaginationVisible.call(this, status, type);
	// 6.设置组织编辑性
	setOrgEdit.call(this, status);

	// if (status != UISTATE.edit && status != UISTATE.browse) {
	// 	this.props.executeAutoFocus();
	// }
	setSagaBtnState.call(this, status, frozen);
}

/**
 * 设置界面状态
 * @param {*} props
 * @param {*} status
 */
function setUIState(props, status) {
	let formstatus = null;
	let tablestatus = null;
	if (status == UISTATE.browse) {
		formstatus = UISTATE.browse;
		tablestatus = UISTATE.browse;
	} else {
		formstatus = UISTATE.edit;
		tablestatus = UISTATE.edit;
	}
	props.form.setFormStatus(this.formId, formstatus);
	props.cardTable.setStatus(this.tableId, tablestatus);
}
/**
 * 设置按钮显隐性
 * 1.优先根据界面状态判断显示按钮显示
 * 2.再根据单据状态控制按钮显示
 * @param {*} status
 * @param {*} type
 * @param {*} copyFlag 是否复制
 */
function setCardButtonVisiable(status, type, copyFlag) {
	if (this.scene == SCENE.approvesce || this.scene == 'zycl' || this.scene == 'zycx') {
		//审批中心使用
		this.props.button.setButtonVisible([ BUTTONID.TemporaryStorage, BUTTONID.ShowDraft ], false);
		//审批中心场景
		if (status == UISTATE.browse) {
			let fbillstatus = getHeadValue(this.props, FIELD.fbillstatus).value; //单据状态
			if (fbillstatus == BILLSTATUS.approve) {
				//审批通过
				this.props.button.setButtonVisible(
					[
						BUTTONID.QueryAboutBusiness,
						BUTTONID.DocMng,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery,
						BUTTONID.Refresh,
						BUTTONID.ImageScan,
						BUTTONID.ImageView,
						BUTTONID.LinkInvoice,
						BUTTONID.InvoiceDzfp
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						BUTTONID.Add_G,
						BUTTONID.Add,
						BUTTONID.Delete,
						BUTTONID.Freeze,
						BUTTONID.UnFreeze,
						BUTTONID.FeeInvoice,
						BUTTONID.Copy,
						BUTTONID.Edit,
						BUTTONID.Save,
						BUTTONID.Cancel,
						BUTTONID.AddLine,
						BUTTONID.CopyLine,
						BUTTONID.DeleteLine,
						// BUTTONID.DeleteLine_i,
						BUTTONID.CopyLine,
						BUTTONID.Hphq,
						BUTTONID.ReRankRownum,
						BUTTONID.PasteToTail,
						BUTTONID.RefAddLine,
						BUTTONID.Cancel_b,
						BUTTONID.PasteHere
					],
					false
				);
			} else {
				//审批中
				this.props.button.setButtonVisible(
					[
						BUTTONID.Edit,
						BUTTONID.QueryAboutBusiness,
						BUTTONID.LinkInvoice,
						BUTTONID.InvoiceDzfp,
						BUTTONID.DocMng,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery,
						BUTTONID.Refresh,
						BUTTONID.ImageScan,
						BUTTONID.ImageView
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						BUTTONID.Add_G,
						BUTTONID.Add,
						BUTTONID.Delete,
						BUTTONID.Freeze,
						BUTTONID.UnFreeze,
						BUTTONID.FeeInvoice,
						BUTTONID.Copy,
						BUTTONID.Save,
						BUTTONID.Cancel,
						BUTTONID.AddLine,
						BUTTONID.CopyLine,
						BUTTONID.DeleteLine,
						// BUTTONID.DeleteLine_i,
						BUTTONID.CopyLine,
						BUTTONID.Hphq,
						BUTTONID.ReRankRownum,
						// BUTTONID.PasteToTail,
						BUTTONID.RefAddLine,
						BUTTONID.Cancel_b,
						BUTTONID.PasteHere
					],
					false
				);
			}
			//设置费用发票、联查费用发票按钮显示性
			let feeFlag = getHeadValue(this.props, FIELD.bfee).value;
			this.props.button.setButtonVisible([ BUTTONID.FeeInvoice, BUTTONID.LinkQueryFeeInvoice ], !feeFlag);
		} else {
			//编辑态
			this.props.button.setButtonVisible(
				[
					BUTTONID.Save,
					BUTTONID.Cancel,
					BUTTONID.AddLine,
					BUTTONID.CopyLine,
					BUTTONID.DeleteLine,
					// BUTTONID.DeleteLine_i,
					BUTTONID.CopyLine,
					BUTTONID.Hphq,
					BUTTONID.ReRankRownum,
					// BUTTONID.PasteToTail,
					BUTTONID.Cancel_b
					// BUTTONID.PasteHere
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					BUTTONID.Edit,
					BUTTONID.QueryAboutBusiness,
					BUTTONID.LinkInvoice,
					BUTTONID.InvoiceDzfp,
					BUTTONID.DocMng,
					BUTTONID.Print,
					BUTTONID.PrintCountQuery,
					BUTTONID.Refresh,
					BUTTONID.ImageScan,
					BUTTONID.ImageView
				],
				false
			);
		}
	} else {
		// 非审批中心场景
		if (status != UISTATE.browse) {
			if (type) {
				//转单过来显示参照增行、退出转单
				this.props.button.setButtonVisible([ BUTTONID.RefAddLine, BUTTONID.Quit ], true);
			} else {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], false);
				// 设置参照增行
				let bodys = this.props.cardTable.getAllData('card_body').rows;
				let isSelfMade = isSelfAdd(bodys);
				let channelType = this.props.getUrlParam('channelType'); //推单类型
				let refAddLineFlag = status == UISTATE.edit && !isSelfMade && !copyFlag ? true : false;
				refAddLineFlag = refAddLineFlag && !channelType;
				this.props.button.setButtonVisible([ BUTTONID.RefAddLine ], refAddLineFlag);
			}
			//编辑态
			this.props.button.setButtonVisible(
				[
					BUTTONID.Save,
					BUTTONID.TemporaryStorage,
					BUTTONID.SaveCommit,
					BUTTONID.Cancel,
					BUTTONID.AddLine,
					BUTTONID.DeleteLine,
					BUTTONID.CopyLine,
					BUTTONID.Hphq,
					BUTTONID.ReRankRownum,
					BUTTONID.ShowDraft
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					BUTTONID.Add_G, //新增按钮组
					BUTTONID.Assist, //辅助按钮组
					BUTTONID.LinkQuery, //联查
					BUTTONID.Print, //打印
					BUTTONID.PrintCountQuery, //打印次数查询
					BUTTONID.Refresh, //刷新
					BUTTONID.Commit, //提交
					BUTTONID.SendAp, //传应付
					BUTTONID.CancelSendAp, //取消传应付
					BUTTONID.Edit, //修改
					BUTTONID.Copy, //复制
					BUTTONID.Delete, //删除
					BUTTONID.UnCommit, //收回
					BUTTONID.PasteToTail,
					BUTTONID.Cancel_b,
					BUTTONID.PasteHere,
					BUTTONID.ImageScan,
					BUTTONID.ImageView,
					BUTTONID.InvoiceDzfp //电子发票
				],
				false
			);
			// 表肩按钮
			let shoulderBtn = [ BUTTONID.DeleteLine, BUTTONID.CopyLine, BUTTONID.Hphq ];
			let pk_org = getHeadValue(this.props, FIELD.pk_org).value;
			if (status == UISTATE.add && !pk_org) {
				shoulderBtn.push(BUTTONID.AddLine);
			}
			let rows = this.props.cardTable.getCheckedRows(this.tableId);
			let disableFlag = true;
			if (rows.length > 0) {
				disableFlag = false;
			}
			this.props.button.setDisabled(shoulderBtn, disableFlag);
			// 设置行号可编辑
			// this.props.cardTable.setColEditableByKey(AREA.card_body, FIELD.crowno, false);
		} else {
			//this.props.button.setDisabled({ [BUTTONID.TemporaryStorage]: true });
			//this.props.button.setButtonVisible(BUTTONID.TemporaryStorage, false);
			let id = this.props.getUrlParam('id');
			// 如果主键为空，则只显示新增按钮组
			if (!id || 'null' == id) {
				let hidebtnArry = [
					BUTTONID.Save,
					BUTTONID.TemporaryStorage,
					BUTTONID.SaveCommit,
					BUTTONID.Cancel,
					BUTTONID.AddLine,
					BUTTONID.CopyLine,
					BUTTONID.DeleteLine,
					BUTTONID.CopyLine,
					BUTTONID.Copy,
					BUTTONID.Hphq,
					BUTTONID.ReRankRownum,
					BUTTONID.Back, //返回
					BUTTONID.Assist, //辅助按钮组
					BUTTONID.LinkQuery, //联查
					BUTTONID.Print, //打印
					BUTTONID.PrintCountQuery, //打印次数查询
					BUTTONID.Refresh, //刷新
					BUTTONID.Commit, //提交
					BUTTONID.SendAp, //传应付
					BUTTONID.CancelSendAp, //取消传应付
					BUTTONID.Edit, //修改
					BUTTONID.Copy, //复制
					BUTTONID.Delete, //删除
					BUTTONID.UnCommit, //收回
					BUTTONID.PasteToTail,
					BUTTONID.Cancel_b,
					BUTTONID.PasteHere,
					BUTTONID.ImageView, //影像查看
					BUTTONID.ImageScan, //影像扫描
					BUTTONID.InvoiceDzfp, //电子发票
					BUTTONID.RefAddLine // 表体参照增行
				];
				this.props.button.setButtonVisible(hidebtnArry, false);
				this.props.button.setButtonVisible(BUTTONID.Add_G, true);
				return;
			}
			this.props.button.setButtonVisible(BUTTONID.ShowDraft, true);
			// 设置行号不可编辑
			// this.props.cardTable.setColEditableByKey(AREA.card_body, FIELD.crowno, true);
			let fbillstatus = getHeadValue(this.props, FIELD.fbillstatus).value; //单据状态
			let bfrozen = getHeadValue(this.props, FIELD.bfrozen).value; //冻结状态
			if (null == bfrozen) bfrozen = false;

			// 冻结、解冻
			this.props.button.setButtonVisible(BUTTONID.Freeze, !bfrozen);
			this.props.button.setButtonVisible(BUTTONID.UnFreeze, bfrozen);
			// 浏览态均不显示的按钮
			let hidebtns = [
				BUTTONID.ShoulderGroup1,
				BUTTONID.AddLine,
				BUTTONID.DeleteLine,
				BUTTONID.CopyLine,
				BUTTONID.PasteHere,
				BUTTONID.Hphq,
				BUTTONID.BatchMdf,
				BUTTONID.ReRankRownum,
				// BUTTONID.Quit,
				BUTTONID.PasteToTail,
				BUTTONID.Cancel_b,
				BUTTONID.RefAddLine,
				BUTTONID.Save,
				BUTTONID.TemporaryStorage,
				BUTTONID.SaveCommit,
				BUTTONID.Cancel
			];
			this.props.button.setButtonVisible(hidebtns, false);
			this.props.button.setButtonVisible(
				[
					BUTTONID.ImageView,
					BUTTONID.ImageScan,
					BUTTONID.Refresh,
					BUTTONID.LinkInvoice,
					BUTTONID.InvoiceDzfp
				],
				true
			);

			//设置费用发票、联查费用发票按钮显示性
			let feeFlag = getHeadValue(this.props, FIELD.bfee).value;
			this.props.button.setButtonVisible([ BUTTONID.FeeInvoice, BUTTONID.LinkQueryFeeInvoice ], !feeFlag);

			//转单界面显示退出转单按钮、非转单界面显示新增按钮组及复制按钮
			if (type) {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], true);
				// this.props.button.setButtonVisible([BUTTONID.Add_G, BUTTONID.Copy], false);
				/**begain拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */
				this.props.button.setButtonVisible([ BUTTONID.Add_G, BUTTONID.Copy ], false);
				/**end拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */
			} else {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], false);
				this.props.button.setButtonVisible([ BUTTONID.Add_G, BUTTONID.Copy ], true);
			}

			if (fbillstatus == BILLSTATUS.free) {
				// 自由态
				this.props.button.setButtonVisible(
					[
						BUTTONID.Edit,
						BUTTONID.Delete,
						BUTTONID.Commit,
						BUTTONID.LinkQuery,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[ BUTTONID.UnCommit, BUTTONID.SendAp, BUTTONID.CancelSendAp ],
					false
				);
			} else if (fbillstatus == BILLSTATUS.nopass) {
				// 审批不通过
				this.props.button.setButtonVisible(
					[ BUTTONID.Edit, BUTTONID.Commit, BUTTONID.LinkQuery, BUTTONID.Print, BUTTONID.PrintCountQuery ],
					true
				);
				this.props.button.setButtonVisible(
					[ BUTTONID.UnCommit, BUTTONID.SendAp, BUTTONID.CancelSendAp, BUTTONID.Delete, BUTTONID.Commit ],
					false
				);
			} else if (fbillstatus == BILLSTATUS.approving) {
				//审批中
				this.props.button.setButtonVisible(
					[
						BUTTONID.UnCommit,
						BUTTONID.ApproveInfo,
						BUTTONID.LinkQuery,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[ BUTTONID.Commit, BUTTONID.Edit, BUTTONID.Delete, BUTTONID.SendAp, BUTTONID.CancelSendAp ],
					false
				);
			} else if (fbillstatus == BILLSTATUS.approve) {
				let bapflag = getHeadValue(this.props, FIELD.bapflag).value; //冻结状态
				if (null == bapflag) bapflag = false;

				// 传应付、取消传应付
				this.props.button.setButtonVisible(BUTTONID.SendAp, !bapflag);
				this.props.button.setButtonVisible(BUTTONID.CancelSendAp, bapflag);
				//执行中
				this.props.button.setButtonVisible(
					[
						BUTTONID.UnCommit,
						BUTTONID.ApproveInfo,
						BUTTONID.LinkQuery,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery
					],
					true
				);
				this.props.button.setButtonVisible(
					[ BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Commit, BUTTONID.FeeInvoice ],
					false
				);
			}

			if (!type) {
				// 交易类型发布的小应用新增按钮可用性
				let refBillTypeInfo = getDefData(COMMON.PuinvoiceCacheKey, COMMON.RefBillTypeInfo);
				let btnMap = getAddBtnVisable(refBillTypeInfo);
				let visableBtnArry = btnMap.get('Y');
				let disVisableBtnAry = btnMap.get('N');
				if (visableBtnArry && visableBtnArry.length > 0) {
					this.props.button.setButtonVisible(visableBtnArry, true);
				}
				if (disVisableBtnAry && disVisableBtnAry.length) {
					this.props.button.setButtonVisible(disVisableBtnAry, false);
				}
			}
		}

		if (type) {
			this.props.button.setButtonVisible([ BUTTONID.ShowDraft ], false);
		}
	}
}

/**
 * 设置主按钮
 * @param {*} props
 * @param {*} status
 */
function setMainButton(props, status) {
	if (this.scene != SCENE.approvesce && this.scene != 'zycl' && this.scene != 'zycx') {
		if (status == UISTATE.browse) {
			let id = props.getUrlParam('id');
			if (id && id != '') {
				let fbillstatus = getHeadValue(props, FIELD.fbillstatus).value; //单据状态
				if (fbillstatus == BILLSTATUS.free) {
					// 修改、提交主次按钮切换
					props.button.setMainButton(BUTTONID.Edit, false);
					props.button.setMainButton(BUTTONID.Commit, true);
				} else if (fbillstatus == BILLSTATUS.nopass) {
					// 设置修改为非主要按钮
					props.button.setMainButton(BUTTONID.Edit, true);
					props.button.setMainButton(BUTTONID.Commit, false);
				}
			}
		}
	}
}

/**
 * 设置返回按钮显隐性
 * @param {*} status
 * @param {*} type
 */
function setBackButtonVisiable(status, type) {
	// if (this.scene != SCENE.approvesce) {
	// 	if (status != UISTATE.browse) {
	// 		if (!type) {
	// 			this.props.BillHeadInfo.setBillHeadInfoVisible({
	// 				showBackBtn: false
	// 			});
	// 		}
	// 	} else {
	// 		this.props.BillHeadInfo.setBillHeadInfoVisible({
	// 			showBackBtn: true
	// 		});
	// 	}
	// }
	if (status == UISTATE.browse) {
		if (this.PU_INVOICE_TYPE) {
			//小应用不显示
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false
			});
		} else if (
			this.scene == SCENE.approvesce ||
			this.scene == 'zycl' ||
			this.scene == 'bz' ||
			this.scene == 'zycx'
		) {
			//this.scene == 'zycx' 适配共享的单据稽查
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true
			});
		}
	} else {
		if (!type) {
			//非转单界面不显示
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: false
			});
		} else {
			this.props.BillHeadInfo.setBillHeadInfoVisible({
				showBackBtn: true
			});
		}
	}
}

/**
 * 设置卡片分页器的显示隐藏
 * @param {*} type
 * @param {*} status
 */
function setCardPaginationVisible(status, type) {
	let id = this.props.getUrlParam('id');
	//审批中心场景、编辑态、主键为空、转单界面、采购发票新增小应用不显示
	if (
		this.scene == 'bz' ||
		this.scene == SCENE.approvesce ||
		status != UISTATE.browse ||
		!id ||
		'null' == id ||
		type ||
		this.PU_INVOICE_TYPE
	) {
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	} else {
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}
}

/**
 * 主组织编辑性
 * @param {*} status
 */
function setOrgEdit(status) {
	// if (this.scene != SCENE.approvesce) {
	if (status != UISTATE.browse) {
		if (status == UISTATE.edit) {
			// 修改态，财务组织不可编辑
			this.props.form.setFormItemsDisabled(this.formId, { pk_org_v: true });
		} else {
			this.props.form.setFormItemsDisabled(this.formId, { pk_org_v: false });
		}
	}
	// }
}
function setSagaBtnState(status, frozen) {
	// 设置回退、重试按钮状态，用来是否显示
	if (status == UISTATE.browse && frozen) {
		this.props.button.toggleErrorStatus(AREA.card_head, {
			isError: true
		});
	} else {
		this.props.button.toggleErrorStatus(AREA.card_head, {
			isError: false
		});
	}
}
