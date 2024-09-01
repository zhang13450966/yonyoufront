/*
 * 存活核算外领域联查处理工具类
 * @Author: guozhq
 * @Date: 2019-04-25 08:39:15
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-12 11:03:06
 */
import { ajax, cacheTools } from 'nc-lightapp-front';

const LINK_KEY = 'pulinkkey';

/**
 * 列表态联查处理
 * @param {*} props
 * @param {*} config {areacode:区域编码,pagecode：页面编码,tabletype：表格类型（table/editTable）,url:后台地址,deflinkquery：自定义处理逻辑}
 */
function listLinkQuery(props, config) {
	let { deflinkquery, areacode, pagecode, tabletype = 'table', url } = config;

	// 1、获取link参数
	let linkkey = props.getUrlParam(LINK_KEY);
	if (linkkey) {
		let linkdata = cacheTools.get(linkkey);
		// linkdata:{linktype:'30',linkids:['','']}
		if (linkdata) {
			let linktype = linkdata.linktype;
			let linkids = linkdata.linkids;
			if (deflinkquery && deflinkquery.hasOwnProperty(linktype)) {
				let deflinkqueryAction = deflinkquery[linktype];
				deflinkqueryAction(linkids);
			} else {
				ajax({
					url: url,
					data: {
						pageid: pagecode, // 采购订单此处使用pageid作为key
						pks: linkids,
					},
					success: res => {
						let data = res.data;
						if (data) {
							if ('table' === tabletype) {
								props.table.setAllTableData(areacode, res.data[areacode]);
							}
							if ('editTable' === tabletype) {
								props.editTable.setTableData(areacode, res.data[areacode]);
							}
						}
					},
				});
			}
			cacheTools.remove(linkkey);
		}
	}
}
export { listLinkQuery };
