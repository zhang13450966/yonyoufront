/*
 * @Author: liujia9 
 * @PageInfo: 出关 
 * @Date: 2019-01-10 17:03:20 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-05-27 20:00:29
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
					props.button.hideButtonsByAreas([ AREA.card_head, AREA.card_body ]);
					props.button.setButtonDisabled([ BUTTONID.OutCustom, BUTTONID.UnOutCustom ], true);
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
