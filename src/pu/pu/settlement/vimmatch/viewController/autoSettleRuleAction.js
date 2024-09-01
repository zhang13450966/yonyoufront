
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, toast } from 'nc-lightapp-front';
class AutoSettleRuleAction {
	doAction(page) {
		this.before();
		let props = page.props;
		page.state.btnName = 'AutoSettleRule';
		if (!page.state.pk_financeorg) {
			toast({ content: getLangByResId(page, '4004SETTLEMENT-000005'), color: 'warning' }); /* 国际化处理： 请先选择财务组织！*/
			return;
        }
        props.modal.show('settleRule');
        this.after();
	}

	before() {}

	after() {}
}
export default AutoSettleRuleAction;