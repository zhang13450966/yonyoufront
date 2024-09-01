/*
 * @Author: jiangfw
 * @PageInfo: 冻结
 * @Date: 2018-06-13 21:16:59
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-24 08:59:19
 */
import { MODAL_ID } from '../../constance';
import beSureFreeze from './beSureFreeze';
import ScriptActionDlg from '../../../pub/ScriptActionDlg';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickFreezeBtn() {
	// 展示模态框
	this.props.modal.show(MODAL_ID.freezeModal, {
		title: getLangByResId(this, '4004PUINVOICE-000029') /* 国际化处理： 冻结原因*/,
		content: (
			<ScriptActionDlg
				changeData={value => {
					this.setState({ freezeReason: value });
				}}
				title={getLangByResId(this, '4004PUINVOICE-000030')} //{/*国际化处理： 请输入冻结原因*/}
			/>
		),
		size: 'sm',
		beSureBtnClick: beSureFreeze.bind(this), //点击确定按钮事件
		cancelBtnClick: () => this.props.modal.close(MODAL_ID.freezeModal), //取消按钮事件回调
		closeModalEve: () => this.props.modal.close(MODAL_ID.freezeModal), //关闭按钮事件回调
	});
}
