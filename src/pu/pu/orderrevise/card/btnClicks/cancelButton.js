/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-04-20 10:17:37 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-22 21:05:06
 */
import { URL, PAGECODE, FIELD, STATUS, OrderReviseCache } from '../../constance';
import { pageInfoClick } from './index';
import { getCurrentLastId, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';

export default function cancelButton(props) {
	//回到页面上次状态
	showWarningDialog(getLangByResId(this, '4004ORDERREVISE-000024'), getLangByResId(this, '4004ORDERREVISE-000007'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: () => {
			// 单据卡片界面，在浏览态时勾选行，点修改后去掉勾选，付款协议和物料
			this.props.cardTable.selectAllRows(PAGECODE.cardbody, false);
			buttonController.materialPasteCancel.call(this, this.props);
			// 缓存处理 begin
			let id = this.props.getUrlParam(FIELD.id);
			if (id == null || id == 'undefined') {
				id = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.id);
				id = id && id.value;
			}
			id = id == null ? getCurrentLastId(OrderReviseCache.OrderReviseCacheKey) : id;
			if (id != null) {
				let cardData = getCacheDataByPk(id, OrderReviseCache.OrderReviseCacheKey);
				// 先从缓存中获取，缓存中有，使用缓存中的，缓存中没有，发请求查询
				if (cardData) {
					this.props.form.setAllFormValue({ [PAGECODE.cardhead]: cardData.head[PAGECODE.cardhead] });
					this.props.cardTable.setTableData(PAGECODE.cardbody, cardData.bodys[PAGECODE.cardbody]);
				} else {
					pageInfoClick.call(this, this.props);
				}
			}
			// 缓存处理 end
			// 取消时，放开对库存组织、仓库的控制，否则，修改之后新增会导致仓库不可编辑
			props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: false });
			// 将页面状态置为浏览态
			props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
			props.cardTable.setStatus(PAGECODE.cardbody, STATUS.browse);
			changeUrlParam(props, { id: id, status: STATUS.browse });
			buttonController.togglePageShow.call(this, this.props);
		},
		cancelBtnClick: () => {}
	});
}
