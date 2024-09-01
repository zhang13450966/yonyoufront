/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，卡片页面，取消按钮
 * @Date: 2021-11-23 19:22:17 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-06-08 16:42:35
 */
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import queryCardBtnClick from './queryCardBtnClick';
import { AREA, UISTATE, FIELD, OHTER, TRANSFER2C } from '../../constance';

export default function cancelBtnClick(props) {
	showCancelDialog({
		beSureBtnClick: () => {
			// 获取路径中的审批中心信息，标志是否是从审批中心进来的
			let scene = this.props.getUrlParam(OHTER.scene);
			// 将this中的status修改为浏览态，取消之后，标志页面是浏览状态
			this.status = UISTATE.browse;
			// 表单返回上一次的值
			props.form.cancel(AREA.head);
			// 表格返回上一次的值
			props.cardTable.resetTableData(AREA.body);
			let currentid = props.form.getFormItemsValue(AREA.head, FIELD.hid).value;
			//拉单标识
			let channelType = this.props.getUrlParam('channelType');
			if (!currentid) {
				//拉单 取消 返回拉单界面
				if (channelType && props.transferTable.getTransformFormAmount('leftarea') > 1) {
					// 转单-多条，取消固定写法
					props.transferTable.setTransformFormStatus(AREA.leftarea, {
						status: false,
						onChange: (current, next, currentIndex) => {
							delete this.indexstatus[currentIndex];
							let keys = Object.keys(this.indexstatus);
							let indexstatusTemp = {};
							keys.forEach((item, index) => {
								indexstatusTemp[index] = this.indexstatus[item];
							});
							this.indexstatus = indexstatusTemp;
						}
					});
				} else {
					this.props.pushTo(TRANSFER2C.GOTO2C, { app: TRANSFER2C.appcode, pagecode: TRANSFER2C.PAGEID });
				}
			} else {
				props.setUrlParam({
					status: UISTATE.browse,
					id: currentid,
					scene: scene
				});
				queryCardBtnClick.call(this, props, currentid);
			}
		}
	});
}
