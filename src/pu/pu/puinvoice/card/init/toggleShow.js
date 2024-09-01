/*
 * @Author:jiangfw
 * @PageInfo:  界面状态控制
 * @Date: 2018-06-13 18:58:18 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-07-28 16:24:48
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
			}
		}
	}
	let type = this.props.getUrlParam('type'); //转单类型
	// if (type) {
	// 	status = this.indexstatus[this.curindex];
	// }

	if (this.scene == SCENE.approvesce) {
		this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
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
						BUTTONID.Refresh
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						BUTTONID.Edit,
						BUTTONID.Save,
						BUTTONID.Cancel,
						BUTTONID.AddLine,
						BUTTONID.CopyLine,
						BUTTONID.DeleteLine,
						BUTTONID.DeleteLine_i,
						BUTTONID.CopyLine,
						BUTTONID.Hphq,
						BUTTONID.ReRankRownum,
						// BUTTONID.PasteToTail,
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
						BUTTONID.DocMng,
						BUTTONID.Print,
						BUTTONID.PrintCountQuery,
						BUTTONID.Refresh
					],
					true
				);
				this.props.button.setButtonVisible(
					[
						BUTTONID.Save,
						BUTTONID.Cancel,
						BUTTONID.AddLine,
						BUTTONID.CopyLine,
						BUTTONID.DeleteLine,
						BUTTONID.DeleteLine_i,
						BUTTONID.CopyLine,
						BUTTONID.Hphq,
						BUTTONID.ReRankRownum,
						// BUTTONID.PasteToTail,
						BUTTONID.Cancel_b,
						BUTTONID.PasteHere
					],
					false
				);
			}
			this.props.form.setFormStatus(this.formId, UISTATE.browse);
			this.props.cardTable.setStatus(this.tableId, UISTATE.browse);
		} else {
			//编辑态
			this.props.button.setButtonVisible(
				[
					BUTTONID.Save,
					BUTTONID.Cancel,
					BUTTONID.AddLine,
					BUTTONID.CopyLine,
					BUTTONID.DeleteLine,
					BUTTONID.DeleteLine_i,
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
					BUTTONID.DocMng,
					BUTTONID.Print,
					BUTTONID.PrintCountQuery,
					BUTTONID.Refresh
				],
				false
			);
			this.props.form.setFormStatus(this.formId, UISTATE.edit);
			this.props.cardTable.setStatus(this.tableId, UISTATE.edit);
		}
	} else {
		// 非审批中心场景
		if (status != UISTATE.browse) {
			if (status == UISTATE.edit) {
				// 修改态，财务组织不可编辑
				this.props.form.setFormItemsDisabled(this.formId, { pk_org_v: true });
			} else {
				this.props.form.setFormItemsDisabled(this.formId, { pk_org_v: false });
			}
			if (type) {
				//转单过来显示参照增行、退出转单
				this.props.button.setButtonVisible([ BUTTONID.RefAddLine, BUTTONID.Quit ], true);
			} else {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], false);
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: false
				});
				// 设置参照增行
				let bodys = this.props.cardTable.getAllData('card_body').rows;
				let isSelfMade = isSelfAdd(bodys);
				let refAddLineFlag = status == UISTATE.edit && !isSelfMade && !copyFlag ? true : false;
				this.props.button.setButtonVisible([ BUTTONID.RefAddLine ], refAddLineFlag);
			}
			//编辑态
			this.props.button.setButtonVisible(
				[
					BUTTONID.Save,
					BUTTONID.SaveCommit,
					BUTTONID.Cancel,
					BUTTONID.AddLine,
					BUTTONID.DeleteLine,
					BUTTONID.CopyLine,
					BUTTONID.Hphq,
					BUTTONID.ReRankRownum
				],
				true
			);
			this.props.button.setButtonVisible(
				[
					// BUTTONID.Back, //返回
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
					BUTTONID.PasteHere
				],
				false
			);
			// 表肩按钮
			let shoulderBtn = [ BUTTONID.DeleteLine, BUTTONID.CopyLine, BUTTONID.Hphq ];
			let rows = this.props.cardTable.getCheckedRows(this.tableId);
			let disableFlag = true;
			if (rows.length > 0) {
				disableFlag = false;
			}
			this.props.button.setDisabled(shoulderBtn, disableFlag);

			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			// 设置行号可编辑
			this.props.cardTable.setColEditableByKey(AREA.card_body, FIELD.crowno, false);
		} else {
			let id = this.props.getUrlParam('id');
			// 如果主键为空，则只显示新增按钮组
			if (!id || 'null' == id) {
				let hidebtnArry = [
					BUTTONID.Save,
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
					BUTTONID.PasteHere
				];
				this.props.button.setButtonVisible(hidebtnArry, false);
				this.props.button.setButtonVisible(BUTTONID.Add_G, true);
				// 设置翻页按钮状态
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				this.props.form.setFormStatus(this.formId, status);
				this.props.cardTable.setStatus(this.tableId, status);
				return;
			}

			// 设置行号不可编辑
			this.props.cardTable.setColEditableByKey(AREA.card_body, FIELD.crowno, true);
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
				BUTTONID.SaveCommit,
				BUTTONID.Cancel
			];
			this.props.button.setButtonVisible(hidebtns, false);
			this.props.button.setButtonVisible([ BUTTONID.Refresh ], true);

			//设置费用发票、联查费用发票按钮显示性
			let feeFlag = getHeadValue(this.props, FIELD.bfee).value;
			this.props.button.setButtonVisible([ BUTTONID.FeeInvoice, BUTTONID.LinkQueryFeeInvoice ], !feeFlag);

			//转单界面显示退出转单按钮、非转单界面显示新增按钮组及复制按钮
			if (type) {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], true);
				// this.props.button.setButtonVisible([BUTTONID.Add_G, BUTTONID.Copy], false);
				/**begain拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */
				this.props.button.setButtonVisible([ BUTTONID.Add_G, BUTTONID.Copy, BUTTONID.FeeInvoice ], false);
				/**end拉单界面费用发票不能编辑问题临时修改:拉单界面禁用费用发票按钮，后期酌情去掉-苏芬20181121 */
				// 设置翻页按钮状态
				this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			} else {
				this.props.button.setButtonVisible([ BUTTONID.Quit ], false);
				this.props.button.setButtonVisible([ BUTTONID.Add_G, BUTTONID.Copy ], true);
				// 设置翻页按钮状态
				if (this.PU_INVOICE_TYPE) {
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
				} else {
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
				}
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
				// 修改、提交主次按钮切换
				this.props.button.setMainButton(BUTTONID.Edit, false);
				this.props.button.setMainButton(BUTTONID.Commit, true);
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
				// 设置修改为非主要按钮
				this.props.button.setMainButton(BUTTONID.Edit, true);
				this.props.button.setMainButton(BUTTONID.Commit, false);
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

		if (UISTATE.add == status) {
			status = UISTATE.edit;
		}
		this.props.form.setFormStatus(this.formId, status);
		this.props.cardTable.setStatus(this.tableId, status);
	}
}
