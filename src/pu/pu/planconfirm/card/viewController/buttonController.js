/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单卡片，按钮状态控制，页面状态控制
 * @Date: 2021-11-20 10:40:57 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-30 17:37:18
 */
import { UISTATE, OHTER, FIELD, BTNID, AREA } from '../../constance';
/**
 * 主方法，会调用其他所有的方法，用于页面刷新状态的调用
 */
export default function buttonController(props, status) {
	//分单 需要对另外单据重新设置status
	if (status) {
		this.status = status;
	}
	//1、设置界面状态
	setUIState.call(this, props);
	//2、设置按钮的显示隐藏
	setCardButtonVisiable.call(this, props);
	//3、设置主按钮
	setMainButton.call(this, props, this.status);
	//4、返回按钮的显示隐藏
	setBackButtonVisible.call(this, props);
	//5、设置按钮的可用
	setCardButtonDisable.call(this, props);
}
/**
 * 1、设置界面状态
 * @param {*} props 
 */
function setUIState(props) {
	let status = this.status || UISTATE.browse;
	if (status == UISTATE.add || status == UISTATE.edit) {
		// 编辑态
		props.form.setFormStatus(AREA.head, UISTATE.edit);
		props.cardTable.setStatus(AREA.body, UISTATE.edit);
	} else {
		// 浏览态
		props.form.setFormStatus(AREA.head, UISTATE.browse);
		props.cardTable.setStatus(AREA.body, UISTATE.browse);
	}
}

/**
 * 2、设置按钮的显示隐藏
 * @param {*} props 
 */
function setCardButtonVisiable(props) {
	// 页面状态，控制非流程按钮状态
	let pageFlag = this.status == UISTATE.browse ? true : false;
	// 场景标志：如果是approvesce，则表明是审批中心过来的
	let scene = props.getUrlParam(OHTER.scene);
	// 单据状态
	let billflag = props.form.getFormItemsValue(AREA.head, FIELD.fbillstatus).value;
	// 获取表头主键，如果获取不到，说明页面没有数据，这时，页面空白页、只展示新增按钮
	let hid = props.form.getFormItemsValue(AREA.head, FIELD.hid);
	let hidFlag = false; // 表头有主键时，为true，否则为false
	if (hid && hid.value) {
		hidFlag = true;
	}
	// 控制卡片页面右上角的翻页按钮显示隐藏的逻辑
	this.setState({
		cardPaginationShow: pageFlag && hidFlag
	});
	/**
	 * 自由=0,提交-1，审批中=2,审批通过=3,审批未通过=4
	 * 
	 * 复制按钮特殊控制，当单据表头勾选复验时，不允许复制
	 */
	let btns = {
		[BTNID.Add]: scene == OHTER.approve ? false : pageFlag,
		[BTNID.Edit]:
			scene == OHTER.approve
				? pageFlag && pageFlag && [ '2' ].includes(billflag)
				: pageFlag && [ '0', '4' ].includes(billflag) && hidFlag,
		[BTNID.Delete]: scene == OHTER.approve ? false : pageFlag && [ '0' ].includes(billflag) && hidFlag,
		[BTNID.Commit]: scene == OHTER.approve ? false : pageFlag && billflag == '0' && hidFlag,
		[BTNID.UnCommit]: scene == OHTER.approve ? false : pageFlag && [ '2', '3' ].includes(billflag) && hidFlag,
		[BTNID.File]: pageFlag && hidFlag,
		[BTNID.Link]: pageFlag && hidFlag,
		[BTNID.BillLink]: pageFlag && hidFlag,
		[BTNID.ApproveDetail]: scene == OHTER.approve ? false : pageFlag && hidFlag,
		[BTNID.Print]: pageFlag && hidFlag,
		[BTNID.Output]: pageFlag && hidFlag,
		[BTNID.PrintCountQuery]: pageFlag && hidFlag,
		[BTNID.Refresh]: pageFlag && hidFlag,
		[BTNID.Save]: !pageFlag,
		[BTNID.SaveCommit]: scene == OHTER.approve ? false : !pageFlag,
		[BTNID.Cancel]: !pageFlag,
		[BTNID.DeleteLine]: !pageFlag,
		[BTNID.ResetRowNo]: !pageFlag
	};
	props.button.setButtonVisible(btns);
}

