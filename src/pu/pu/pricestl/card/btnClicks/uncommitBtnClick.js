import { URL, FIELD, PAGECODE, OrderCache, STATUS } from '../../constance';
import { showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
import { togglePageShow } from '../afterEvents';
import { buttonController } from '../viewController';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function uncommitBtnClick() {
	let pk_pricesettle = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
	pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
	let ts = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts).value;
	let rows = [];
	let info = {
		pks: pk_pricesettle,
		ts: ts
	};
	rows.push(info);
	let data = {
		closedto: rows,
		pagecode: PAGECODE.cardcode,
		extstr: ''
	};
	ajax({
		url: URL.uncommit,
		data: data,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					let datas = res.data;
					let pkCache;
					if (datas.head) {
						this.props.form.setAllFormValue({ [PAGECODE.cardhead]: datas.head[PAGECODE.cardhead] });
						pkCache = datas.head.card_head.rows[0].values.pk_pricesettle.value;
					}
					if (datas.bodys) {
						let cards = datas.bodys;
						if (cards.card_meterial) {
							this.props.cardTable.setTableData(PAGECODE.cardbody, cards[PAGECODE.cardbody]);
						}
						if (cards.car_quality) {
							this.props.cardTable.setTableData(PAGECODE.cardbodyano, cards[PAGECODE.cardbodyano]);
						}
					}
					updateCacheData(
						this.props,
						FIELD.pk_pricesettle,
						pkCache,
						res.data,
						PAGECODE.cardhead,
						OrderCache.OrderCacheKey
					);
					let resultMessage = getLangByResId(this, '4004PRICESTL-000013'); /* 国际化处理： 收回成功！*/
					showSuccessInfo(resultMessage);
					let billStatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
					billStatus = billStatus && billStatus.value;
					// togglePageShow.call(this, this.props, STATUS.browse, billStatus);
					buttonController.call(this, this.props, STATUS.browse, billStatus);
				}
			}
		},
		error: (error) => {
			showErrorInfo(getLangByResId(this, '4004PRICESTL-000014')); /* 国际化处理： 收回失败！*/
		}
	});
}
