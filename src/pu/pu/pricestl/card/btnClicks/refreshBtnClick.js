import { getDefData, changeUrlParam, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { ajax } from 'nc-lightapp-front';
import { togglePageShow } from '../afterEvents';
import { buttonController } from '../viewController';
import { URL, PAGECODE, FIELD, STATUS, BUTTON, OrderCache } from '../../constance';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function refreshBtnClick(props, pk_pricesettle, isshow) {
	if (pk_pricesettle) {
		changeUrlParam(props, { id: pk_pricesettle, status: STATUS.browse });
	}
	pk_pricesettle =
		pk_pricesettle == null
			? props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle).value
			: pk_pricesettle;
	if (pk_pricesettle) {
		let conditionData = {
			pks: [ pk_pricesettle ],
			pageid: PAGECODE.cardcode
		};
		ajax({
			url: URL.getCard,
			data: conditionData,
			method: 'POST',
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (res.data) {
					let data = res.data;
					if (data.head) {
						this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
					}
					if (data.bodys) {
						let cards = data.bodys;
						if (cards[PAGECODE.cardbodyano]) {
							this.props.cardTable.setTableData(PAGECODE.cardbodyano, cards[PAGECODE.cardbodyano]);
						}
						if (cards[PAGECODE.cardbody]) {
							this.props.cardTable.setTableData(PAGECODE.cardbody, cards[PAGECODE.cardbody]);
						}
					}
					let billStatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
					billStatus = billStatus && billStatus.value;
					// togglePageShow.call(this, this.props, STATUS.browse, billStatus);
					buttonController.call(this, this.props, STATUS.browse, billStatus);
				}
				// showSuccessInfo(getLangByResId(this, '4004PRICESTL-000010')); /* 国际化处理： 刷新成功*/
				if (isshow != false) {
					showSuccessInfo(getLangByResId(this, '4004PRICESTL-000010')); /* 国际化处理： 刷新成功*/
				}
			}
		});
	} else {
		props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
		props.cardTable.setTableData(PAGECODE.cardbodyano, { rows: [] }); //优质优价
		props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
		// togglePageShow.call(this, this.props);//如果没有数据直接置空
	}
	// if (isshow != false) {
	// 	showSuccessInfo(getLangByResId(this, '4004PRICESTL-000010')); /* 国际化处理： 刷新成功*/
	// }
}
