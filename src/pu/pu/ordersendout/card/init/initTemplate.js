/*
 * @Author: xiahui 
 * @PageInfo: 采购合同维护卡片态模板 
 * @Date: 2019-01-10 17:03:20 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-04-17 11:10:53
 */
import { PAGECODE, AREA, BUTTONID } from '../../constance';
import { pageInfoClick } from '../btnClicks';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.cardPagecode
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					// props.button.hideButtonsByAreas([ AREA.card_head ]); // 隐藏所有按钮
					props.button.setButtonDisabled([ BUTTONID.SendOut, BUTTONID.UnSendout ], true);
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						pageInfoClick.call(this, this.props, this.props.getUrlParam('id'));
					});
				}
			}
		}
	);
}

//渲染页面
function modifierMeta(props, meta) {
	meta[AREA.cardFormId].status = 'edit';
	meta[AREA.cardTableId].status = 'edit';

	return meta;
}
