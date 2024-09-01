/*
 * @Author: 王勇 
 * @PageInfo: 参照过滤  
 * @Date: 2020-02-09 17:16:19 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-21 14:41:03
 */
import { ROUTEVOINFO, QUERYAREAINFO } from '../../const/index';
import { setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
// 参照只根据物流组织过滤的字段
const pk_org_filter_Fields = [ ROUTEVOINFO.cvehicleid, ROUTEVOINFO.ccarrierid ];

export default function referEvent(props, meta) {
	// 查询区参照过滤
	queryReferEvent(props, meta);
}
// 查询区参照过滤
function queryReferEvent(props, meta) {
	meta[QUERYAREAINFO.areaCode].items.map((item) => {
		setRefShowDisabledData(item);
		if (item.attrcode == ROUTEVOINFO.pk_org) {
			item.isMultiSelectedEnabled = true;
			item.isHasDisabledData = false;
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder' };
			};
		} else if (pk_org_filter_Fields.includes(item.attrcode)) {
			item.isMultiSelectedEnabled = true;
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = props.search.getSearchValByField(QUERYAREAINFO.areaCode, ROUTEVOINFO.pk_org);
				return {
					pk_org:
						pk_org && pk_org.value
							? pk_org.value.firstvalue.includes(',') ? null : pk_org.value.firstvalue
							: null
				};
			};
		} else {
			item.isHasDisabledData = false;
		}
	});

	return meta;
}
