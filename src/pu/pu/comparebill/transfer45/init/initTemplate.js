/*
 * @Author: qishy 
 * @PageInfo:业务对账单拉采购入库模板
 * @Date: 2019-05-05 13:12:47 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-08-21 15:18:22
 */
import { PAGECODE, AREA, BUTTONID, FIELDS, MAIN_ORG_FIELD } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { transferSkipToSrcBillUtil } from '../../../../../scmpub/scmpub/pub/tool/transferSkipToSrcBillUtil';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.transferPagecode45,
			appcode: PAGECODE.appcode45
		},
		function(data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	let filterByOrgItems = [
		'ccustomerid', //收货客户
		'cgeneralbid.cvendorid', //供应商
		'cgeneralbid.cmaterialoid', //物料
		'cgeneralbid.cmaterialoid.pk_marbasclass' //物料基本分类
	];
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		FIELDS.billmaker //制单人
		// FIELDS.approver //审批人
	];
	//转单单据号添加超链接
	meta[AREA.listTableId].items.map((item) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45',
			billcodefield: 'vbillcode',
			pkfield: 'cgeneralhid'
		});
	});
	//主子拉平页面单据号添加超链接
	meta[AREA.srcView].items.map((item) => {
		transferSkipToSrcBillUtil.call(this, props, item, {
			billtype: '45',
			billcodefield: 'vbillcode',
			pkfield: 'cgeneralhid'
		});
	});
	meta[AREA.searchId].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (filterByOrgItems.includes(item.attrcode)) {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data, DataPowerOperationCode: 'SCMDefault' };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == MAIN_ORG_FIELD.search45Org) {
			//主组织权限过滤
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == 'cpurorgoid') {
			// 采购组织
		} else if (item.attrcode == FIELDS.pk_org) {
			// 库存组织
		} else if (item.attrcode == FIELDS.ctrantypeid) {
			//交易类型
			item.queryCondition = () => {
				return { istransaction: 'Y', parentbilltype: '45' };
			};
		} else {
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchId, MAIN_ORG_FIELD.search45Org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
}
