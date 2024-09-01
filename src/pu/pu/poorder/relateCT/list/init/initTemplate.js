/*
 * @Author: wangceb
 * @PageInfo: 单据模板js
 * @Date: 2018-04-12 10:55:42
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-09-12 15:30:34
 */
import { ajax } from 'nc-lightapp-front';

export default function() {
	let props = this.props;
	//请求模板数据
	ajax({
		url: '/nccloud/platform/templet/querypage.do',
		data: {
			appcode: '400400800',
			pagecode: '400400800_ct',
		},
		success: function(res) {
			let meta = res.data;
			meta['pk_ct_pu'].items.map(item => {
				// item.width = 120;
			});
			props.meta.setMeta(meta);
		},
	});
}
