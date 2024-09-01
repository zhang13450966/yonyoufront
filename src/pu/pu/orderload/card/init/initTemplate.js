/*
 * @Author: CongKe 
 * @PageInfo: 装运卡片初始化
 * @Date: 2019-04-17 09:37:24 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-05-28 08:50:56
 */
import { PAGECODE, AREA, BUTTONID, FIELDS, STATUS, DATASOURCECACHE } from '../../constance';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import buttonController from '../viewControl/buttonController';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.CARDPAGECODE
		},
		(data) => {
			if (data && data.template) {
				let templedata = data.template;
				let templetid = templedata.template && templedata.template.pageid;
				setDefData(DATASOURCECACHE.dataSourceCardCacheKey, PAGECODE.TEMPLATEID, templetid);
				let meta = data.template;
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta, buttonController.togglePageShow.call(this, this.props));
			}
			if (data && data.button) {
				let button = data.button;
				// props.button.hideButtonsByAreas([ AREA.card_head ]); // 隐藏所有按钮
				props.button.setButtons(button);
			}
		}
	);

	function modifierMeta(props, meta) {
		let status = props.getUrlParam(STATUS.status);
		meta[AREA.cardFormId].status = status;
		meta[AREA.cardTableId].status = status;
		columnSortUtils.numberSort(meta, AREA.card_body, 'crowno');
		return meta;
	}
}
