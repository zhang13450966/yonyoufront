/*
 * @Author: CongKe
 * @PageInfo: 退出转单
 * @Date: 2018-07-05 13:49:11
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-26 10:21:51
 */
import {
	URL,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	TRANSFER,
	PAGECODE,
	OrderCache,
	TRANSFER49,
} from '../../constance';
import { showQuitTransferWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { buttonController } from '../viewController/index';

export default function quitTransferButton(props) {
	let allprocess = this.props.transferTable.getTransformFormStatus(PAGECODE.leftarea);
	if (allprocess === false) {
		showQuitTransferWarningDialog({
			/* 国际化处理： 退出转单,有未保存的单据，确定要退出转单吗?*/
			beSureBtnClick: () => {
				quitTransfer.call(this);
			},
		});
	} else {
		quitTransfer.call(this);
	}
}

function quitTransfer() {
	// 退出转单时移除浏览器监听提示
	window.removeEventListener('beforeunload', this.onMove);
	// 场景
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	let transfer = this.props.getUrlParam(TRANSFER.transfer);
	//推单标识
	let channelType = this.props.getUrlParam(TRANSFER.channelType);
	//如果是推单过来的直接返回到
	if (channelType) {
		this.props.pushTo(this.state.returnURL, {
			type: this.state.returnType,
			appcode: this.state.appcode,
		});
	} else if (transfer && scene != null) {
		buttonController.gobackTransferPage.call(this, this.props, transfer);
	} else {
		this.props.pushTo(URL.gotoList);
	}
}
