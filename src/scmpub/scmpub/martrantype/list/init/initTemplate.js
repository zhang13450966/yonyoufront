/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型设置模板JS
 * @Date: 2018-05-10 09:42:56 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-30 13:39:00
 */
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import MaterialGridRef from '../../../../../uapbd/refer/pub/MaterialGridRef/index.js';
import MaterialPuClassTreeRef from '../../../../../uapbd/refer/material/MaterialPuClassTreeRef/index.js';
import MaterialBasClassTreeRef from '../../../../../uapbd/refer/material/MaterialBasClassTreeRef/index.js';
import TransTypeGridRef from '../../../../../uap/refer/riart/transtype/index.js';
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import { MARTRANTYPE_CONST, ROWBTN } from '../const';
import rowButtonClick from './rowButtonClick';
import buttonController from '../../list/viewController/buttonController';

export default function(props) {
	props.createUIDom(
		{
			pagecode: MARTRANTYPE_CONST.PAGEID
		},
		callbackFun.bind(this)
	);
	function callbackFun(data) {
		if (data) {
			// 取个性化中心的默认组织
			let { pk_org, org_Name } = data.context;
			if (pk_org) {
				let event = {
					refname: org_Name,
					refpk: pk_org
				};
				this.handleChange(event);
			}

			// 模板
			if (data.template) {
				let meta = data.template;
				// 根据业务参数PO85去显示“物料基本分类”还是“物料采购分类”
				getBusiParam(props);
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			// 按钮
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button, () => {
					props.button.setPopContent(
						'Delete',
						getLangByResId(this, '4001MARTRANTYPE-000004')
					); /* 国际化处理： 确认要删除吗？*/
					buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE);
				});
			}
		}
	}
}

// 读取集团级业务参数 PO85 并隐藏字段
function getBusiParam(props) {
	let businessInfo = getBusinessInfo();
	setTimeout(() => {
		let params = {};
		params.pk_org = businessInfo.groupId;
		params.initCodes = [ 'PO85' ];
		ajax({
			// 批量查询业务参数设置
			url: '/nccloud/baseapp/param/paBatchQry.do',
			data: params,
			success: (res) => {
				if (res.data.PO85 && res.data.PO85 === 'pu_marclass') {
					// 隐藏“物料基本分类”
					props.editTable.hideColByKey(MARTRANTYPE_CONST.TABLEID, [
						'pk_marbasclass',
						'pk_marbasclass.name'
					]);
				} else {
					// 隐藏“物料采购分类”
					props.editTable.hideColByKey(MARTRANTYPE_CONST.TABLEID, [ 'pk_marpuclass', 'pk_marpuclass.name' ]);
				}
			}
		});
	}, 0);
}

function modifierMeta(props, meta) {
	// 添加表格操作列
	let event = {
		label: getLangByResId(this, '4001MARTRANTYPE-000017') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		render: (text, record, index) => {
			// 创建操作列按钮
			return props.button.createOprationButton(ROWBTN, {
				onButtonClick: (props, key) => {
					rowButtonClick.bind(this, props, key, record, index)();
				},
				area: MARTRANTYPE_CONST.LIST_INNER,
				buttonLimit: 3
			});
		}
	};

	meta[MARTRANTYPE_CONST.TABLEID].items.push(event);

	// 订单交易类型的参照过滤
	meta[MARTRANTYPE_CONST.TABLEID].items.map((item) => {
		// 控制字段编辑性
		if (
			item.attrcode == 'pk_group' ||
			item.attrcode == 'ts' ||
			item.attrcode == 'pk_martrantype' ||
			item.attrcode == 'vtrantypecode' ||
			item.attrcode == 'pk_material' ||
			item.attrcode == 'pk_marbasclass.name' ||
			item.attrcode == 'pk_marpuclass.name' ||
			item.attrcode == 'pk_srcmaterial.name' ||
			item.attrcode == 'pk_material' ||
			item.attrcode == 'pk_org'
		) {
			item.disabled = true;
		}
		// NCC-33721 label类型显示态使用的是value值，该属性进行同步
		if (item.itemtype == 'label') {
			item.whichKeyToDisplay = 'display';
		}
		// 过滤交易类型
		if (item.attrcode == 'ctrantypeid') {
			item.render = function(text, record, index) {
				return TransTypeGridRef({
					queryCondition: () => {
						return {
							parentbilltype: '21',
							istransaction: 'Y'
						};
					}
				});
			};
		}
		// 根据采购组织过滤物料基本分类
		if (item.attrcode == 'pk_marbasclass') {
			item.render = function(text, record, index) {
				return MaterialBasClassTreeRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value
						};
					}
				});
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
		}

		// 根据采购组织过滤物料采购分类
		if (item.attrcode == 'pk_marpuclass') {
			item.render = function(text, record, index) {
				return MaterialPuClassTreeRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value
						};
					}
				});
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
		}

		// 根据采购组织过滤物料
		if (item.attrcode == 'pk_srcmaterial') {
			item.render = function(text, record, index) {
				return MaterialGridRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value
						};
					}
				});
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
		}
	});
	props.meta.setMeta(meta);
	return meta;
}
