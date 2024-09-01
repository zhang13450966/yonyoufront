/*
 * @Author: chaiwx 
 * @PageInfo: 查询区编辑后 
 * @Date: 2018-07-21 18:46:07 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-05 13:36:06
 */
import { AREA, FIELDS } from '../../constance';
import { orgMultiSelectHandler } from '../../utils/referUtil';

export default function(field, val) {
	if (field === FIELDS.pk_org) {
		orgMultiSelectHandler(
			this.props,
			AREA.searchId,
			FIELDS.pk_org,
			[
				FIELDS.pk_supplier,
				FIELDS.pk_comparebill_b_pk_material_v,
				FIELDS.pk_comparebill_b_pk_material_v_pk_marbasclass
			],
			[ 'vdef', 'pk_comparebill_b.vbdef' ]
		);
	} else if (field === FIELDS.cpurorgoid) {
		orgMultiSelectHandler(this.props, AREA.searchId, FIELDS.cpurorgoid, [ FIELDS.cemployeeid, FIELDS.pk_dept ]);
	}
}
