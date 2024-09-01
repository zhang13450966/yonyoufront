/*
 * @Author: CongKe 
 * @PageInfo: 订单运输状态公共表头编辑前
 * @Date: 2019-04-17 11:14:09 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-04-18 15:08:34
 */
export default async function(props, moduleId, key, value) {
	let meta = this.props.meta.getMeta();
	meta[moduleId].items.map((item) => {
		if (item.attrcode != 'pk_org_v' && item.attrcode != 'pk_org') {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(moduleId, 'pk_org').value;
				return { pk_org: data }; // 根据pk_org过滤
			};
			if (item.attrcode == 'pk_org_v') {
				item.queryCondition = () => {
					return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
				};
			}
		}
	});
	if (key.startsWith('vdef')) {
		// 自定义项1——40
		return true;
	} else {
		// 其他均不可编辑
		return false;
	}
}
