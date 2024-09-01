/*
 * @Author: 王勇 
 * @PageInfo: 页面功能描述  
 * @Date: 2020-03-25 12:51:41 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:38:40
 */
import { CARDTEMPLATEINFO, ROUTEVOINFO } from '../../const/index';
export default function enableInit(props) {
	let meta = props.meta.getMeta();
	modifierMeta.call(this, props, meta);
}

function modifierMeta(props, meta) {
	meta[CARDTEMPLATEINFO.headAreaCode].items.map((item, index) => {
		if (item.attrcode == ROUTEVOINFO.bsealflag) {
			item.itemtype = 'customer';
			item.render = (text, record, index) => {
				//编辑态置灰
				return (
					<div
						onClick={(e) => {
							//阻止冒泡。要不然行就被勾选上了
							if (e && e.stopPropagation) {
								//非IE
								e.stopPropagation();
							} else {
								//IE
								window.event.cancelBubble = true;
							}
						}}
					/>
				);
			};
		}
	});
	return meta;
}
