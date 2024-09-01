/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片表体编辑前事件
 * @Date: 2018-08-06 15:53:53
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-07 18:45:49
 */
import { FIELD, PAGECODE, URL, FREEFIELD, AREA } from '../../constance';
import { vfreeBeforeEvent } from '../../../pub/beforeevent';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';

export default async function(props, moduleId, key, value, index, record) {
	let _this = this;
	let checkmaterial = record.values.cmaterialid.value;
	checkmaterial = checkmaterial == '' ? null : checkmaterial;
	if (key != 'cmaterialid' && checkmaterial == null) {
		return false;
	}
	let flag = true;
	let constance = {};
	let meta = this.props.meta.getMeta();
	let pk_org = props.form.getFormItemsValue(AREA.head, FIELD.pk_org).value;

	if (key == FIELD.pk_material) {
		//物料
		//物料
		flag = true;
		//let pk_org = record.values.pk_org.value;
		meta[PAGECODE.body].items.map((item) => {
			if (item.attrcode == FIELD.pk_material) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						pk_org = record.values.pk_org.value;
						return {
							pk_org: pk_org
						};
					}
				});
			}
		});
	} else if (key == 'casscustvid' || key == 'casscustid') {
		// 客户 参照的范围为主组织可见的客户 已经在方法入口统一处理
		flag = true;
		meta[AREA.body].items.map((item) => {
			if (item.attrcode == key) {
				props.cardTable.setQueryCondition(moduleId, {
					[item.attrcode]: () => {
						let pk_org = record.values.pk_org.value;
						return {
							pk_org: pk_org
						};
					}
				});
			}
		});
	} else if (key == 'ncaltaxmny') {
		// 计税金额
		flag = true;
		let buysellflag = record.values.fbuysellflag.value;
		// 当购销类型=国内采购时不可编辑；购销类型=进口采购时跨国业务支持编辑。
		flag = FIELD.EXPORTATION == buysellflag || FIELD.IMPORTATION == buysellflag;
	} else if (key == 'ctaxcodeid') {
		// 税码
		flag = true;
		let ctaxcountryid = record.values.ctaxcountryid.value;
		let fbuysellflag = record.values.fbuysellflag.value;
		if (ctaxcountryid == null || null == fbuysellflag) {
			flag = false;
		} else {
			meta[AREA.body].items.map((item) => {
				if (item.attrcode == 'ctaxcodeid') {
					props.cardTable.setQueryCondition(moduleId, {
						[item.attrcode]: () => {
							return {
								ctaxcountryid: ctaxcountryid,
								fbuysellflag: fbuysellflag,
								GridRefActionExt: 'nccloud.web.pu.order.ref.CtaxcodeidBodyRefFilter'
							};
						}
					});
				}
			});
		}
	}
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	if (key.startsWith('vfree') || fixAssts.includes(key)) {
		//辅助属性
		if (fixAssts.includes(key)) {
			flag = true;
		} else {
			let pk_org = record.values.pk_org.value;
			let materialvid = record.values.cmaterialid.value;
			constance.key = key;
			constance.params = {
				key: key,
				pk_org: pk_org,
				materialvid: materialvid
			};
			flag = await vfreeBeforeEvent(_this.props, constance);
		}
		if (flag) {
			marAsstUtils.resetItem.call(
				this,
				props,
				'400401400',
				PAGECODE.card,
				moduleId,
				key,
				record, // marAsstUtils.filterRecord.call(this, 'vfree', fixAssts, record)
				FREEFIELD
			);
		}
	}
	// if (flag && moduleId == PAGECODE.cardbody) {

	return flag;
}
function isNull(value) {
	if (value == undefined || value === '') {
		return true;
	}
	return false;
}
