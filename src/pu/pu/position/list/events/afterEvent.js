/*
 * @Author: wangceb
 * @PageInfo: 编辑后事件
 * @Date: 2018-05-21 21:56:34
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-08 16:26:25
 */

import { ajax } from 'nc-lightapp-front';
import { POSITION_CONST, URL } from '../../const';
import { createBodyAfterEventData, processBillCardBodyEditResult } from 'scmpub/scmpub/components/VerticalEditTable';

export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	if (key === 'pk_srcmaterial' || key === 'pk_marpuclass' || key === 'pk_marbasclass') {
		bodyAfterHandler.call(this, props, moduleId, key, value, changedrows, i);
	}
}

function bodyAfterHandler(props, moduleId, key, value, changedrows, index) {
	let usermap = new Map();
	if (value != undefined && value) {
		// 编辑物料需要给 material_code 赋值(取参照的编码)
		for (let i = 0; i < value.length; i++) {
			usermap.set(value[i].refpk, value[i].refcode);
		}
	}

	let event = createBodyAfterEventData.call(
		this,
		POSITION_CONST.PAGECODE,
		POSITION_CONST.UPTABLEID,
		POSITION_CONST.DOWNTABLEID,
		key,
		changedrows,
		index,
		usermap
	);

	ajax({
		url: URL.BODYAFTER,
		data: event,
		success: (res) => {
			processBillCardBodyEditResult.call(
				this,
				// props,
				// POSITION_CONST.UPTABLEID,
				POSITION_CONST.DOWNTABLEID,
				res.data,
				index
			);
		}
	});
}
