import { showSuccessInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { PAGECODE, FIELD, URL, STATUS, OrderCache } from '../../constance';
import { changeUrlParam, deleteCacheData, getNextId } from '../../../../../scmpub/scmpub/pub/cache';
import { togglePageShow } from '../afterEvents';
import { buttonController } from '../viewController';
import { refreshBtnClick } from '../btnClicks';
import { ajax, toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deletebtnclick(props) {
	showWarningDialog(getLangByResId(this, '4004PRICESTL-000007'), getLangByResId(this, '4004PRICESTL-000008'), {
		/* 国际化处理： 删除,确定要删除吗？*/
		beSureBtnClick: doDelete.bind(this, props)
	});
}
function doDelete(props) {
	let ts = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts);
	let pk_pricesettle = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_pricesettle);
	pk_pricesettle = pk_pricesettle && pk_pricesettle.value;
	pk_pricesettle =
		pk_pricesettle == null || pk_pricesettle == '' || pk_pricesettle == 'undefined'
			? props.getUrlParam(FIELD.id)
			: pk_pricesettle;
	pk_pricesettle = pk_pricesettle == '' || pk_pricesettle == 'undefined' ? null : pk_pricesettle;
	if (ts) {
		ts = ts.value;
	}
	let delinfos = { deleteInfo: [] };
	delinfos.deleteInfo.push({ ts: ts, pks: pk_pricesettle });
	ajax({
		url: URL.delete,
		data: delinfos,
		success: (res) => {
			props.form.setFormStatus(PAGECODE.cardhead, STATUS.browse);
			showSuccessInfo(getLangByResId(this, '4004PRICESTL-000009')); /* 国际化处理： 删除成功*/

			let nextId = getNextId(props, pk_pricesettle, OrderCache.OrderCacheKey);
			deleteCacheData(props, FIELD.pk_pricesettle, pk_pricesettle, OrderCache.OrderCacheKey);
			changeUrlParam(props, {
				status: STATUS.browse,
				id: nextId
			});
			if (nextId == null) {
				props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
				props.cardTable.setTableData(PAGECODE.cardbodyano, { rows: [] }); //优质优价
				props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
				changeUrlParam(props, { id: '' });
				buttonController.call(this, this.props); //此处未处理按钮的显示
				this.setState({
					dbaseprice: '', //基准含税单价
					vschemefrmlname: '', //总公式
					nschemecalvalue: '' //总计算结果
				});
			} else {
				refreshBtnClick.call(this, props, nextId, false);
			}
		}
	});
}
