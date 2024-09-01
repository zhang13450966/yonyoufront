/*
 * @Author: zhaochyu 
 * @PageInfo: 销量查询
 * @Date: 2019-04-09 14:08:51 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-04-09 15:58:03
 */
import { SALESQUERY } from '../../constance';
export default function(props) {
	props.createUIDom(
		{
			appcode: '400400800',
			pagecode: SALESQUERY.PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
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
