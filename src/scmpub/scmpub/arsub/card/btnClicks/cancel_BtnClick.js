/*
 * @Author: 刘奇 
 * @PageInfo: 取消按钮点击事件
 * @Date: 2019-03-13 14:20:34 
 * @Last Modified by: zhangllb
 * @Last Modified time: 2022-06-22 14:45:32
 */

import { ARSUB_CONST, BUTTON, ArsubHeadItem } from '../../const';
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
		if (props.transferTable.getTransformFormCompleteStatus(ARSUB_CONST.left, index) == true) {
			let cachedata = props.transferTable.getTheTransferListDataSavedLastTime(ARSUB_CONST.left, index);
			props.form.setAllFormValue({ [ARSUB_CONST.formId]: cachedata.head[ARSUB_CONST.formId] });
			props.cardTable.setTableData(ARSUB_CONST.tableId, cachedata.body[ARSUB_CONST.tableId]);
			changeUrlParam(props, {
				buttonType: buttonType,
				status: ARSUB_CONST.browse,
				id: props.getUrlParam('id')
			});
		} else {
			if (props.transferTable.getTransformFormAmount(ARSUB_CONST.left) == 1) {
				// 是否有未处理的单据
				let path = '/' + buttonType;
				props.pushTo(path, { pagecode: ARSUB_CONST.listPageId });
				return;
			} else {
				props.transferTable.setTransformFormStatus(ARSUB_CONST.left, {
					status: false,
					onChange: (current, next) => {
						// showSuccessInfo(getLangByResId(this, '4006SALEORDER-000004')); /* 国际化处理： 取消成功*/
					}
				});
			}
		}
	} else {
		let lastId = this.cardLastId ? this.cardLastId : getCurrentLastId(ARSUB_CONST.ArsubCacheKey);
		this.cardLastId = null;
		changeUrlParam(props, {
			status: ARSUB_CONST.browse,
			id: lastId,
			buttonType: BUTTON.cancel
		});
		//当id不为空时查询数据塞入界面，当id为空时清空界面只保留增加按钮
		// modify by liulux 2021/08/15 添加判空
		if (lastId != undefined && lastId != null && lastId != 'null') {
			let id = this.props.getUrlParam('id');
			let cardData = getCacheDataByPk(this.props, ARSUB_CONST.ArsubCacheKey, id);
			if (cardData) {
				this.props.form.setAllFormValue({ head: cardData.head[this.headId] });
				this.props.cardTable.setTableData(ARSUB_CONST.tableId, cardData.body[ARSUB_CONST.tableId]);
				let billcodeStr = cardData.head[ARSUB_CONST.formId].rows[0].values[ArsubHeadItem.vbillcode].value;
				this.props.BillHeadInfo.setBillHeadInfoVisible({
					showBillCode: true,
					billCode: billcodeStr
				});
			} else {
				commonSearch_BtnClick.call(this, props, id);
			}
		} else {
			this.props.form.setFormItemsValue(ARSUB_CONST.formId, {
				[ArsubHeadItem.fstatusflag]: {}
			});
		}
	}
	buttonController.call(this, props);
}
