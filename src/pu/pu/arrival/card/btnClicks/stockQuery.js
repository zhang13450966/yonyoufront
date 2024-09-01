/*
 * @Author: CongKe 
 * @PageInfo: 存量查询
 * @Date: 2018-06-27 13:13:14 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-30 11:30:13
 */
import { toast } from 'nc-lightapp-front';
import { PAGECODE, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function stockQuery(props) {
	let selectedRow = this.props.cardTable.getCheckedRows(AREA.body);
	if (selectedRow == null || selectedRow.length == 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ARRIVAL-000063') /* 国际化处理： 请选择行！*/
		});
		return;
	}
	let rowparam = [];
	selectedRow.map((item) => {
		if (item.data.values.pk_material.value) {
			let data = {
				pk_stockorgs: item.data.values.pk_org.value,
				crowno: item.data.values.crowno.value,
				cunitid: item.data.values.cunitid.value,
				pk_material: item.data.values.pk_srcmaterial.value,
				materialCode: item.data.values.pk_material.display,
				materialName: item.data.values['pk_material.name'].display,
				end_date: item.data.values.dbilldate.value
			};
			rowparam.push(data);
		}
	});
	let stockquerydata = {
		infos: rowparam
		// pagecode: PAGECODE.card
	};
	this.setState({
		showStockQuery: true,
		stockquerydata: stockquerydata
	});
}
