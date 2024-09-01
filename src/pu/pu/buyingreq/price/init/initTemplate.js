/*
 * @Author: zhangchqf 
 * @PageInfo: 请购单价格论证表-模板加载 
 * @Date: 2019-04-15 17:00:14 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-04-18 18:28:11
 */

import { BUYINGREQ_CARD } from '../../siconst';
export default function(props) {
	props.createUIDom(
		{
			pagecode: BUYINGREQ_CARD.pricePage
		},
		(data) => {
			if (data) {
				
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
					this.setState({
						templetid: meta.pageid
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}
