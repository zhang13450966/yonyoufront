import {
	saveBtnClick,
	quickReceiveBtnClick,
	cancelBtnClick,
	editBtnClick,
	deleteBtnClick,
	saveSendBtnClick,
	dirPrintBarcodeBtnClick,
	unCommitBtnClick,
	copyLinesBtnClick,
	pastToLastBtnClick,
	cancelPastBtnClick,
	deleteLinesBtnClick,
	resetRownoBtnClick,
	genAssertCardBtnClick,
	delAssertCardBtnClick,
	genTransAssertBtnClick,
	delTransAssertBtnClick,
	checkBtnClick,
	refOrderBtnClick,
	refSubcontBtnClick,
	returnOrderBtnClick,
	returnSubcontBtnClick,
	returnArrivalBtnClick,
	queryAboutBusinessBtnClick,
	printBtnClick,
	outPrintBtnClick,
	accessoryManageBtnClick,
	approveInfoBtnClick,
	refreashBtnClick,
	commit,
	quitBtnClick,
	materialAssignBtnClick,
	splitPrintClick,
	combinPrintClick,
	saveAndCommit
} from '../btnClicks';
import stockQuery from '../btnClicks/stockQuery';
import { NCModule } from '../../../pub/constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import urgentLetGo from '../btnClicks/urgentLetGo';
import sysModuleCheck from '../../../pub/remoteCall/sysModuleCheck';
import printbarCodeBtnClick from '../btnClicks/printbarCodeBtnClick';
import { FIELD, BUTTONAREA, AREA } from '../../constance';
import printCountQuery from '../../../../../scmpub/scmpub/pub/tool/printCountQuery';

export default function buttonClick(props, id) {
	switch (id) {
		case 'Save':
			saveBtnClick.call(this, props, id);
			break;
		case 'QuickReceive':
			quickReceiveBtnClick.bind(this)();
			break;
		case 'Cancel':
			cancelBtnClick.bind(this, props)();
			break;
		case 'Edit':
			editBtnClick.bind(this)();
			break;
		case 'Delete':
			deleteBtnClick.bind(this)();
			break;
		case 'Back':
			window.location.hash = URL.list;
			break;
		case 'SaveSend': //保存提交
			saveAndCommit.call(this);
			// saveSendBtnClick.bind(this)();
			break;
		//打印条形码
		case 'PrintBarCode':
			printbarCodeBtnClick.call(this, props);
			break;
		case 'DirPrintBarcode':
			dirPrintBarcodeBtnClick.bind(this)();
			break;
		case 'Commit':
			commit.bind(this)();
			break;
		case 'UnCommit':
			unCommitBtnClick.bind(this)();
			break;
		case 'CopyLines':
			copyLinesBtnClick.bind(this)();
			break;
		case 'PastToLast': // 物料 粘贴至末行
			pastToLastBtnClick.bind(this)();
			break;
		case 'CancelPast': // 物料 复制取消
			cancelPastBtnClick.bind(this)();
			break;
		case 'DeleteLine':
			deleteLinesBtnClick.bind(this)();
			break;
		case 'ResetRowno':
			resetRownoBtnClick.bind(this)();
			break;
		case 'GenAssertCard':
			genAssertCardBtnClick.bind(this)();
			break;
		case 'DelAssertCard':
			delAssertCardBtnClick.bind(this)();
			break;
		case 'GenTransAssert':
			genTransAssertBtnClick.bind(this)();
			break;
		case 'DelTransAssert':
			delTransAssertBtnClick.bind(this)();
			break;
		case 'Check':
			checkBtnClick.bind(this)();
			break;
		case 'RefOrder':
			refOrderBtnClick.bind(this)();
			break;
		case 'RefSubcont':
			refSubcontBtnClick.bind(this)();
			break;
		case 'ReturnOrder':
			returnOrderBtnClick.bind(this)();
			break;
		case 'ReturnSubcont':
			returnSubcontBtnClick.bind(this)();
			break;
		case 'ReturnArrival':
			returnArrivalBtnClick.bind(this)();
			break;
		case 'QueryAboutBusiness':
			queryAboutBusinessBtnClick.bind(this)();
			break;
		case 'Print':
			printBtnClick.bind(this)();
			break;
		case 'OutPrint':
			outPrintBtnClick.bind(this)();
			break;
		case 'AccessoryManage':
			accessoryManageBtnClick.bind(this)();
			break;
		case 'ApproveInfo':
			approveInfoBtnClick.bind(this)();
			break;
		case 'SplitPrint':
			splitPrintClick.call(this, this.props);
			break;
		case 'CombinPrint':
			combinPrintClick.call(this, this.props);
			break;
		case 'Refresh':
			refreashBtnClick.bind(this)();
			break;
		case 'MaterialAssign':
			sysModuleCheck.call(this, NCModule.RUM, getLangByResId(this, '4004ARRIVAL-000064'), () => {
				materialAssignBtnClick.call(this, this.props);
			});
			break;
		case 'Quit':
			quitBtnClick.bind(this)();
			break;
		case 'StockQuery':
			stockQuery.bind(this)();
			break;
		case 'UrgentLetGo':
			urgentLetGo.call(this, props);
			break;
		case 'PrintCountQuery':
			let CONST = { hid: FIELD.pk_arriveorder, area: AREA.form };
			printCountQuery.call(this, props, { type: 2, CONST, modal: 'code-config' });
			break;
		default:
			break;
	}
}
