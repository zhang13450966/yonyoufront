import { pageInfoClick } from '../btnClicks';
import { URL, PAGECODE, FIELD, STATUS, OrderCache } from '../../constance';
import { getCurrentLastId, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { togglePageShow } from '../afterEvents';
import { buttonController } from '../viewController';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function cancelBtnClick(props, currentindex) {
	showWarningDialog(getLangByResId(this, '4004PRICESTL-000001'), getLangByResId(this, '4004PRICESTL-000002'), {
		/* 国际化处理： 取消,确认要取消吗？*/
		beSureBtnClick: () => {
			let pk_pricesettle = this.props.getUrlParam(FIELD.id);
			if (pk_pricesettle == null || pk_pricesettle == 'undefined') {
				pk_pricesettle = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
				pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
			}
			pk_pricesettle = pk_pricesettle == 'undefined' ? null : pk_pricesettle;
			this.props.form.cancel(PAGECODE.cardhead);
			setTimeout(() => {
				this.props.cardTable.resetTableData(PAGECODE.cardbody);
			}, 0);
			this.props.cardTable.resetTableData(PAGECODE.cardbodyano);
			pk_pricesettle = pk_pricesettle == null ? getCurrentLastId(OrderCache.OrderCacheKey) : pk_pricesettle;
			if (pk_pricesettle != null) {
				let cardData = getCacheDataByPk(props, OrderCache.OrderCacheKey, pk_pricesettle);
				// 先从缓存中获取，缓存中有，使用缓存中的，缓存中没有，发请求查询
				if (cardData) {
					this.props.form.setAllFormValue({
						[PAGECODE.cardhead]: cardData.head[PAGECODE.cardhead]
					});
					this.props.cardTable.setTableData(PAGECODE.cardbodyano, cardData.bodys[PAGECODE.cardbodyano]);
					this.props.cardTable.setTableData(PAGECODE.cardbody, cardData.bodys[PAGECODE.cardbody]);
				} else {
					pageInfoClick.call(this, this.props, pk_pricesettle);
				}
			} else {
				props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
				setTimeout(() => {
					//执行跳出堆栈
					props.cardTable.setTableData(PAGECODE.cardbodyano, { rows: [] }); //付款
					props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
				}, 0);
				props.form.setFormItemsValue(PAGECODE.cardhead, {
					[FIELD.fbillstatus]: {
						value: '0',
						display: getLangByResId(this, '4004PRICESTL-000003') /* 国际化处理： 自由*/
					} /* 国际化处理： 自由*/
				});
			}

			// 将页面状态置为浏览态
			props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
			let scence = this.props.getUrlParam('scene');
			this.props.pushTo(URL.gotoCard, {
				status: STATUS.browse,
				id: pk_pricesettle,
				scene: scence,
				pagecode: PAGECODE.cardcode
			});
			let billStatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
			billStatus = billStatus && billStatus.value;
			// togglePageShow.call(this, this.props, STATUS.browse, billStatus);
			buttonController.call(this, this.props, STATUS.browse, billStatus);
		}
	});
}
