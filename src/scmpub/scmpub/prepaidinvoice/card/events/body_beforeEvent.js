/*
 * @Author: 刘奇 
 * @PageInfo: 表体编辑前事件
 * @Date: 2019-03-29 11:20:51 
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-26 14:09:58
 */

import { PREPAIDINVOICE_CONST, PrepaidinvoiceHeadItem, PrepaidinvoiceBodyItem } from '../../const';

//props, moduleId(区域id), key(操作的键), value（当前值）,  index（当前index）, record（行数据）
export default function bodyBeforeEvent(props, moduleId, key, value, index, rowdata) {
	let record = rowdata.values;
	let meta = props.meta.getMeta();
	if (key == PrepaidinvoiceBodyItem.ncaltaxmny) {
		//若（购销类型=出口销售），支持编辑；否则禁止编辑；
		let fbuysellflag = props.form.getFormItemsValue(
			PREPAIDINVOICE_CONST.formId,
			PrepaidinvoiceHeadItem.fbuysellflag
		).value;
		if (fbuysellflag != 3) {
			return false;
		}
	} else if (key == PrepaidinvoiceBodyItem.cfeeinvid) {
		// 物料只可参照到服务类，折扣类物料
		let item = meta[moduleId].items.find((item) => item.attrcode == PrepaidinvoiceBodyItem.cfeeinvid);
		meta['childform2'].items.find((item) => item.attrcode == key).isMultiSelectedEnabled = true;
		item.isMultiSelectedEnabled = true;
		props.meta.setMeta(meta);
		props.cardTable.setQueryCondition(PREPAIDINVOICE_CONST.tableId, {
			[item.attrcode]: () => {
				let pk_org = (props.form.getFormItemsValue(PREPAIDINVOICE_CONST.formId, 'pk_org') || {}).value;
				return {
					pk_org: pk_org,
					fee: 'Y',
					// 过滤常用页签
					UsualGridRefActionExt: 'nccloud.web.scmpub.prepaidinvoice.reffilter.MaterialRefFilter',
					// 过滤全部页签
					GridRefActionExt: 'nccloud.web.scmpub.prepaidinvoice.reffilter.MaterialRefFilter'
				};
			}
		});
	} else if (key.startsWith('vbdef')) {
		// 表体自定义项，根据财务组织过滤
		let pk_org = record.pk_org;
		let flag = true;
		if (pk_org && pk_org.value) {
			if (pk_org.value != null && pk_org.value != '') {
				flag = false;
			}
		}
		// modify by zhaoypm at 20200822 崔玲玲标识用户不一定会把表体和侧拉编辑的自定义项同时配出来，因此可能有空的情况，所以做一下兼容，防止侧拉编辑模板上自定义项字段为空时报错导致表体字段无法编辑
		let bodyitem = meta[moduleId].items.find((item) => item.attrcode == key);
		if (bodyitem) {
			bodyitem.isShowUnit = flag;
		}
		let bodySideItem = meta[PREPAIDINVOICE_CONST.side].items.find((item) => item.attrcode == key);
		if (bodySideItem) {
			bodySideItem.isShowUnit = flag;
		}
		props.meta.setMeta(meta);
		// 适配侧拉
		props.cardTable.setQueryCondition(PREPAIDINVOICE_CONST.tableId, {
			[key]: () => {
				return {
					pk_org: pk_org.value || ''
				};
			}
		});
	}

	return true;
}
