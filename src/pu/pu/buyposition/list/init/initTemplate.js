/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置模板JS
 * @Date: 2018-05-10 09:55:58 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 09:51:25
 */
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import MaterialGridRef from '../../../../../uapbd/refer/pub/MaterialGridRef/index.js';
import MaterialPuClassTreeRef from '../../../../../uapbd/refer/material/MaterialPuClassTreeRef/index.js';
import MaterialBasClassTreeRef from '../../../../../uapbd/refer/material/MaterialBasClassTreeRef/index.js';
import PsndocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsndocTreeGridRef/index.js';
import rowButtonClick from './rowButtonClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST,ROWBTN } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function(props) {
	props.createUIDom(
		{
			pagecode: BUYPOSITION_CONST.PAGEID 
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
						getLangByResId(this, '4004BUYPOSITION-000006')
					); /* 国际化处理： 确认要删除吗？*/
					buttonController.call(this, props, this.state.pk_org.value, BUYPOSITION_CONST.BROWSE)
				});
			}
		}
	}
}

// 读取集团级业务参数 PO85 并隐藏字段
function getBusiParam(props) {
	// 获取业务参数信息
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
					props.editTable.hideColByKey(BUYPOSITION_CONST.TABLEID, [ 'pk_marbasclass', 'pk_marbasclass.name', 'marbasclass_code' ]);
				} else {
					// 隐藏“物料采购分类”
					props.editTable.hideColByKey(BUYPOSITION_CONST.TABLEID, [ 'pk_marpuclass', 'pk_marpuclass.name', 'marpuclass_code' ]);
				}
			}
		});
	}, 0);
}

function modifierMeta(props, meta) {
	let _this = this;
	// 添加表格操作列
	let event = {
		label: getLangByResId(this, '4004BUYPOSITION-000021') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 130,
		render(text, record, index) {
			// 创建操作列按钮
			return props.button.createOprationButton(ROWBTN, {
				onButtonClick: (props, key) => {
					rowButtonClick.bind(_this, props, key, record, index)();
				},
				area: BUYPOSITION_CONST.LIST_INNER,
				buttonLimit: 3
			});
		}
	};

	meta[BUYPOSITION_CONST.TABLEID].items.push(event);

	meta[BUYPOSITION_CONST.TABLEID].items.map((item) => {
		// 控制字段编辑性
		if (
			item.attrcode == 'pk_position' ||
			item.attrcode == 'pk_group' ||
			item.attrcode == 'pk_org' ||
			item.attrcode == 'fpositiontype' ||
			item.attrcode == 'ts' ||
			item.attrcode == 'pk_position_b' ||
			item.attrcode == 'pk_marbasclass.name' ||
			item.attrcode == 'marbasclass_code' ||
			item.attrcode == 'pk_marpuclass.name' ||
			item.attrcode == 'marpuclass_code' ||
			item.attrcode == 'pk_material' ||
			item.attrcode == 'pk_srcmaterial.name' ||
			item.attrcode == 'material_code'
		) {
			item.disabled = true;
		}

		// 根据采购组织过滤人员
		if (item.attrcode == 'cemployeeid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value,
							// 支持业务人员来源
							busifuncode: 'pu'
						};
					}
				});
			};
			// “显示停用”不可见
			item.isShowDisabledData = false;
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
			// 支持多选
			item.isMultiSelectedEnabled = true;
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
			// 支持多选
			item.isMultiSelectedEnabled = true;
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
			// 支持多选
			item.isMultiSelectedEnabled = true;
		}
	});
	props.meta.setMeta(meta);
	return meta;
}
