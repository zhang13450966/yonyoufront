/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，新增按钮
 * @Date: 2021-11-20 10:36:46 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-01-11 11:30:25
 */
import { buttonController } from '../viewController';
import { AREA, UISTATE, CONSTFIELD, TRANSFER2C } from '../../constance';
import { clearTransferCache, changeUrlParam, getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
export default function addBtnClick(props) {
	// TODO:新增逻辑应该是跳转到拉单页面的，这里先写成自制的，后续跳转
	// props.pushTo(URL.transfer, {
	// 	status: UISTATE.edit,
	// 	pagecode: PAGECODE.transFrom21List
	// });

	// 临时代码，后续删除  begin
	// 清空form区内容
	// props.form.EmptyAllFormValue(AREA.head);
	// //删除表体数据
	// props.cardTable.setTableData(AREA.body, { rows: [] });
	// this.status = UISTATE.add;
	// buttonController.call(this, this.props);
	//清除缓存
	clearTransferCache(props, CONSTFIELD.PlanconfirmTransferCache);
	props.pushTo(TRANSFER2C.GOTO2C, { pagecode: TRANSFER2C.PAGEID });

	// 临时代码，后续删除  edn
}
