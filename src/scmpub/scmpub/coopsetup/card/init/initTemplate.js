/*
 * @Author: yechd5 
 * @PageInfo: 协同设置卡片模板
 * @Date: 2018-06-06 22:02:34 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-11-05 09:43:20
 */
// 引入取值内容参照
import { base } from 'nc-lightapp-front';
import metaAttributeTableRef from '../../../../../uap/refer/riart/metaAttributeTableRef/index.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { COOPSETUP_CONST } from '../../const';
import buttonController from '../viewController/buttonController';
const { NCFormControl } = base;
const { NCSelect } = base;
const NCOption = NCSelect.NCOption;

// 取值方式为系统值时，取值内容选择范围为：登录日期 | 登录公司 | 登录用户
function Select({ onBlur, onChange }) {
	return (
		<NCSelect autoFocus={true} onBlur={onBlur} onChange={onChange} style={{ width: 200, marginRight: 6 }}>
			<NCOption key="1" value="logindate">
				{getLangByResId(this, '4001COOPSETUP-000008')}/* 国际化处理： 登录日期*/
			</NCOption>
			<NCOption key="2" value="logincorp">
				{getLangByResId(this, '4001COOPSETUP-000009')}/* 国际化处理： 登录公司*/
			</NCOption>
			<NCOption key="3" value="loginuser">
				{getLangByResId(this, '4001COOPSETUP-000010')}/* 国际化处理： 登录用户*/
			</NCOption>
		</NCSelect>
	);
}

