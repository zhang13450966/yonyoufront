/*
 * @Author: zhangchangqing 
 * @PageInfo: 编辑事件  
 * @Date: 2018-04-15 15:16:39 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-07-05 15:41:14
 */
import { BUYINGREQ_CARD, ATTRCODES, ATTRCODE, FREEFIELD } from '../../siconst';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { processBatchCodeItem } from '../../../pub/utils/batchCodeUtil';
import { marAsstUtils, crossRuleUtils } from '../../../../../scmpub/scmpub/pub/tool';
import cchangerateBeforeEvent from './bodyBefore/NchangerateBeforeEvent';
let tableId = BUYINGREQ_CARD.tableId;
let formId = BUYINGREQ_CARD.formId;
export default async function bodyBeforeEvents(props, moduleId, key, value, index, record) {
	let _this = this;
	let constance = {};
	let flag = true;
	let fixAssts = [ 'casscustid', 'casscustvid', 'cprojectid', 'cproductorid', 'cvendorid' ];
	let _props = props;
	let _index = index;
	let meta = this.props.meta.getMeta();
	//设置单位过滤
	// meta[tableId].items.map((item) => {
	// 	{
	// 		//根据pk_org 过滤其他字段
	// 		props.cardTable.setQueryCondition(tableId, {
	// 			[item.attrcode]: () => {
	// 				let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
	// 				return { pk_org: data }; // 根据pk_org过滤
	// 			}
	// 		});
	// 	}
	// });
	// props.meta.setMeta(meta);
	if (key == ATTRCODES.pk_material) {
		// 来源于物质及服务需求单以及维修计划、工单维护生成的的物资需求申请单行，物料不让编辑
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value; //来源单据类型
		if (!csourcetypecode) {
			flag = true;
			meta[tableId].items.map((item) => {
				//主组织过滤物料
				if (item.attrcode == ATTRCODES.pk_material) {
					item.isMultiSelectedEnabled = true;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							let pk_org = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org);
							return {
								pk_org: pk_org.value,
								GridRefActionExt: BUYINGREQ_CARD.materialURL
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		} else {
			flag = false;
		}
	} else if (key == 'pk_reqdept_v' || key == 'pk_reqdept') {
		// 需求部门  按照组织过滤 支持业务人员来源
		meta[tableId].items.map((item) => {
			props.cardTable.setQueryCondition(tableId, {
				[item.attrcode]: () => {
					let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
					return {
						pk_org: data,
						busifuncode: BUYINGREQ_CARD.storereq
					};
				}
			});
		});
		// props.meta.setMeta(meta);
	} else if (key == ATTRCODES.nastnum) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
		//来源单据类型csourcetypecode
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode);
		//来源单据类型 是资产配置申请 的单据，数量不允许编辑
		if (csourcetypecode && '1001Z91000000001U0LZ' === csourcetypecode.value) {
			flag = false;
		}
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
	} else if (key == ATTRCODES.nnum || key == ATTRCODES.castunitid) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
		//来源单据类型
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value;
		//来源单据类型 是资产配置申请 的单据，数量不允许编辑
		if (csourcetypecode && '1001Z91000000001U0LZ' === csourcetypecode) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.castunitid) {
					//根据物料过滤单位
					let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							return {
								scm_cmaterialid: pk_material,
								GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
							}; // 根据pk_material过滤
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == ATTRCODES.ntaxmny || key == ATTRCODES.ntaxprice || key == ATTRCODES.cunitid) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
	} else if (key == ATTRCODES.cordertrantypecode) {
		// 采购组织为空不允许编辑
		let pk_purchaseorg = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_purchaseorg).value;
		if (!pk_purchaseorg) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.cordertrantypecode) {
					//表体订单类型
					//委外
					let bsctype = props.form.getFormItemsValue(formId, ATTRCODE.bsctype).value;
					let billTypeOrdert = '21';
					if (bsctype) {
						billTypeOrdert = '61';
					}
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							return { parentbilltype: billTypeOrdert };
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
		//表体订单类型缺少其他的判断，此处待完善 2018-08-08
	} else if (key == ATTRCODES.pk_purchaseorg || key == ATTRCODES.pk_purchaseorg_v) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
		let bcanpurchaseorgedit = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.bcanpurchaseorgedit)
			.value;
		if (!bcanpurchaseorgedit) {
			flag = false;
		}
	} else if (
		key == ATTRCODES.pk_employee ||
		key == ATTRCODES.pk_suggestsupplier_v ||
		key == ATTRCODES.pk_suggestsupplier
	) {
		// 采购组织为空不允许编辑
		let pk_purchaseorg = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_purchaseorg).value;
		if (!pk_purchaseorg) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.pk_employee) {
					let pk_purchaseorg = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_purchaseorg)
						.value;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_purchaseorg,
								busifuncode: BUYINGREQ_CARD.purchaseorg
							};
						}
					});
				} else if (item.attrcode == ATTRCODES.pk_suggestsupplier_v || key == ATTRCODES.pk_suggestsupplier) {
					let pk_purchaseorg = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_purchaseorg)
						.value;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							return {
								pk_org: pk_purchaseorg
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == ATTRCODES.pk_reqstor) {
		//需求仓库
		//来源单据类型
		let csourceid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourceid).value;
		if (csourceid) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.pk_reqstor) {
					//需求仓库过滤 组织、集团、过滤废品仓
					//item.isMultiSelectedEnabled = true;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							let pk_org = props.form.getFormItemsValue(formId, ATTRCODE.pk_org);
							//直运
							let bdirecttransit = props.form.getFormItemsValue(formId, ATTRCODE.bdirecttransit);
							return {
								pk_org: pk_org.value,
								bdirecttransit: bdirecttransit.value,
								GridRefActionExt: BUYINGREQ_CARD.reqstordocURL
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == ATTRCODES.cprojectid) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.cprojectid) {
					//按照组织过滤
					//item.isMultiSelectedEnabled = true;
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							let pk_org = props.form.getFormItemsValue(formId, ATTRCODE.pk_org);
							return {
								pk_org: pk_org.value
							};
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == ATTRCODES.cprojecttaskid) {
		//项目任务：项目为空，不允许编辑
		let cprojectid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.cprojectid).value;
		if (!cprojectid) {
			flag = false;
		}
		if (flag) {
			meta[tableId].items.map((item) => {
				if (item.attrcode == ATTRCODES.cprojecttaskid) {
					//根据项目过滤项目任务
					props.cardTable.setQueryCondition(tableId, {
						[item.attrcode]: () => {
							let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODES.cprojectid).value; // 调用相应组件的取值API
							return { cprojectid: data }; // 根据项目过滤
						}
					});
				}
			});
			// props.meta.setMeta(meta);
		}
	} else if (key == ATTRCODES.vbatchcode) {
		//批次号

		meta[tableId].items.map((item) => {
			if (item.attrcode == ATTRCODES.vbatchcode) {
				let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
				props.cardTable.setQueryCondition(tableId, {
					[item.attrcode]: () => {
						return { pk_material: pk_material };
					}
				});
			}
		});
		// props.meta.setMeta(meta);
		let pk_org = _this.props.form.getFormItemsValue(formId, ATTRCODE.pk_org).value;
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
			processBatchCodeItem.call(
				this,
				props,
				[ BUYINGREQ_CARD.childform1, BUYINGREQ_CARD.tableId ],
				key,
				record,
				BUYINGREQ_CARD.billType
			);
		}
	} else if (key == ATTRCODES.dreqdate) {
		// 请购单行来源于资产配置申请，需求日期不让编辑
		let csourcetypecode = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.csourcetypecode).value; //来源单据类型
		if (!csourcetypecode) {
			flag = true;
		} else if ('1001Z91000000001U0LZ' == csourcetypecode) {
			flag = false;
		}
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
	} else if (key == ATTRCODES.dsuggestdate) {
		// 物料为空不允许编辑
		let pk_material = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		if (!pk_material) {
			flag = false;
		}
	} else if (key.startsWith('vfree')) {
		//辅助属性
		let pk_org = _this.props.form.getFormItemsValue(formId, ATTRCODE.pk_org).value;
		let materialvid = props.cardTable.getValByKeyAndIndex(tableId, index, ATTRCODES.pk_material).value;
		constance.key = key;
		constance.params = {
			key: key,
			pk_org: pk_org,
			materialvid: materialvid
		};
		flag = await vfreeBeforeEvent(_this.props, constance);
		if (flag) {
			marAsstUtils.resetItem.call(
				_this,
				props,
				'400400400',
				BUYINGREQ_CARD.cardpageid,
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
			'400400400',
			BUYINGREQ_CARD.cardpageid,
			moduleId,
			key,
			record,
			FREEFIELD
		);
		flag = true;
	} else if (ATTRCODES.otherfields.includes(key)) {
		// 不允许编辑字段
		flag = false;
	}
	return flag;
}
