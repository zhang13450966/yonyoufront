/*
 * @Author: zhaochyu 
 * @PageInfo: 通过列表主键查询表体 
 * @Date: 2018-05-31 14:05:10 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:15:51
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
export default function simpleClick(props, moduled, record, index) {
	this.setState({
		clickNum: index,
		flag: '1'
	});
	let focusnum = this.state.editflag;
	if (this.state.status !== 'browse' && focusnum != null) {
		this.props.editTable.focusRowByIndex(PAGECODE.headId, focusnum);
		return;
	}
	let pk = record.values.pk_costfactor.value;
	ajax({
		url: URL.listBodyQuery,
		data: { pk: pk, pagecode: PAGECODE.listpagecode },
		success: (res) => {
			let { success, data } = res;
			if (data == undefined) {
				this.props.editTable.setTableData(PAGECODE.bodyId, { rows: [] });
			} else {
				this.props.editTable.setTableData(PAGECODE.bodyId, data.list_body);
			}
		}
	});
}
