/*
 * @Author: jiangfw 
 * @PageInfo: 输出模板初始化
 * @Date: 2019-03-13 15:59:47 
 * @Last Modified by: zhanghrh
 * @Last Modified time: 2019-08-09 11:30:01
 */
import buttonControl from '../viewController/buttonController';
import { PAGECODE, APPCODE } from '../../constance/constance';
import addSearchRefFilter from '../../refFilter/searchRefFilter';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.list
			// appcode: APPCODE.appcode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					//props.meta.setMeta(meta, buttonControl.call(this));
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}
function modifierMeta(props, meta) {
	addSearchRefFilter.call(this, props, meta);
	return meta;
}
