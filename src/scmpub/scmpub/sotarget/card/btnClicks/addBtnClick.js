/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-08-01 11:07:28
*/
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { TARGET_CARD, TARGET_CARD_BUTTON, ATTRCODE } from '../../siconst';
import viewController from '../viewControl/viewController';
import { clearPageData } from '../dataManange/cardPageDataManange';
import headAfterEvent from '../afterEvents/headAfterEvent';
export default function(props) {
	//清空数据
	clearPageData(props);
	//设置默认值
	setDefaultValue.call(this, props);
	//按钮控制
	viewController.call(this, props, TARGET_CARD.add);
	// 处理组织编辑后事件
	if (this.pk_org && this.pk_org.value) {
		props.form.setFormItemsValue(TARGET_CARD.formId, {
			pk_org: this.pk_org
		});
		headAfterEvent.call(
			this,
			props,
			TARGET_CARD.formId,
			TARGET_CARD.pk_org,
			{ value: this.pk_org.value },
			undefined
		);
	}
	let blowsetflag = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value;
	if (true == blowsetflag) {
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, false);
	} else {
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, true);
	}
}
/**
 * 设置新增时候的默认值
 */
function setDefaultValue(props) {
	//组织默认值
	let pk_org = getDefData(TARGET_CARD.dataSource, ATTRCODE.pk_org);
	if (pk_org && pk_org.value) {
		props.form.setFormItemsValue(TARGET_CARD.formId, {
			[ATTRCODE.pk_org]: pk_org
		});
	} else {
		props.initMetaByPkorg();
		props.form.setFormItemsDisabled(TARGET_CARD.formId, { pk_org: false });
	}
}
