/*
 * @Author: 王龙华 
 * @PageInfo: 编辑后事件 
 * @Date: 2018-05-21 21:56:34 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-08-25 00:52:46
 */

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	if (key === 'pk_marbasclass') {
		if (value.refcode) {
			props.editTable.setValByKeyAndIndex(moduleId, i, 'pk_marbasclass.code', {
				value: value.refcode,
				display: value.refcode
			});
			props.editTable.setValByKeyAndIndex(moduleId, i, 'pk_marbasclass', {
				value: value.refpk,
				display: value.refcode
			});
			props.editTable.setValByKeyAndIndex(moduleId, i, 'pk_marbasclass.name', {
				value: value.refname,
				display: value.refname
			});
			// 给 vmarcode 赋值
			props.editTable.setValByKeyAndIndex(moduleId, i, 'vmarcode', {
				value: value.refcode,
				display: value.refcode
			});
		} else {
			clearValue(this.props, moduleId, i, [ 'pk_marbasclass.name', 'vmarcode' ]);
		}
	}
}
function clearValue(props, moduleId, i, fields) {
	for (let field of fields) {
		props.editTable.setValByKeyAndIndex(moduleId, i, field, { value: null, display: null });
	}
}
