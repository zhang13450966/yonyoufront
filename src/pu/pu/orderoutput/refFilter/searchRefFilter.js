/*
 * @Author: jiangfw 
 * @PageInfo: 查询区参照过滤
 * @Date: 2018-07-12 23:29:38 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-03-25 11:07:56
 */
import { AREA, FIELD, BILLTYPE, COMMON } from '../constance/constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../scmpub/scmpub/pub/tool';
let SEARCHID = AREA.list_query;

export default function addSearchRefFilter(props, meta) {
	meta[SEARCHID].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (item.attrcode == FIELD.pk_org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == FIELD.ctrantypeid) {
			//调整类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: BILLTYPE.poorder };
			};
		} else if (item.attrcode == FIELD.pk_dept) {
			item.isShowUnit = true;
			// 采购部门
			item.queryCondition = () => {
				// 部门 -- 根据需求查看集团的所有部门
				return {
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else if (item.attrcode == FIELD.cemployeeid) {
			item.isShowUnit = true;
			// 采购员 --- 根据需求查看集团的所有人员
			item.queryCondition = () => {
				let pk_dept = props.search.getSearchValByField(SEARCHID, FIELD.pk_dept);
				pk_dept =
					pk_dept != null ? (pk_dept.value.firstvalue.includes(',') ? null : pk_dept.value.firstvalue) : null;
				return {
					pk_dept: pk_dept,
					busifuncode: COMMON.PURCHASEORG
				};
			};
		} else {
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(SEARCHID, FIELD.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
}
