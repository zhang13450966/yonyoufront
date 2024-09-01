/*
 * @Author: CongKe 
 * @PageInfo: 存量查询
 * @Date: 2018-06-27 13:13:14 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-10-12 14:12:02
 */
import { toast } from 'nc-lightapp-front';
import { FIELD, PAGECODE, STOCKQUERY } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function stockQuery(props) {
	let selectedRow = this.props.cardTable.getCheckedRows(PAGECODE.cardbody);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ORDERREVISE-000006') /* 国际化处理： 请选择数据！*/
		});
		return;
	}
	let rowparam = [];
	selectedRow.map((item) => {
		if (item.data.values.pk_material.value && item.data.values.pk_arrvstoorg.value) {
			let data = {
				pk_stockorgs: item.data.values.pk_arrvstoorg.value,
				crowno: item.data.values.crowno.value,
				cunitid: item.data.values.cunitid.value,
				pk_material: item.data.values.pk_srcmaterial.value,
				materialCode: item.data.values.pk_material.display,
				materialName: item.data.values['pk_material.name'].display,
				end_date: item.data.values.dplanarrvdate.value
			};
			rowparam.push(data);
		}
	});
	let stockquerydata = {
		infos: rowparam,
		pagecode: STOCKQUERY.PAGECODE
	};
	this.setState({
		showStockQuery: true,
		stockquerydata: stockquerydata
	});
}