export default function(props) {
	props.createUIDom(
		{
			pagecode: COOPSETUP_CONST.PAGEID_CARD
		},
		callbackFun.bind(this)
	);
	function callbackFun(data) {
		if (data) {
			if (data.template) {
				let meta = data.template;
				modifierMeta(props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				let status = props.getUrlParam('status');
				props.button.setButtons(button, buttonController.call(this, props, status));
			}
			this.getData();
		}
	}
}

// 修改meta
function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[COOPSETUP_CONST.FORMID].status = status;
	meta[COOPSETUP_CONST.CARD_TABLEID1].status = status;
	meta[COOPSETUP_CONST.CARD_TABLEID2].status = status;

	meta[COOPSETUP_CONST.FORMID].items.map((item) => {
		// 控制表头部分字段不允许编辑：目的单据类型，主键，ts，pk_group,源单据交易类型编码，目的单据交易类型编码
		if (
			item.attrcode == 'vbilltype_dest' ||
			item.attrcode == 'pk_coopsetup' ||
			item.attrcode == 'ts' ||
			item.attrcode == 'pk_group' ||
			item.attrcode == 'vtrantypecode_src' ||
			item.attrcode == 'vtrantypecode_dest'
		) {
			item.disabled = true;
		}

		//1. 根据源单据类型 vbilltype_src 过滤显示 源单据交易类型 ctrantypeid_src 为“采购订单或销售订单交易类型”
		//   默认 源单据交易类型 ctrantypeid_src 为采购订单交易类型
		if (item.attrcode == 'ctrantypeid_src') {
			item.queryCondition = () => {
				let parentbilltype = '21';
				let inputSrcBilltype = props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
				if (inputSrcBilltype != '' && inputSrcBilltype != {}) {
					parentbilltype = inputSrcBilltype;
				}
				return {
					parentbilltype: parentbilltype,
					istransaction: 'Y'
				};
			};
		}

		// 2. 根据 源单据类型 vbilltype_src 过滤 目的单据交易类型 ctrantypeid_dest 是采购订单还是销售订单交易类型
		// 默认 目的单据交易类型 ctrantypeid_dest 为销售订单交易类型
		if (item.attrcode == 'ctrantypeid_dest') {
			item.queryCondition = () => {
				let inputSrcBilltype = props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
				if (inputSrcBilltype == null) {
					return {
						istransaction: 'Y'
					};
				}
				if ('' == inputSrcBilltype || {} == inputSrcBilltype || '21' == inputSrcBilltype) {
					return {
						parentbilltype: '30',
						istransaction: 'Y'
					};
				} else if ('30' == inputSrcBilltype) {
					return {
						parentbilltype: '21',
						istransaction: 'Y'
					};
				} else if ('32' == inputSrcBilltype) {
					return {
						parentbilltype: '25',
						istransaction: 'Y'
					};
				}
			};
		}

		// 对财务组织进行过滤：只允许参照本集团多属财务组织
		if (item.attrcode == 'pk_financeorg_src' || item.attrcode == 'pk_financeorg_dest') {
			item.isShowDisabledData = false;
			item.queryCondition = () => {
				return {
					TreeRefActionExt: 'nccloud.web.scmpub.ref.FinanceOrgTreeRefFilterUtils'
				};
			};
		}

		// 编辑时，参照不显示“停用”
		if (item.attrcode == 'pk_org_dest' || item.attrcode == 'pk_org_src') {
			item.isShowDisabledData = false;
		}
		props.meta.setMeta(meta);
	});

	// 3. 根据“源单据类型”vbilltype_src 对取值内容 vvalueref 的参照类型进行过滤
	meta[COOPSETUP_CONST.CARD_TABLEID1].items.map((item) => {
		// 控制以下字段不可编辑：
		// 目标单据项 vchinaname 目标协同项 ctargetfieldnameid
		// 是否主表 fmain 源协同项 csourcefieldnameid 销售协同明细pk  pk_coopsetup_b
		// 购销协同设置主表  pk_coopsetup 时间戳 ts
		// 取值内容  vvalue 数据类型  datatype 参照类型  reftype
		if (
			item.attrcode == 'vchinaname' ||
			item.attrcode == 'ctargetfieldnameid' ||
			item.attrcode == 'fmain' ||
			item.attrcode == 'csourcefieldnameid' ||
			item.attrcode == 'pk_coopsetup_b' ||
			item.attrcode == 'pk_coopsetup' ||
			item.attrcode == 'ts' ||
			item.attrcode == 'vvalue' ||
			item.attrcode == 'datatype' ||
			item.attrcode == 'reftype'
		) {
			item.disabled = true;
			props.meta.setMeta(meta);
		}
		// 下列代码作废，相关逻辑移到编辑前事件，2018-10-10
		if (item.attrcode == 'vvalueref111') {
			item.render = function(text, record, index) {
				// 1=固定值，2=对应值，3=系统值，
				// 固定值——input；对应值——元数据属性参照；系统值——系统值参照
				let fvaluemodule = record.values.fvaluemodule.value;
				if (fvaluemodule == 1) {
					item.itemtype = 'input';
					return <NCFormControl />;
				} else if (fvaluemodule == 2) {
					item.itemtype = 'refer';
					let billType = '21';
					let inputSrcBilltype = props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
					if ('' == inputSrcBilltype || {} == inputSrcBilltype || '21' == inputSrcBilltype) {
						billType = '21';
					} else if ('30' == inputSrcBilltype) {
						billType = '30';
					}
					return metaAttributeTableRef({
						queryCondition: () => {
							return {
								billType: billType
							};
						},
						// 控制元数据属性参照为单选
						isMultiSelectedEnabled: false,
						pageSize: 1000 // 控制不分页（仅1页）
					});
				} else if (fvaluemodule == 3) {
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
					return <Select />;
				}
			};
		}
		props.meta.setMeta(meta);
	});

	meta[COOPSETUP_CONST.CARD_TABLEID2].items.map((item) => {
		// 控制以下字段不可编辑：
		// 目标单据项 vchinaname 目标协同项 ctargetfieldnameid
		// 是否主表 fmain 源协同项 csourcefieldnameid 销售协同明细pk  pk_coopsetup_b
		// 购销协同设置主表  pk_coopsetup 时间戳 ts
		// 取值内容  vvalue 数据类型  datatype 参照类型  reftype
		if (
			item.attrcode == 'vchinaname' ||
			item.attrcode == 'ctargetfieldnameid' ||
			item.attrcode == 'fmain' ||
			item.attrcode == 'csourcefieldnameid' ||
			item.attrcode == 'pk_coopsetup_b' ||
			item.attrcode == 'pk_coopsetup' ||
			item.attrcode == 'ts' ||
			item.attrcode == 'vvalue' ||
			item.attrcode == 'datatype' ||
			item.attrcode == 'reftype'
		) {
			item.disabled = true;
			props.meta.setMeta(meta);
		}
		// 下列代码作废，相关逻辑移到编辑前事件，2018-10-10
		if (item.attrcode == 'vvalueref111') {
			item.render = function(text, record, index) {
				// 1=固定值，2=对应值，3=系统值，
				// 固定值——input；对应值——元数据属性参照；系统值——系统值参照
				let fvaluemodule = record.values.fvaluemodule.value;
				if (fvaluemodule == 1) {
					item.itemtype = 'input';
					return <NCFormControl />;
				} else if (fvaluemodule == 2) {
					item.itemtype = 'refer';
					let billType = '21';
					let inputSrcBilltype = props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
					if ('' == inputSrcBilltype || {} == inputSrcBilltype || '21' == inputSrcBilltype) {
						billType = '21';
					} else if ('30' == inputSrcBilltype) {
						billType = '30';
					}
					return metaAttributeTableRef({
						queryCondition: () => {
							return {
								billType: billType
							};
						},
						// 控制元数据属性参照为单选
						isMultiSelectedEnabled: false,
						pageSize: 1000 // 控制不分页（仅1页）
					});
				} else if (fvaluemodule == 3) {
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
					return <Select />;
				}
			};
			props.meta.setMeta(meta);
		}
	});
	return meta;
}
