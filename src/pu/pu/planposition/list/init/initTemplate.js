/*
 * @Author: yechd5 
 * @PageInfo: 计划岗物料设置模板JS
 * @Date: 2018-05-10 09:55:58 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 09:59:18
 */
import MaterialGridRef from '../../../../../uapbd/refer/pub/MaterialGridRef/index.js';
import MaterialPuClassTreeRef from '../../../../../uapbd/refer/material/MaterialPuClassTreeRef/index.js';
import MaterialBasClassTreeRef from '../../../../../uapbd/refer/material/MaterialBasClassTreeRef/index.js';
import PsndocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsndocTreeGridRef/index.js';
import rowButtonClick from './rowButtonClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST, ROWBTN } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function(props) {
	props.createUIDom(
		{
			pagecode: PLANPOSITION_CONST.PAGEID // 页面编码
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
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button, () => {
					props.button.setPopContent(
						'Delete',
						getLangByResId(this, '4004PLANPOSITION-000006')
					); /* 国际化处理： 确认要删除吗？*/
					buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.BROWSE)
				});
			}
		}
	}
}

function modifierMeta(props, meta) {
	let _this = this;
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4004PLANPOSITION-000023') /* 国际化处理： 操作*/,
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
				area: PLANPOSITION_CONST.LIST_INNER,
				buttonLimit: 3
			});
		}
	};

	meta[PLANPOSITION_CONST.TABLEID].items.push(event);

	meta[PLANPOSITION_CONST.TABLEID].items.map((item) => {
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
			item.attrcode == 'pk_marpuclass' ||
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
							busifuncode: 'st'
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