/**
 * 3、设置主按钮(不需要代码设置)
 * @param {*} props 
 * @param {*} status 
 */
function setMainButton(props) {
	/**
	 * 单据状态：自由=0,提交=1,正在审批=2,审批通过=3,审批未通过=4
	 * 审批不通过时，修改按钮为主按钮
	 */
	let billflag = props.form.getFormItemsValue(AREA.head, FIELD.fbillstatus).value;
	if (billflag == '4') {
		props.button.setMainButton(BTNID.Edit, true);
	} else {
		props.button.setMainButton(BTNID.Edit, false);
	}
}

/**
 * 4、返回按钮的显示隐藏
 * @param {*} props
 */
function setBackButtonVisible(props) {
	let uistate = this.status;
	let vbillcode = props.form.getFormItemsValue(AREA.head, FIELD.vbillcode).value;
	// 获取表头主键，如果获取不到，说明页面没有数据，这时，页面空白页、只展示新增按钮
	let hid = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;

	// 场景标志：如果是approvesce，则表明是审批中心过来的
	let scene = props.getUrlParam(OHTER.scene);

	let showBackBtn = false; // 显示返回按钮标志，true为显示
	let showBillCode = false; // 显示单据编号标志，true为显示
	let billCode = vbillcode;
	if (uistate == UISTATE.edit) {
		/**
		 * 编辑态，通过表头是否有主键区分新增还是修改
		 * 1、有主键时，表示修改，修改需要隐藏返回按钮，展示单据号
		 * 2、无主键时，表示新增，返回按钮、单据号都要隐藏
		 */
		if (hid) {
			// 1、有主键，修改
			showBackBtn = false; // 显示返回按钮标志，true为显示
			showBillCode = true; // 显示单据编号标志，true为显示
			billCode = vbillcode;
		} else {
			// 2、无主键，新增
			showBackBtn = true; // 显示返回按钮标志，true为显示
			showBillCode = false; // 显示单据编号标志，true为显示
			billCode = '';
		}
	} else if (uistate == UISTATE.copy) {
		// 复制和新增同逻辑，返回按钮、单据号都要隐藏
		showBackBtn = false; // 显示返回按钮标志，true为显示
		showBillCode = false; // 显示单据编号标志，true为显示
		billCode = '';
	} else if (uistate == UISTATE.browse) {
		/**
		 * 浏览态时，页面有数据，显示返回按钮，显示单据号
		 * 浏览态时，页面无数据，显示返回按钮，清空单据号
		 * 审批中心过来的单据不展示返回按钮
		 */
		showBackBtn = scene == OHTER.approve ? false : true;
		showBillCode = vbillcode ? true : false;
		billCode = vbillcode;
	}
	// 设置返回按钮
	props.BillHeadInfo.setBillHeadInfoVisible({
		showBackBtn: showBackBtn, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
		showBillCode: showBillCode, //控制显示单据号：true为显示,false为隐藏 ---非必传
		billCode: billCode //修改单据号---非必传
	});

	// websocket错误交互添加，控制错误提示感叹号的显示隐藏 begin
	let saga_status = props.form.getFormItemsValue(AREA.head, FIELD.saga_status);
	let pk_planconfirm = props.form.getFormItemsValue(AREA.head, FIELD.hid).value; // 界面有主键的时候，说明有数据，无数据的时候不展示红色按钮
	if (uistate == UISTATE.browse && saga_status && saga_status.value == 1 && pk_planconfirm) {
		props.button.toggleErrorStatus(AREA.head, {
			isError: true
		});
	} else {
		props.button.toggleErrorStatus(AREA.head, {
			isError: false
		});
	}
	// websocket错误交互添加，控制错误提示感叹号的显示隐藏 end
}

/**
 * 5、设置按钮的可用
 * @param {*} props 
 */
export function setCardButtonDisable(props) {
	let deleteLineflag = true;
	let checkdatas = this.props.cardTable.getCheckedRows(AREA.body);
	if (checkdatas.length > 0) {
		deleteLineflag = false;
	}
	let buttonss = { [BTNID.DeleteLine]: deleteLineflag };
	props.button.setButtonDisabled(buttonss);
}
