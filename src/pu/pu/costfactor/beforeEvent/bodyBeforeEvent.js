/*
 * @Author: zhaochyu 
 * @PageInfo: 表体编辑前事件
 * @Date: 2018-07-11 13:51:49 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-04-08 09:57:08
 */
import { ajax } from 'nc-lightapp-front';
import { FIELD, URL, PAGECODE, UISTATE } from '../constance';
import { getUpdata } from '../utils';
export default function bodybeforeEvent(props, moduleId, item, index, value, record) {
	let field = [ FIELD.pk_srcmaterial, FIELD.ts, FIELD.pk_costfactor_b, FIELD.pk_materialName ];
	if (field.includes(item.attrcode)) {
		return false;
	}
	let flag = this.state.statusflag;
	if (flag != UISTATE.add) {
		if (FIELD.pk_material == item.attrcode) {
			let data = getUpdata(props, false);
			let pk_org = data.head.list_head.rows[0].values.pk_org.value;
			let pk_group = data.head.list_head.rows[0].values.pk_group.value;
			let pk_srcmaterial = data.body.list_body.rows[index].values.pk_srcmaterial.value;
			let pushdata = {
				pk_org: pk_org,
				pk_group: pk_group,
				pk_srcmaterial: pk_srcmaterial
			};
			if (pk_srcmaterial == '' || pk_srcmaterial == null) {
				return true;
			}
			ajax({
				url: URL.rowdelete,
				data: pushdata,
				success: (res) => {
					if (res && !res.success) {
						return false;
					}
				},
				error: (err) => {
					props.editTable.setEditableRowKeyByIndex(PAGECODE.bodyId, index, FIELD.pk_material, false);
				}
			});
		}
	}
	//新增时，根据主组织是否有值来控制表体的编辑性，并清空表体值
	let statusflag = this.state.statusflag;
	if (statusflag == UISTATE.add) {
		let pk_index = this.state.editflag;
		let add_pk_org = props.editTable.getValByKeyAndIndex(PAGECODE.headId, pk_index, FIELD.pk_org_v);
		if (add_pk_org.value == null || add_pk_org.value == '') {
			// let bodyrows = props.editTable.getNumberOfRows(PAGECODE.bodyId);
			// for (let i = 0; i < bodyrows; i++) {
			//   props.editTable.setEditableRowByIndex(PAGECODE.bodyId, i, false);
			// }
			return false;
		}
	}
	return true;
}
