/*
 * @Author: 王勇 
 * @PageInfo: 编辑前事件  
 * @Date: 2020-02-09 17:53:19 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-22 10:36:27
 */
import { ROUTEVOINFO, CARDTEMPLATEINFO, VIEWINFO } from '../../const';
// 参照只根据物流组织过滤的字段
const pk_org_filter_Fields = [ ROUTEVOINFO.caddrdocid, ROUTEVOINFO.cvehicleid, ROUTEVOINFO.ccarrierid ];
//props, moduleId(区域id), key(操作的键), value（当前值）
export default function headBeforeEvent(props, moduleId, key, value) {
	/**
     * 根据VehicleGridReferAction后端代码-车辆定义参照未根据物流组织进行过滤
     * 故只需要对承运商根据物流组织进行过滤
     */
	if (pk_org_filter_Fields.includes(key)) {
		let meta = props.meta.getMeta();
		meta[CARDTEMPLATEINFO.headAreaCode].items.forEach((item) => {
			if (key === item.attrcode) {
				item.queryCondition = () => {
					let pk_org = (props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.pk_org) || {})
						.value;
					return { pk_org: pk_org };
				};
			}
		});
		meta[CARDTEMPLATEINFO.bodyAreaCode].items.forEach((item) => {
			if (key === item.attrcode) {
				item.queryCondition = () => {
					let pk_org = (props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.pk_org) || {})
						.value;
					return { pk_org: pk_org };
				};
			}
		});
		props.meta.setMeta(meta);
	}
	if (key == ROUTEVOINFO.pk_org_v) {
		if (props.form.getFormStatus(CARDTEMPLATEINFO.headAreaCode) == VIEWINFO.EDIT_STATUS) return false;
	}
	return true;
}
