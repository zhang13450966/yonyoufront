/*
 * @Author: zhaochyu 
 * @PageInfo: 销量查询
 * @Date: 2019-04-09 14:32:01 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-04-12 10:53:28
 */
import { toast, ajax } from 'nc-lightapp-front';
import { PAGECODE, SALESQUERY, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function salesQuery(props) {
	let selectedRow = this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
		});
		return;
	}
	let rowparam = [];
	selectedRow.map((item) => {
		if (item.data.values.pk_material.value) {
			let data = {
				pk_org: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value,
				iqueryday: 7,
				cunitid: item.data.values.cunitid.value,
				pk_srcmaterial: item.data.values.pk_srcmaterial.value,
				pk_material: item.data.values.pk_material.value,
				matname: item.data.values['pk_material.name'].display,
				matspec: item.data.values['pk_material.materialspec'].value,
				mattype: item.data.values['pk_material.materialtype'].value
			};
			rowparam.push(data);
		}
	});
	let salesquerydata = {
		infos: rowparam,
		advo: rowparam,
		pagecode: SALESQUERY.PAGECODE
	};
	this.setState({
		salesquerydata: salesquerydata
	});
	let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value;
	ajax({
		url: URL.checkorg,
		data: { pk_org: pk_org },
		success: (res) => {
			let { data } = res;
			if (data) {
				if (data.issaleorg == 'false') {
					this.setState({
						showSalesQuery: false
					});
					showErrorInfo(data.errmess);
				}
				if (data.issaleorg == 'true') {
					this.setState({
						showSalesQuery: true
					});
				}
			}
		}
	});
}
