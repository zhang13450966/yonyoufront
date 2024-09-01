/*
 * @Author: ligangt 
 * @PageInfo: 到货单元数据加载  
 * @Date: 2018-04-17 15:47:30 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-23 10:41:50
 */
import { PAGECODE, AREA } from '../../constance';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.list //页面id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				// let disabled = {};
				// ALLBUTTON.map((v) => {
				// 	disabled[v] = true;
				// });

				// props.button.setDisabled(disabled);
			}
		}
	);
}

/**
 * 自定义元数据样式
 * @param {*} props 
 * @param {*} meta 
 */
function modifierMeta(props, meta) {
	// 根据组织过滤不带业务单元字段
	let filterByOrgItems_o = [
		'billmaker', //制单人
		'approver', //审批人
		'pk_arriveorder_b.creporterid', //报告人
		'pk_transporttype' //运输方式
	];

	meta['searchArea'].items.map((item) => {
		/** begain人员参照显示离职人员和显示停用*/
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		/** end人员参照显示离职人员和显示停用*/
		if (item.attrcode == 'pk_org') {
			//主组织权限过滤
			// item.queryCondition = () => {
			// 	return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			// };
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (filterByOrgItems_o.includes(item.attrcode)) {
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'ctrantypeid') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					parentbilltype: '23',
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSIORG: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_receivestore') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_supplier') {
			//供应商
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_material.materialstock.pk_marpuclass.code') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_material.code') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_material.name') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_srcmaterial') {
			//物料
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_srcmaterial.pk_marbasclass') {
			//物料基本分类
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_arriveorder_b.pk_srcmaterial.name') {
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.cprojectid') {
			// 项目
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.searchArea, 'pk_org') || {}).value; // 调用相应组件的取值API)
				return {
					pk_org: pk_org.firstvalue
				};
			};
		} else if (item.attrcode == 'pk_arriveorder_b.casscustid') {
			//客户
			item.isShowUnit = true;
			// 根据pk_org过滤
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		} else if (item.attrcode == 'pk_dept') {
			//采购部门 add by lichaoah
			item.isShowUnit = true;
			item.queryCondition = () => {
				return { busifuncode: 'pu' };
			};
		} else if (item.attrcode == 'pk_pupsndoc') {
			//采购业务员 add by lichaoah
			item.isShowUnit = true;
			item.queryCondition = () => {
				return { busifuncode: 'pu' };
			};
		} else {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(AREA.searchArea, 'pk_org');
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});
	let listTable = meta.head;
	listTable.showcheck = true;
	listTable.showindex = true;

	//模板table的订单编号列加超链接
	meta[AREA.list] &&
		meta[AREA.list].items.map((item, index) => {
			transferSkipToPayPlanUtil.call(this, props, item, {
				billtype: '23',
				billcodefield: 'vbillcode',
				pkfield: 'pk_arriveorder'
			});
		});

	return meta;
}

function transferSkipToPayPlanUtil(props, item, config, isAllPage = false) {
	const { billtype, billcodefield = 'vbillcode', pkfield } = config;
	if (item.attrcode == billcodefield) {
		item.width = 150;
		item.renderStatus = 'browse';
		item.render = (text, record, index) => {
			return (
				<a
					style={{ cursor: 'pointer' }}
					onClick={(e) => {
						if (billtype && record.values[pkfield]) {
							props.openTo(null, {
								billtype: billtype,
								sence: 4,
								status: 'browse',
								id: record.values[pkfield].value
							});
						}
					}}
				>
					{!record.values[billcodefield] ? '' : record.values[billcodefield].display}
				</a>
			);
		};
		return item;
	}
}
