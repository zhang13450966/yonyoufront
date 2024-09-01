import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { COOPSETUP_CONST } from '../../const';

export default function(props, moduleId, key, input, changedrows, index) {
	// 一、编辑表头：源单据类型
	if (key === 'vbilltype_src') {
		// 1.设置目的单据类型,且不可编辑
		this.props.form.setFormItemsDisabled(moduleId, { vbilltype_dest: true });
		// 2.清空表头其他字段值：目的单据交易类型 ctrantypeid_dest，源单据交易类型 ctrantypeid_src
		//   目的购销组织 pk_org_dest，源购销组织 pk_org_src ，目的单据交易类型编码 vtrantypecode_dest
		//   源单据交易类型编码 vtrantypecode_src，目的单据类型 vbilltype_dest
		// 其中：当源单据类型vbilltype_src为空时，清空 vbilltype_dest
		if (!input || !input.value || input.value == {}) {
			this.props.form.setFormItemsValue(moduleId, {
				vbilltype_dest: {
					value: null,
					display: null
				}
			});
		}
		// 清空字段值
		this.props.form.setFormItemsValue(moduleId, {
			ctrantypeid_dest: {
				value: null,
				display: null
			},
			ctrantypeid_src: {
				value: null,
				display: null
			},
			pk_org_dest: {
				value: null,
				display: null
			},
			pk_org_src: {
				value: null,
				display: null
			},
			vtrantypecode_dest: {
				value: null,
				display: null
			},
			vtrantypecode_src: {
				value: null,
				display: null
			}
		});

		// 3.设置“目的单据类型”值
		if ('21' == input.value) {
			this.props.form.setFormItemsValue(moduleId, {
				vbilltype_dest: {
					value: getLangByResId(this, '4001COOPSETUP-000004') /* 国际化处理： 销售订单*/,
					display: getLangByResId(this, '4001COOPSETUP-000004') /* 国际化处理： 销售订单*/
				}
			});
		} else if ('30' == input.value) {
			this.props.form.setFormItemsValue(moduleId, {
				vbilltype_dest: {
					value: getLangByResId(this, '4001COOPSETUP-000005') /* 国际化处理： 采购订单*/,
					display: getLangByResId(this, '4001COOPSETUP-000005') /* 国际化处理： 采购订单*/
				}
			});
		} else if ('32' == input.value) {
			this.props.form.setFormItemsValue(moduleId, {
				vbilltype_dest: {
					value: getLangByResId(this, '4001COOPSETUP-000027') /* 国际化处理： 采购发票*/,
					display: getLangByResId(this, '4001COOPSETUP-000027') /* 国际化处理： 采购发票*/
				}
			});
		}

		// 4.设置表体页签数据
		if (input.value && input.value != {}) {
			loadBody(props, input.value);
		}
	}

	// 二、编辑表头：目的单据交易类型编码 或 源单据交易类型编码
	if (key === 'ctrantypeid_dest' || key === 'ctrantypeid_src') {
		let transtypeid = input && input.value;
		if (transtypeid == '' || transtypeid == {} || transtypeid == undefined) {
			return;
		}
		let data = {
			transtypeid: transtypeid
		};
		ajax({
			url: COOPSETUP_CONST.EDITTRANSTYPEURL,
			data: data,
			success: (res) => {
				if (key === 'ctrantypeid_dest') {
					this.props.form.setFormItemsValue(moduleId, {
						vtrantypecode_dest: {
							value: res.data,
							display: res.data
						}
					});
				} else if (key === 'ctrantypeid_src') {
					this.props.form.setFormItemsValue(moduleId, {
						vtrantypecode_src: {
							value: res.data,
							display: res.data
						}
					});
				}
			}
		});
	}

	// 三、编辑表头：源结算财务组织，目的结算财务组织，源单据交易类型，目的单据交易类型，源购销组织和目的购销组织
	if (
		key === 'pk_financeorg_src' ||
		key === 'pk_financeorg_dest' ||
		key === 'ctrantypeid_src' ||
		key === 'ctrantypeid_dest' ||
		key === 'pk_org_src' ||
		key === 'pk_org_dest'
	) {
		if (input && input.refpk) {
			this.props.form.setFormItemsValue(moduleId, {
				key: {
					value: input.refpk,
					display: input.refname
				}
			});
		} else {
			this.props.form.setFormItemsValue(moduleId, {
				key: {
					value: null,
					display: null
				}
			});
		}
	}

	// 四、动态改变“源购销组织”和“目的购销组织”的参照类型
	if (key === 'vbilltype_src') {
		let vbilltype_src =
			this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src') == undefined
				? ''
				: this.props.form.getFormItemsValue(COOPSETUP_CONST.FORMID, 'vbilltype_src').value;
		// 将源购销组织设置销售组织参照，将目的购销组织设为采购组织参照
		if ('30' == vbilltype_src) {
			let srcMeta = props.meta.getMeta();
			let items = srcMeta.head.items;
			for (let i = 0; i < items.length; i++) {
				if (items[i].attrcode == 'pk_org_src') {
					// 重新赋值前需要清空form或table里的字段的相关属性
					this.props.renderItem('form', 'head', 'pk_org_src', null);
					items[i].refcode = 'uapbd/refer/org/SaleOrgTreeRef/index.js';
					items[i].refName = getLangByResId(this, '4001COOPSETUP-000006'); /* 国际化处理： 销售组织*/
					this.props.meta.setMeta(srcMeta);
				} else if (items[i].attrcode == 'pk_org_dest') {
					// 重新赋值前需要清空form或table里的字段的相关属性
					this.props.renderItem('form', 'head', 'pk_org_dest', null);
					items[i].refcode = 'uapbd/refer/org/PurchaseOrgGridRef/index.js';
					items[i].refName = getLangByResId(this, '4001COOPSETUP-000007'); /* 国际化处理： 采购组织*/
					this.props.meta.setMeta(srcMeta);
				}
			}
		}
		if ('21' == vbilltype_src || '' == vbilltype_src) {
			let srcMeta = props.meta.getMeta();
			let items = srcMeta.head.items;
			for (let i = 0; i < items.length; i++) {
				if (items[i].attrcode == 'pk_org_src') {
					// 重新赋值前需要清空form或table里的字段的相关属性
					this.props.renderItem('form', 'head', 'pk_org_src', null);
					items[i].refcode = 'uapbd/refer/org/PurchaseOrgGridRef/index.js';
					items[i].refName = getLangByResId(this, '4001COOPSETUP-000007'); /* 国际化处理： 采购组织*/
					this.props.meta.setMeta(srcMeta);
				} else if (items[i].attrcode == 'pk_org_dest') {
					// 重新赋值前需要清空form或table里的字段的相关属性
					this.props.renderItem('form', 'head', 'pk_org_dest', null);
					items[i].refcode = 'uapbd/refer/org/SaleOrgTreeRef/index.js';
					items[i].refName = getLangByResId(this, '4001COOPSETUP-000006'); /* 国际化处理： 销售组织*/
					this.props.meta.setMeta(srcMeta);
				}
			}
		}
	}

	// 五、编辑表体：取值方式时(1=固定值，2=对应值，3=系统值，  )
	if (key === 'fvaluemodule') {
		// 1.清空取值内容 + 取值内容参照值
		// (1)取值方式为空时，设置取值内容不允许编辑
		if (!input || input == {} || input == '') {
			this.props.editTable.setEditableRowKeyByIndex(moduleId, index, 'vvalueref', false);
		}
		// (2)清空下列字段值
		this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
			value: null,
			display: null
		});
		this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalueref', {
			value: null,
			display: null
		});

		// 2.根据“取值方式” + “取值内容” 设置“是否主表”
		if (input) {
			// 获取“数据类型”的值
			let datatype =
				this.props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype') == undefined
					? null
					: this.props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype').value;
			// 获取“参照类型”的值
			let reftype =
				this.props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype') == undefined
					? null
					: this.props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype').value;

			// if (input == 2) {
			// 	let vvalue = this.props.editTable.getChangedRows(moduleId).values.vvalueref;
			// 	let fmain_value = null;
			// 	let fmain_display = null;
			// 	if (vvalue == undefined) {
			// 		fmain_value = null;
			// 		fmain_display = null;
			// 	} else {
			// 		fmain_value = vvalue.isMain;
			// 		fmain_display = vvalue.isMain;
			// 	}
			// 	this.props.editTable.setValByKeyAndIndex(moduleId, index, 'fmain', {
			// 		value: fmain_value,
			// 		display: fmain_display
			// 	});
			// } else if (input == 3) {
			// 	let vvalue = this.props.editTable.getChangedRows(moduleId).values.vvalueref;
			// 	let vvalue_value = null;
			// 	let vvalue_display = null;
			// 	if (vvalue == undefined) {
			// 		vvalue_value = null;
			// 		vvalue_display = null;
			// 	} else {
			// 		vvalue_value = vvalue.isMain;
			// 		vvalue_display = vvalue.isMain;
			// 	}

			// 	this.props.editTable.setValByKeyAndIndex(moduleId, index, 'fmain', {
			// 		value: vvalue_value,
			// 		display: vvalue_display
			// 	});
			// } else if (input == 1) {
			// 	// 数据类型=4；数据类型=5+参照类型为空——取值内容vvalueref不允许编辑
			// 	if (datatype == 4 || (datatype == 5 && reftype == null)) {
			// 		this.props.editTable.setEditableRowKeyByIndex(moduleId, index, 'vvalueref', false);
			// 		//this.props.editTable.setEditableRowKeyByRowId(moduleId, changedrows[0].rowid, 'vvalueref', false);
			// 	}
			// }
			if (input == 1) {
				// 数据类型=4；数据类型=5+参照类型为空——取值内容vvalueref不允许编辑
				if (datatype == 4 || (datatype == 5 && reftype == null)) {
					this.props.editTable.setEditableRowKeyByIndex(moduleId, index, 'vvalueref', false);
				}
			}
		}
	}

	// 六、取值内容 vvalueref 编辑后给取值内容 vvalue 赋值（举例示意）
	// (1)固定值-字符串类型：aa —— aa
	// (2)固定值-档案参照类型：安踏（参照名称）—— 1001K61000000003LFD5（参照主键）
	// (3)固定值-日期类型：2018-10-11 11:11:11 —— 2018-10-11
	// (4)对应值-元数据参照类型：所属集团 —— pk_group
	// (5)系统值-下拉类型：登录日期 —— 登录日期
	if (key == 'vvalueref') {
		// 1.获取"取值方式"的值
		let fvaluemodule =
			this.props.editTable.getValByKeyAndIndex(moduleId, index, 'fvaluemodule') == undefined
				? null
				: this.props.editTable.getValByKeyAndIndex(moduleId, index, 'fvaluemodule').value;
		// 2.获取“数据类型”的值
		let datatype =
			this.props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype') == undefined
				? null
				: this.props.editTable.getValByKeyAndIndex(moduleId, index, 'datatype').value;
		// 3.获取“参照类型”的值
		let reftype =
			this.props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype') == undefined
				? null
				: this.props.editTable.getValByKeyAndIndex(moduleId, index, 'reftype').value;

		// 4.开始赋值
		// // （1）若 取值方式=空，则 vvalueref 和 vvalue 不允许编辑
		// if (fvaluemodule == null || fvaluemodule == '' || fvaluemodule == {}) {
		// 	this.props.editTable.setEditableRowKeyByRowId(moduleId, changedrows[0].rowid, 'vvalueref', false);
		// }
		// （2）若 取值方式=固定值1 + 数据类型=-1,0,1,2时，vvalueref 与 vvalue 的值一样
		if (fvaluemodule == '1' && (datatype == '-1' || datatype == '0' || datatype == '1' || datatype == '2')) {
			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
				value: input,
				display: input
			});
		}
		// （3）若 取值方式=固定值1 + 数据类型=3，vvalueref为年月日时分秒，则vvalue为年月日
		if (fvaluemodule == '1' && datatype == '3') {
			let showtime = '';
			if (input && input != '' && input != null) {
				showtime = input.split(' ')[0];
			}
			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
				value: showtime,
				display: showtime
			});
		}
		// // （4） 若取值方式=固定值1 + 数据类型=4，则vvalueref和vvalue均不允许编辑
		// if (fvaluemodule == '1' && datatype == '4') {
		// 	this.props.editTable.setEditableRowKeyByIndex(moduleId, index ,'vvalueref', false);
		// }
		// （5） 若取值方式=固定值1 + 数据类型=5，则vvalue取参照的主键
		if (fvaluemodule == '1' && datatype == '5') {
			// 参照类型为空的，取值内容不允许编辑
			// if (reftype == null) {
			// 	this.props.editTable.setEditableRowKeyByIndex(moduleId, index ,'vvalueref', false);
			// } else {
			let refPk = null;
			let refName = null;
			if (input && input.refpk && input.refname) {
				refPk = input.refpk;
				refName = input.refname;
			}

			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
				value: refPk,
				display: refPk
			});
			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalueref', {
				value: refName,
				display: refName
			});
		}
		// (6) 若取值方式=对应值2，vvalueref取元数据参照的name，vvalue取元数据参照的code
		if (fvaluemodule == '2') {
			if (input && input.refname && input.refcode) {
				this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalueref', {
					value: input.refname,
					display: input.refname
				});
				this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
					value: input.refpk,
					display: input.refpk
				});
			} else {
				this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalueref', {
					value: null,
					display: null
				});
				this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
					value: null,
					display: null
				});
			}
		}
		// (7) 若取值方式=系统值3，vvalueref取name，vvalue取name——>
		if (fvaluemodule == '3') {
			let show = null;
			if (input == 'logindate') {
				show = getLangByResId(this, '4001COOPSETUP-000008'); /* 国际化处理： 登录日期*/
			} else if (input == 'logincorp') {
				show = getLangByResId(this, '4001COOPSETUP-000009'); /* 国际化处理： 登录公司*/
			} else if (input == 'loginuser') {
				show = getLangByResId(this, '4001COOPSETUP-000010'); /* 国际化处理： 登录用户*/
			}
			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalueref', {
				value: show,
				display: show
			});
			this.props.editTable.setValByKeyAndIndex(moduleId, index, 'vvalue', {
				value: show,
				display: show
			});
		}
	}
}

/**
 * 加载表体页签数据
 * @param {*} props 
 * @param {*} vbilltype_src 
 */
function loadBody(props, vbilltype_src) {
	let data = {
		vbilltype_src: vbilltype_src
	};
	ajax({
		url: COOPSETUP_CONST.EDITSRCBILLTYPEURL,
		data: data,
		success: (res) => {
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID1, res.data.salepurchasecoop.coopsetbody);
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID2, res.data.boundcoop.coopsetbody);
			props.editTable.setTableData(COOPSETUP_CONST.CARD_TABLEID3, res.data.invoicecoop.coopsetbody);
		}
	});
}
