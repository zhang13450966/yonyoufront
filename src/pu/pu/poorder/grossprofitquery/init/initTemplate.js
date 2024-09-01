/*
 * @Author: zhaochyu 
 * @PageInfo: 采购订单毛利预估
 * @Date: 2019-04-15 13:13:52 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-04-15 14:02:00
 */
import { GROSSPROFITQUEYR } from '../../constance';
export default function(props) {
	props.createUIDom(
		{
			pagecode: GROSSPROFITQUEYR.PAGECODE
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
