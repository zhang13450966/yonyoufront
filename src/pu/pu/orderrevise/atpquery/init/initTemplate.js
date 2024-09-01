/*
 * 模板初始化
 * @Author: guozhq 
 * @Date: 2018-06-07 12:45:19 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-08-29 16:46:54
 */
import { STOCKQUERY } from '../../constance';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			appcode: '400400800',
			pagecode: STOCKQUERY.PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
			}
		}
	);
}
