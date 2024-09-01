/*
 * @Author: yechd5 
 * @PageInfo: 协同设置编辑前事件处理
 * @Date: 2018-07-24 17:10:57 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-10-12 10:15:08
 */
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { COOPSETUP_CONST } from '../../const';

export default async function(props, moduleId, item, index, value, record) {
	let meta = props.meta.getMeta();
	meta[moduleId].items.map((item) => {
		// 1.过滤财务组织
		if (item.attrcode == 'pk_financeorg_src' || item.attrcode == 'pk_financeorg_dest') {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: 'nccloud.web.scmpub.ref.FinanceOrgTreeRefFilterUtils'
				};
			};
		}

		// 2.过滤“源购销组织”和“目的购销组织”
		if (item.attrcode == 'pk_org_src' || item.attrcode == 'pk_org_dest') {
			if (
				item.refcode == 'uapbd/refer/org/SaleOrgTreeRef/index.js' ||
				item.refcode == 'uapbd/refer/org/SaleOrgTreeRef/index'
			) {
				item.queryCondition = () => {
					return {
						TreeRefActionExt: 'nccloud.web.scmpub.ref.SaleOrgTreeRefFilterUtils'
					};
				};
			} else if (
				item.refcode == 'uapbd/refer/org/PurchaseOrgGridRef/index.js' ||
				item.refcode == 'uapbd/refer/org/PurchaseOrgGridRef/index'
			) {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.scmpub.ref.PurchaseOrgGridRefFilterUtils'
					};
				};
			}
		}
	});

	// 处理表体取值方式(fvaluemodule)、取值内容(vvalueref)、取值内容（vvalue）、
	// 数据类型（datatype）和参照类型（reftype）之间的关系
	// 三、动态改变“取值内容”vvalueref的itemtype，可能是日期组件，可能是档案参照
	meta[moduleId].items.map((item) => {
		if (item.attrcode === 'vvalueref') {
			// 获取"取值方式"的值
			let fvaluemodule =
				props.editTable.getValByKeyAndIndex(moduleId, index, 'fvaluemodule') == undefined
					? null
					: props.editTable.getValByKeyAndIndex(moduleId, index, 'fvaluemodule').value;
			// 取值方式=对应值2——>元数据参照
			if (fvaluemodule == '2') {
				let srcbillType = '21';
				let inputSrcBilltype = props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
				if ('' == inputSrcBilltype || {} == inputSrcBilltype || '21' == inputSrcBilltype) {
					srcbillType = '21';
				} else if ('30' == inputSrcBilltype) {
					srcbillType = '30';
				}
				// 重新赋值前需要清空form或table里的字段的相关属性
				props.renderItem('table', moduleId, 'vvalueref', null);
				item.datatype = '204';
				item.itemtype = 'refer';
				item.refName = getLangByResId(this, '4001COOPSETUP-000011'); /* 国际化处理： 对应值*/
				item.disabled = false;
				item.refcode = 'uap/refer/riart/metaAttributeTableRef/index';
				item.queryCondition = () => {
					return {
						billType: srcbillType
					};
				};
				// 控制元数据属性参照为单选
				item.isMultiSelectedEnabled = false;
				item.pageSize = 1000; // 控制不分页（仅1页）
				item.render = null;
			}
			// 取值方式=系统值3——>select下拉
			if (fvaluemodule == '3') {
				// 重新赋值前需要清空form或table里的字段的相关属性
				props.renderItem('table', moduleId, 'vvalueref', null);
				item.datatype = '203';
				item.itemtype = 'select';
				item.options = [
					{
						display: getLangByResId(this, '4001COOPSETUP-000008') /* 国际化处理： 登录日期*/,
						value: 'logindate'
					},
					{
						display: getLangByResId(this, '4001COOPSETUP-000009') /* 国际化处理： 登录公司*/,
						value: 'logincorp'
					},
					{
						display: getLangByResId(this, '4001COOPSETUP-000010') /* 国际化处理： 登录用户*/,
						value: 'loginuser'
					}
				];
				item.render = null;
			}

			// 1.取值方式=固定值
			if (fvaluemodule == '1') {
				// 2.获取“数据类型”的值
				let datatype =
					props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype') == undefined
						? null
						: props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype').value;
				// 3.获取“参照类型”的值
				let reftype =
					props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype') == undefined
						? null
						: props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype').value;

				// 4.场景如下：
				//   （1）若 数据类型=0/1/2 + 参照类型为空——>文本框
				//   （2）若 数据类型=3 + 参照类型为空——>itemtype = datetimepicker(日期时间)，且编辑完vvalueref取年月日时分秒，vvalue的值取年月日
				//   （3）若 数据类型=4 + 参照类型为空——>取值内容vvalueref不允许编辑
				//   （4）若 数据类型=5 + 参照类型为空——>取值内容vvalueref不允许编辑
				//   （5）若 数据类型=5 + 参照类型有值——>itemtype = refer（参照），且编辑完vvalueref取参照名称，vvalue取参照的主键
				if (
					(datatype == '-1' || datatype == '0' || datatype == '1' || datatype == '2') &&
					(reftype == null || reftype == '' || reftype == {})
				) {
					// 重新赋值前需要清空form或table里的字段的相关属性
					props.renderItem('table', moduleId, 'vvalueref', null);
					item.datatype = '1';
					item.itemtype = 'input';
					item.disabled = false;
					item.render = null;
				}

				if (datatype == '3' && (reftype == null || reftype == '' || reftype == {})) {
					// 重新赋值前需要清空form或table里的字段的相关属性
					props.renderItem('table', moduleId, 'vvalueref', null);
					item.datatype = '34';
					item.disabled = false;
					item.itemtype = 'datetimepicker';
					item.render = null;
				}
				// if ((datatype == '4' || datatype == '5') && (reftype == null || reftype == '' || reftype == {})) {
				// 	// 重新赋值前需要清空form或table里的字段的相关属性
				// 	props.renderItem('table', moduleId, 'vvalueref', null);
				// 	item.disabled = true;
				// 	item.render = null;
				// }
				if (datatype == '5' && (reftype != null && reftype != '' && reftype != {})) {
					// 根据参照名称取参照的refcode（查bd_refinfo）
					// 查refcode中refpath的值，
					let req = {
						refname: reftype
					};
					// 对部分参照添加参照过滤（人员和部门支持业务人员来源），2018-10-08
					// 源单据类型
					let srcbilltype =
						props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src') == undefined
							? null
							: props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
					// 目的购销组织
					let orgDest =
						props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'pk_org_dest') == undefined
							? null
							: props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'pk_org_dest').value;
					// 当前编辑的字段（目标协同项）
					let targetfield =
						props.editTable.getValByKeyAndIndex(moduleId, index, 'ctargetfieldnameid') == undefined
							? null
							: props.editTable.getValByKeyAndIndex(moduleId, index, 'ctargetfieldnameid').value;
					let busicode = null;
					if (moduleId == COOPSETUP_CONST.CARD_TABLEID1) {
						if (srcbilltype == '21' && orgDest != null) {
							busicode = 'sa'; // 销售场景
						} else if (srcbilltype == '30' && orgDest != null) {
							busicode = 'pu'; // 销售场景
						}
					} else if (moduleId == COOPSETUP_CONST.CARD_TABLEID2) {
						if ((srcbilltype == '21' || srcbilltype == '30') && orgDest != null) {
							busicode = 'st'; // 库存场景
						}
					} else if (moduleId == COOPSETUP_CONST.CARD_TABLEID3) {
						if (srcbilltype == '30' && orgDest != null) {
							busicode = 'pu'; // 销售场景
						}
					}

					ajax({
						url: COOPSETUP_CONST.VVALUEEDITURL,
						data: req,
						async: false,
						success: (res) => {
							if (res.data) {
								// 重新赋值前需要清空form或table里的字段的相关属性
								props.renderItem('table', moduleId, 'vvalueref', null);
								item.itemtype = 'refer';
								item.refName = reftype;
								item.datatype = '204';
								item.disabled = false;
								item.refcode = res.data;
								item.render = null;
								//props.meta.setMeta(meta)
								// (1)部门和业务员支持业务员来源
								if (
									targetfield == 'cdeptvid' ||
									targetfield == 'cdeptid' ||
									targetfield == 'cdptid' ||
									targetfield == 'pk_dept' ||
									targetfield == 'pk_dept_v' ||
									targetfield == 'cemployeeid'
								) {
									if (busicode != null && orgDest != null) {
										item.queryCondition = () => {
											return {
												pk_org: orgDest,
												busifuncode: busicode
											};
										};
									}
								}
								// (2)出入库协同页签-仓库支持切换业务单元
								if (
									(targetfield == 'cwarehouseid' ||
										targetfield == 'cbodywarehouseid' ||
										targetfield == 'pk_creqwareid' ||
										targetfield == 'cdptid') &&
									moduleId == COOPSETUP_CONST.CARD_TABLEID2
								) {
									item.isShowUnit = true;
								}
								// (3)购销协同页签-仓库支持切换业务单元
								if (
									(targetfield == 'csendstordocid' ||
										targetfield == 'pk_revstordoc' ||
										targetfield == 'pk_reqstordoc' ||
										targetfield == 'pk_recvstordoc') &&
									moduleId == COOPSETUP_CONST.CARD_TABLEID1
								) {
									item.isShowUnit = true;
								}
							}
						}
					});
				}
			}
		}
	});
	props.meta.setMeta(meta);
	return true;
}
