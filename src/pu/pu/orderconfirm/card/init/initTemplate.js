/*
 * @PageInfo: 页面初始化
 * @Author: nieqianc 
 * @Date: 2019-04-7 13:13:16 
 */
import { PAGECODE, AREA, BUTTON_ID, BUTTON_AREA } from '../../constance';
import initData from './initData';

export default function initTemplate(props) {
	//页面初始化
	props.createUIDom(
		{
			pagecode: PAGECODE.CARD
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					// 记录模板ID
					this.templetid = meta.pageid;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						initData.call(this);
					});
				}
			}
		}
	);
}

//渲染页面
function modifierMeta(props, meta) {
	meta[AREA.CARD_FORM].status = 'edit';
	meta[AREA.CARD_TABLE].status = 'edit';

	return meta;
}
