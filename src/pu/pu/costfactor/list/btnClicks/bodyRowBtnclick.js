/*
 * @Author: zhaochyu 
 * @PageInfo: 表体删行校验
 * @Date: 2018-08-16 19:55:59 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 11:04:46
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { getUpdata } from '../../utils';
export default function(props, index) {
	let bodyUpdata = getUpdata(props, false);
	let pk_org = null;
	let pk_group = null;
	let pk_srcmaterial = bodyUpdata.body.list_body.rows[index].values.pk_srcmaterial.value;
	let bodypk_costfactor = bodyUpdata.body.list_body.rows[0].values.pk_costfactor.value;
	let headUpdata = props.editTable.getAllData(PAGECODE.headId);
	let head_length = props.editTable.getNumberOfRows(PAGECODE.headId);
	for (let i = 0; i < head_length; i++) {
		let headpk_costfactor = headUpdata.rows[i].values.pk_costfactor.value;
		if (headpk_costfactor == bodypk_costfactor) {
			pk_org = headUpdata.rows[i].values.pk_org.value;
			pk_group = headUpdata.rows[i].values.pk_group.value;
		}
	}
	let pushdata = {
		pk_org: pk_org,
		pk_group: pk_group,
		pk_srcmaterial: pk_srcmaterial
	};
	if (pk_srcmaterial == '' || pk_srcmaterial == null) {
		props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, index);
		return;
	}
	ajax({
		url: URL.rowdelete,
		data: pushdata,
		success: (res) => {
			if (res && res.success) {
				props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, index);
			}
		}
	});
}
