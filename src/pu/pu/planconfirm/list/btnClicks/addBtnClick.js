/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，新增按钮
 * @Date: 2021-11-19 15:06:20 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-01-11 13:36:27
 */
import { AREA, URL, UISTATE, PAGECODE, CONSTFIELD, TRANSFER2C } from '../../constance';
import { clearTransferCache, changeUrlParam, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function addBtnClick(props) {
	// URL.transfer
	// props.pushTo(URL.transfer, {
	// 	status: UISTATE.edit,
	// 	pagecode: PAGECODE.transFrom21List
	// });

	// URL.card 是错的，是为了先做功能先跳转到卡片页面
	// props.pushTo(URL.card, {
	// 	status: UISTATE.edit
	// });
	clearTransferCache(props, CONSTFIELD.PlanconfirmTransferCache);
	props.pushTo(TRANSFER2C.GOTO2C, { pagecode: TRANSFER2C.PAGEID });
}
