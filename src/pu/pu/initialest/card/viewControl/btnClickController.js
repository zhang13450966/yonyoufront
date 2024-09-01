import { PAGECODE, BODY_FIELD } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import backBtnClick from '../btnClicks/backBtnClick';
import canelBtnClick from '../btnClicks/canelBtnClick';
import deleteBtnClick from '../btnClicks/deleteBtnClick';
import editBtnClick from '../btnClicks/editBtnClick';
import saveBtnClick from '../btnClicks/saveBtnClick';
import addRowBtnClick from '../btnClicks/addRowBtnClick';
import delRowBtnClick from '../btnClicks/delRowBtnClick';
import addBtnClick from '../btnClicks/addBtnClick';
import pageInfoClick from '../btnClicks/pageInfoClick';
import unfoldBtnClick from '../btnClicks/unfoldBtnClick';
import billTraceAbility from '../btnClicks/billTraceAbility';
import approveBtnClick from '../btnClicks/approveBtnClick';
import attachManageBtnClick from '../btnClicks/attachManageBtnClick';
import { CARD_BUTTON } from '../../constance';
import quitTransferBtnClick from '../btnClicks/quitTransferBtnClick';
import unapproveBtnClick from '../btnClicks/unapproveBtnClick';
import puorderBtnClick from '../btnClicks/puorderBtnClick';
import copyBtnClick from '../btnClicks/copyBtnClick';
import print_BtnClick from '../btnClicks/print_BtnClick';
import delLineRowBtnClick from '../btnClicks/delLineRowBtnClick';
import reNumberBtnClick from '../btnClicks/reNumberBtnClick';
import unfoldEditBtnClick from '../btnClicks/unfoldEditBtnClick';
import copyLineBtnClick from '../btnClicks/copyLineBtnClick';
import copyRowLineBtnClick from '../btnClicks/copyRowLineBtnClick';
import cancelCopyLine from '../btnClicks/cancelCopyLine';
import refreshBtnClick from '../btnClicks/refreshBtnClick';
import pastetolastBtnClick from '../btnClicks/pastetolastBtnClick';
import pastehereBtnClick from '../btnClicks/pastehereBtnClick';
import exportBtnClick from '../btnClicks/exportBtnClick';
import outputBtnClick from '../btnClicks/outputBtnClick';
import backTransferBtnClick from '../btnClicks/backTransferBtnClick';
export {
	addBtnClick,
	canelBtnClick,
	backBtnClick,
	deleteBtnClick,
	editBtnClick,
	saveBtnClick,
	addRowBtnClick,
	delRowBtnClick,
	pageInfoClick,
	unfoldBtnClick,
	billTraceAbility,
	approveBtnClick,
	attachManageBtnClick,
	quitTransferBtnClick,
	unapproveBtnClick,
	puorderBtnClick,
	copyBtnClick,
	print_BtnClick,
	delLineRowBtnClick,
	reNumberBtnClick,
	unfoldEditBtnClick,
	copyLineBtnClick,
	copyRowLineBtnClick,
	cancelCopyLine,
	refreshBtnClick,
	pastetolastBtnClick,
	pastehereBtnClick,
	exportBtnClick,
	outputBtnClick,
	backTransferBtnClick
};
export default function buttonClick(props, id, text, record, index) {
	switch (id) {
		// 新增行
		case CARD_BUTTON.AddLine:
			return addRowBtnClick(props);
		//审批已通过新增
		case CARD_BUTTON.Selfmake:
			addBtnClick.bind(this, props)();
			break;
		//卡片态复制
		case CARD_BUTTON.Copy:
			copyBtnClick.bind(this, props)();
			break;
		//拉采购订单
		case CARD_BUTTON.Puorder:
			puorderBtnClick.call(this, props);
			break;
		//删行
		case CARD_BUTTON.DeleteLine:
			return delRowBtnClick(props, record, index);
		//行内复制行
		case CARD_BUTTON.copyLine:
			copyRowLineBtnClick.call(this, props, index);
			break;
		//肩上复制行
		case CARD_BUTTON.CopyLine:
			copyLineBtnClick.call(this, props, index);
			break;
		//浏览态行内展开
		case CARD_BUTTON.Unfold:
			unfoldBtnClick.bind(this, props, record, index)();
			break;
		//编辑态行内展开
		case CARD_BUTTON.unfold:
			unfoldEditBtnClick.bind(this, props, record, index)();
			break;
		//行内插行
		case CARD_BUTTON.InsertLine:
			props.cardTable.addRow(PAGECODE.cardbody, index);
			RownoUtils.setRowNo(props, PAGECODE.cardbody, BODY_FIELD.crowno);
			break;
		//肩部粘贴至末行
		case CARD_BUTTON.Pastetolast:
			pastetolastBtnClick.call(this, props);
			break;
		// 粘贴至此
		case CARD_BUTTON.Pastehere:
			pastehereBtnClick.call(this, props, index);
			break;
		//行内删行Pastetolast
		case CARD_BUTTON.deleteLine:
			delLineRowBtnClick.call(this, props, index);
			break;
		// 取消
		case CARD_BUTTON.Cancel:
			canelBtnClick.bind(this, props)();
			break;
		// 返回
		case 'back':
			return backBtnClick(props);
		// 修改
		case CARD_BUTTON.Edit:
			editBtnClick.bind(this, props)();
			break;
		// 删除
		case CARD_BUTTON.Delete:
			deleteBtnClick.bind(this, props, record)();
			break;
		// 保存
		case CARD_BUTTON.Save:
			let save = saveBtnClick.bind(this);
			return save(props);
		// 重排行号
		case CARD_BUTTON.Renumber:
			reNumberBtnClick.call(this, props);
			break;
		//卡片自由态单据追溯
		case CARD_BUTTON.BillTraceability:
			billTraceAbility.call(this, this.props);
			break;
		// 审批
		case CARD_BUTTON.Approve:
			approveBtnClick.call(this, this.props);
			break;
		//自由态附件管理
		case CARD_BUTTON.AttaMange:
			attachManageBtnClick.call(this);
			break;
		//退出转单
		case CARD_BUTTON.quitTransfer:
			quitTransferBtnClick.call(this, props);
			break;
		//取消审批
		case CARD_BUTTON.UnApprove:
			unapproveBtnClick.call(this, this.props);
			break;
		//打印
		case CARD_BUTTON.Print:
			print_BtnClick.call(this, this.props);
			break;
		//取消复制行
		case CARD_BUTTON.Cancelcopyline:
			cancelCopyLine.call(this, this.props);
			break;
		//卡片自由态刷新
		case CARD_BUTTON.Refresh:
			refreshBtnClick.call(this, this.props);
			break;
		//导出
		case CARD_BUTTON.Export:
			exportBtnClick.call(this);
			break;
		//输出
		case CARD_BUTTON.Output:
			outputBtnClick.call(this, props);
			break;
	}
}
