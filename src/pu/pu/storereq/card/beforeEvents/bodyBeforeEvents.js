/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-07-05 15:40:43
 */
import { STOREREQ_CARD, ATTRCODES, ATTRCODE, FREEFIELD } from '../../siconst';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import cchangerateBeforeEvent from './bodyBefore/NchangerateBeforeEvent';
let tableId = STOREREQ_CARD.tableId;
let formId = STOREREQ_CARD.formId;
export default async function bodyBeforeEvents(props, moduleId, key, value, index, record) {
	let fixAssts = [ 'casscustid', 'casscustvid', 'cprojectid', 'cproductorid', 'cvendorvid', 'cvendorid' ];
	let constance = {};
	let _this = this;
	let flag = true;
	let _props = props;
	let _index = index;
	let meta = this.props.meta.getMeta();
	let material = record.values.pk_material.value;
	if (key != ATTRCODES.pk_material && !material) {
		return false;
	}
	//设置单位过滤
	if (key == ATTRCODES.pk_material) {
		// 来源于物质及服务需求单以及维修计划的物资需求申请单行，物料不让编辑
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value; //来源单据类型
		if (!csourcetypecode) {
			flag = true;
			meta[tableId].items.map((item) => {
				//主组织过滤物料
				if (item.attrcode == ATTRCODES.pk_material) {
					item.isMultiSelectedEnabled = true;
					props.cardTable.setQueryCondition(STOREREQ_CARD.tableId, {
						[item.attrcode]: () => {
							let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org);
							return {
								pk_org: pk_org.value,
								GridRefActionExt: STOREREQ_CARD.materialURL
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		} else if ('4D14' == csourcetypecode || '1001Z900000000002213' == csourcetypecode) {
			flag = false;
		}
	} else if (key == ATTRCODES.pk_reqstordoc) {
		meta[tableId].items.map((item) => {
			//主组织过滤物料
			if (item.attrcode == ATTRCODES.pk_reqstordoc) {
				//需求仓库过滤 组织、集团、过滤废品仓
				item.isMultiSelectedEnabled = true;
				props.cardTable.setQueryCondition(STOREREQ_CARD.tableId, {
					[item.attrcode]: () => {
						let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org);
						return {
							pk_org: pk_org.value,
							GridRefActionExt: STOREREQ_CARD.reqstordocURL
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == ATTRCODES.cbs) {
		// 增加CBS字段参照过滤:如果有项目，可以编辑，同时将项目id和库存组织pk传给参照进行过滤
		let cprojectid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.cprojectid);
		if (JSON.stringify(cprojectid) != '{}') {
			let pk_org = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org);
			props.cardTable.setQueryCondition(tableId, {
				[key]: () => {
					return {
						pk_org: pk_org && pk_org.value ? (pk_org.value.includes(',') ? null : pk_org.value) : null, //库存组织id
						pk_project: cprojectid.value
							? cprojectid.value.includes(',') ? null : cprojectid.value
							: null, //项目id
						orgType: 'StockOrg'
					};
				}
			});
		} else {
			return false;
		}
	} else if (key == ATTRCODES.pk_appdept_v || key == ATTRCODES.pk_appdept) {
		meta[tableId].items.map((item) => {
			if (item.attrcode == ATTRCODES.pk_appdept_v || item.attrcode == ATTRCODES.pk_appdept) {
				//申请部门 按照组织过滤 支持业务人员来源
				props.cardTable.setQueryCondition(tableId, {
					[item.attrcode]: () => {
						let data = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
						return {
							pk_org: data,
							busifuncode: STOREREQ_CARD.storereq
						};
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == ATTRCODES.pk_apppsn) {
		meta[tableId].items.map((item) => {
			if (item.attrcode == ATTRCODES.pk_apppsn) {
				//申请人 按照组织过滤 支持业务人员来源
				props.cardTable.setQueryCondition(tableId, {
					[item.attrcode]: () => {
						let data = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
						let pk_appdept = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_appdept)
							.value;
						return {
							pk_org: data,
							pk_dept: pk_appdept,
							busifuncode: STOREREQ_CARD.storereq
						};
					}
				});
			}
		});
	} else if (key == ATTRCODES.vchangerate) {
		//换算率编辑前控制
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		//物料为空直接返回false 不可编辑
		if (!pk_material) {
			flag = false;
		}
		//主单位
		let cunitid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.cunitid).value;
		//单位
		let castunitid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.castunitid).value;
		//主单位为空直接返回false 不可编辑
		if (!cunitid) {
			flag = false;
		}
		//主辅计量单位相同不允许修改换算率
		if (cunitid == castunitid) {
			flag = false;
		} else {
			// 主辅计量不同，根据是否固定换算率决定其编辑性   此处应该有远程调用查询
			flag = await cchangerateBeforeEvent.call(this, props, moduleId, key, pk_material, castunitid);
		}
	} else if (key == ATTRCODES.cprojecttaskid) {
		// 项目为空不允许编辑
		let cprojectid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.cprojectid).value;
		if (!cprojectid) {
			flag = false;
		}
	} else if (key == ATTRCODES.pk_nextbalanceorg_v || key == ATTRCODES.pk_nextbalanceorg) {
		//下次平衡库存组织 需求类型未选不可编辑
		let freqtypeflag = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.freqtypeflag).value;
		if (!freqtypeflag) {
			flag = false;
		}
		//需求类型未0-毛需求也不允许修改  1-为净需求
		if (0 == freqtypeflag.value) {
			flag = false;
		}
	} else if (key == ATTRCODES.castunitid) {
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		//物料为空直接返回false 不可编辑
		if (!pk_material) {
			flag = false;
		}
		meta[tableId].items.map((item) => {
			if (item.attrcode == ATTRCODES.castunitid) {
				//根据物料过滤单位
				props.cardTable.setQueryCondition(tableId, {
					[item.attrcode]: () => {
						let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material)
							.value;
						return {
							scm_cmaterialid: pk_material,
							GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
						}; // 根据pk_material过滤
					}
				});
			}
		});
		// props.meta.setMeta(meta);
	} else if (key == ATTRCODES.vbatchcode) {
		//辅助属性
		let pk_org = _this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value;
		let materialvid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid,
			cmaterialvid: materialvid
		};
		flag = await vfreeBeforeEvent(_this.props, constance);
		if (flag) {
			//当批次号可编辑时，处理批次号参照弹出框里的数据
			processBatchCodeItem.call(
				this,
				props,
				[ STOREREQ_CARD.childform1, STOREREQ_CARD.tableId ],
				key,
				record,
				STOREREQ_CARD.billType
			);
		}
		return flag;
	} else if (key === ATTRCODES.cprojectid) {
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		//物料为空直接返回false 不可编辑
		if (!pk_material) {
			flag = false;
		}
		//来源单据类型为  4D14 不可编辑
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value;
		if (csourcetypecode) {
			// 物资及服务需求单单据类型主键就是这样的
			if ('1001ZP1000000005GEZN' === csourcetypecode) {
				flag = false;
			}
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.cprojectid) {
					//根据物料过滤单位
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							let pk_org = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org);
							return {
								pk_org: pk_org.value
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key.startsWith('vfree')) {
		//辅助属性
		let pk_org = _this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value;
		let materialvid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid,
			cmaterialvid: materialvid
		};
		flag = await vfreeBeforeEvent(_this.props, constance);
		if (flag) {
			marAsstUtils.resetItem.call(
				_this,
				props,
				'400400000',
				STOREREQ_CARD.cardpageid,
				moduleId,
				key,
				record,
				FREEFIELD
			);
		}
	} else if (key.startsWith('vbdef')) {
	} else if (fixAssts.includes(key)) {
		marAsstUtils.resetItem.call(
			_this,
			props,
			'400400000',
			STOREREQ_CARD.cardpageid,
			moduleId,
			key,
			record,
			FREEFIELD
		);
		flag = true;
	} else if (ATTRCODES.noEditfield.includes(key)) {
		flag = false;
	}
	// let crossRuleParams = {
	// 	props,
	// 	key, //当前字段
	// 	appcode: null, //小应用编码，如果是本应用，可为空
	// 	pagecode: STOREREQ_CARD.cardpageid, //页面编码
	// 	headarea: formId, //表头区域编码
	// 	bodyarea: STOREREQ_CARD.tableId, //表体区域编码
	// 	isHead: false, //是否为表头区字段
	// 	record, //当前表体行数据，如果是表头触发，可以为空
	// 	pk_org_field: ATTRCODE.pk_org, //组织字段，注意为oid
	// 	billtype: '422X', //单据类型
	// 	transtypeid_field: ATTRCODE.ctrantypeid //交易类型id字段
	// };
	// crossRuleUtils.beforeEdit.call(this, crossRuleParams);
	return flag;
}
