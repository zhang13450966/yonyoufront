/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义取消
 * @Date: 2020-02-10 12:41:06
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 15:51:42
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, FILED, CARRIERDATASOURCE, STATUS, URL, PAGEID, HEADFILED } from '../../constance';
import { showOnlyAddButton } from '../viewController/buttonController';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { getCurrentLastId, getCacheDataByPk, updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	removeAllTableData,
	setAllTableData,
	setHeadCsupplierField,
	removeHeadCsupplierField
} from './setAllTableData';
export default function cancelBtnClick(props) {
	// 执行取消操作提示
	showWarningDialog(getLangByResId(this, '4001CARRIER-000001'), getLangByResId(this, '4001CARRIER-000002'), {
		/* 国际化处理： 取消,确定要取消吗？*/
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			let status = this.props.getUrlParam(FILED.cardStatus);
			this.props.resMetaAfterPkorgEdit();
			this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, true); //设置翻页显示
			let ccarrierid = this.props.getUrlParam(FILED.cardId);
			let from = this.props.getUrlParam('from');
			let update = this.props.getUrlParam('update');
			if (from == 'list') {
				let pk = null;
				if (update === 'update') {
					pk = ccarrierid;
				} else {
					pk = getCurrentLastId(CARRIERDATASOURCE.carrierdatasource);
				}
				if (pk != null) {
					//获取缓冲中的数据
					let cardData = getCacheDataByPk(props, CARRIERDATASOURCE.carrierdatasource, pk);
					if (cardData) {
						this.props.form.setAllFormValue({
							[AREA.card_head]: cardData.carrier[AREA.listTable]
						});
						//this.props.cardTable.setTableData(AREA.driver, cardData.body[AREA.driver]);
						this.props.pushTo(URL.gotoCard, {
							status: STATUS.browse,
							id: pk
						});
						this.props.BillHeadInfo.setBillHeadInfoVisible({
							showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
						});
					} else {
						getCardData.call(this, this.props, pk, false);
						this.props.pushTo(URL.gotoCard, {
							status: STATUS.browse,
							id: pk
						});
					}
					this.toggleShow(STATUS.browse);
					return;
				} else {
					props.form.EmptyAllFormValue(AREA.card_head);
					props.form.setFormStatus(AREA.card_head, STATUS.browse);
					removeAllTableData.call(this);
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					});
					showOnlyAddButton.call(this);
					this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
					return;
				}
			} else if (status == STATUS.add || status == STATUS.edit) {
				if (ccarrierid && 'null' !== ccarrierid) {
					props.form.cancel(AREA.card_head);
					this.props.pushTo(URL.gotoCard, {
						status: STATUS.browse,
						id: ccarrierid
					});
					this.toggleShow(STATUS.browse);
				} else {
					props.form.EmptyAllFormValue(AREA.card_head);
					props.form.setFormStatus(AREA.card_head, STATUS.browse);
					removeAllTableData.call(this);
					this.props.cardPagination.setCardPaginationVisible(FILED.cardPaginationBtn, false); //设置翻页不显示
					this.props.BillHeadInfo.setBillHeadInfoVisible({
						showBackBtn: true //控制显示返回按钮: true为显示,false为隐藏 ---非必传
					});
					showOnlyAddButton.call(this);
				}
				//恢复编辑性
				props.resMetaAfterPkorgEdit(FILED.pk_org_v);
			} else {
				let currentpk = null;
				let id = getCurrentLastId(CARRIERDATASOURCE.carrierdatasource);
				if (ccarrierid != null && !copy) {
					currentpk = ccarrierid;
					getCardData.call(this, this.props, currentpk, false);
				} else {
					currentpk = id;
				}
				this.props.pushTo(URL.gotoCard, {
					status: STATUS.browse,
					billStatus: billStatus,
					id: currentpk
				});
				this.toggleShow();
				this.props.setUrlParam(currentpk);
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBackBtn: true
				});
				if (id == null || id == '' || ccarrierid != null) return;
			}
		}
	});
}
function getCardData(props, pk, flag) {
	let data = { id: pk, pagecode: PAGEID.cardpagecodeorg };
	ajax({
		url: URL.cardQuery,
		data: data,
		method: 'post',
		success: (res) => {
			if (res.data === undefined) {
				this.props.form.setAllFormValue(AREA.card_head, { rows: [ {} ] });
				removeHeadCsupplierField.call(this);
				this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
				return;
			}
			//将查询出来的数据放到缓冲里边
			updateCacheData(
				props,
				HEADFILED.ccarrierid,
				pk,
				res.data,
				AREA.card_head,
				CARRIERDATASOURCE.carrierdatasource
			);
			if (res.data.carrier) {
				this.props.form.setAllFormValue({
					[AREA.card_head]: res.data.carrier[AREA.listTable]
				});
				if (res.data.supplier) {
					setHeadCsupplierField.call(this, res.data.supplier[AREA.listTable]);
				}
			}
			setAllTableData.call(this, res.data);
			this.props.setUrlParam(pk);
		}
	});
}
