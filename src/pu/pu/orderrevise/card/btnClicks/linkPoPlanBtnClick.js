/*
 * @Author: zhaochyu
 * @PageInfo: 联查采购计划
 * @Date: 2020-02-27 12:23:31
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-07-15 11:25:21
 */
import { toast, ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function linkPoPlanBtnClick(props) {
	let selectedRow = props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ORDERREVISE-000006') /* 国际化处理： 请选择数据！*/
		});
		return;
	}
	let pk_order = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value;
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
