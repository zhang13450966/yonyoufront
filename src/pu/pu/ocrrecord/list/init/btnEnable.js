/*
 * 按钮可用状态
 * @Author: zhangbfk
 * @Date: 2018-07-05 15:44:24 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:47:41
 */
import { BUTTONID, BUTTONSTATE, UISTATE } from '../../constance';

function buttonCntrol(scene, enabledFlag, status) {
	if (scene === BUTTONSTATE.INIT) {
		initBtnEnableCtrl.call(this, enabledFlag);
	} else if (scene === BUTTONSTATE.HASORG) {
		hasOrgBtnEnableCtrl.call(this, enabledFlag);
	} else if (scene === BUTTONSTATE.DELETE_SUCCESS) {
		deleteSuccessBtnEnableCtrl.call(this, enabledFlag);
	} else if (scene === BUTTONSTATE.HASSELECTEDATA) {
		hasSelectDataBtnEnableCtrl.call(this, enabledFlag);
	}
}

function initBtnEnableCtrl(enabledFlag) {
	this.props.button.setDisabled(
		[
			BUTTONID.OCRScan,
			BUTTONID.OCRCheck,
			BUTTONID.Delete,
			BUTTONID.Import,
			BUTTONID.CreateInvoice,
			BUTTONID.ImageShow
		],
		enabledFlag
	);
}

function hasOrgBtnEnableCtrl(enabledFlag) {
	this.props.button.setDisabled([ BUTTONID.OCRScan, BUTTONID.Import ], enabledFlag);
}

function deleteSuccessBtnEnableCtrl(enabledFlag) {
	hasSelectDataBtnEnableCtrl.call(this, enabledFlag);
}

function hasSelectDataBtnEnableCtrl(enabledFlag) {
	this.props.button.setDisabled(
		[ BUTTONID.OCRCheck, BUTTONID.Delete, BUTTONID.CreateInvoice, BUTTONID.ImageShow ],
		enabledFlag
	);
}

function btnVisibleCtrl(status) {
	let state = status == UISTATE.browse;
	this.props.button.setButtonVisible([ BUTTONID.Save, BUTTONID.Cancel ], !state);
	this.props.button.setButtonVisible([ BUTTONID.Edit, BUTTONID.Import, BUTTONID.Print, BUTTONID.Refresh ], state);
}

export { btnVisibleCtrl, buttonCntrol };
