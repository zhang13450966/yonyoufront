/*
 * @Author: zhaochyu
 * @PageInfo: 联查采购计划
 * @Date: 2020-02-27 12:23:31
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-05-26 16:26:12
 */
import { toast, ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function linkPoPlanBtnClick(props) {
	let selectedRow = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
		});
		return;
	}
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
	if (pk_order == undefined) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000138') /* 国际化处理：订单未保存，无法联查采购计划！ */
		});
		return;
	}
	if (pk_order) {
		let conditionData = {
			pks: [ pk_order ],
			pageid: PAGECODE.cardcode
		};
		ajax({
			url: URL.linpayplay,
			data: conditionData,
			method: 'POST',
			success: (res) => {
				if (res.data) {
					this.setState({
						showNtbDetail: true,
						ntbdata: res.data
					});
				}
			}
		});
	}
}
