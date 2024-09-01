/*
 * @Author: 刘奇 
 * @PageInfo: 取消按钮点击事件
 * @Date: 2019-03-13 14:20:34 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:14:53
 */

import { PREPAIDINVOICE_CONST, BUTTON, PrepaidinvoiceHeadItem } from '../../const';
import buttonController from '../viewController/buttonController';
import { getCurrentLastId, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache/index';
import commonSearch_BtnClick from './commonSearch_BtnClick';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';

export default function buttonClick(props, index) {
	showCancelDialog({ beSureBtnClick: cancel.bind(this, props, index) });
}

function cancel(props, index) {
	let buttonType = this.props.getUrlParam('buttonType');

	// 转单的取消处理
	if (buttonType != undefined && buttonType.indexOf('ref') != -1) {
		if (props.transferTable.getTransformFormCompleteStatus(PREPAIDINVOICE_CONST.left, index) == true) {
			let cachedata = props.transferTable.getTheTransferListDataSavedLastTime(PREPAIDINVOICE_CONST.left, index);
			props.form.setAllFormValue({ [PREPAIDINVOICE_CONST.formId]: cachedata.head[PREPAIDINVOICE_CONST.formId] });
			props.cardTable.resetTableData(PREPAIDINVOICE_CONST.tableId);
			changeUrlParam(props, {
				buttonType: buttonType,
				status: PREPAIDINVOICE_CONST.browse,
				id: props.getUrlParam('id')
			});
		} else {
			if (props.transferTable.getTransformFormAmount(PREPAIDINVOICE_CONST.left) == 1) {
				// 是否有未处理的单据
				let path = '/' + buttonType;
				props.pushTo(path, { pagecode: PREPAIDINVOICE_CONST.listPageId });
			} else {
				props.transferTable.setTransformFormStatus(PREPAIDINVOICE_CONST.left, {
					status: false,
					onChange: (current, next) => {
						// showSuccessInfo(getLangByResId(this, '4006SALEORDER-000004')); /* 国际化处理： 取消成功*/
					}
				});
			}
		}
	} else {
		let lastId = this.cardLastId ? this.cardLastId : getCurrentLastId(PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey);
		if (buttonType == BUTTON.add || buttonType == BUTTON.copy) {
			changeUrlParam(props, {
				status: PREPAIDINVOICE_CONST.browse,
				id: lastId,
				buttonType: BUTTON.cancel
			});
		} else {
			let id = this.props.getUrlParam('id') == 'null' ? '' : this.props.getUrlParam('id');
			changeUrlParam(props, {
				status: PREPAIDINVOICE_CONST.browse,
				id: id,
				buttonType: BUTTON.cancel
			});
		}
		//当id不为空时查询数据塞入界面，当id为空时清空界面只保留增加按钮
		// modify by liulux 2021/08/15 添加判空
		if (
			this.props.getUrlParam('id') != null &&
			this.props.getUrlParam('id') != undefined &&
			this.props.getUrlParam('id') != 'null'
		) {
			let id = this.props.getUrlParam('id');
			let cardData = getCacheDataByPk(this.props, PREPAIDINVOICE_CONST.PrepaidinvoiceCacheKey, id);
			if (cardData) {
				this.props.form.setAllFormValue({ head: cardData.head[this.headId] });
				this.props.cardTable.setTableData(
					PREPAIDINVOICE_CONST.tableId,
					cardData.body[PREPAIDINVOICE_CONST.tableId]
				);
				let billcodeStr =
					cardData.head[PREPAIDINVOICE_CONST.formId].rows[0].values[PrepaidinvoiceHeadItem.vbillcode].value;
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBillCode: true,
					billCode: billcodeStr
				});
			} else {
				commonSearch_BtnClick.call(this, props, id);
			}
		} else {
			this.props.form.setFormItemsValue(PREPAIDINVOICE_CONST.formId, {
				[PrepaidinvoiceHeadItem.fstatusflag]: {}
			});
		}
	}
	buttonController.call(this, props);
}
