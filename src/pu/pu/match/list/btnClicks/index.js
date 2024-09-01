import searchBtnClick from './searchBtnClick';
import { BUTTONID } from '../../constance';
import manualMatchBtnClick from './manualMatchBtnClick';
import autoMatchBtnClick from './autoMatchBtnClick';
import setMatchRuleBtnClick from './setMatchRuleBtnClick';
import deleteMatchResultBtnClick from './deleteMatchResultBtnClick';
import refreshBtnClick from './refreshBtnClick';
import confirmMacthResultBtnClick from './confirmMacthResultBtnClick';
import printBtnClick from './printBtnClick';
import outputBtnClick from './outputBtnClick';
import invoiceSearch from './invoiceSearch';
import matchedSearch from './matchedSearch';

function buttonClick(props, id, text, record, index) {
	switch (id) {
		// 手工匹配
		case BUTTONID.Manual:
			manualMatchBtnClick.call(this, props);
			break;
		// 自动匹配
		case BUTTONID.Auto:
			autoMatchBtnClick.call(this, props);
			break;
		// 设置匹配规则
		case BUTTONID.Setting:
			setMatchRuleBtnClick.call(this, props);
			break;

		// 确认匹配结果
		case BUTTONID.Confirm:
			confirmMacthResultBtnClick.call(this, props);
			break;
		// 删除匹配结果
		case BUTTONID.Delete:
			deleteMatchResultBtnClick.call(this, props);
			break;
		// 打印
		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;
		// 输出
		case BUTTONID.Output:
			outputBtnClick.call(this, props);
			break;
		// 刷新
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
	}
}

export { buttonClick, searchBtnClick, refreshBtnClick, invoiceSearch, matchedSearch };
