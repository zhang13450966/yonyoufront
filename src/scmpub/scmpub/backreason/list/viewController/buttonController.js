/*
 * 按钮控制器
 * @Author: zhngzh 
 * @Date: 2019-04-22 09:23:49 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-07-10 16:41:34
 */
import { BUTTONS, UISTATE } from '../constance';
import { setButtonsEnable } from './index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props, status = UISTATE.browse) {
	if (status == UISTATE.browse) {
		//浏览态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: true, //修改
			[BUTTONS.Print]: true, //打印
			[BUTTONS.Add]: true, //新增
			[BUTTONS.Delete]: true, //删除
			[BUTTONS.Refresh]: true, //刷新
			[BUTTONS.Output]: true, //输出
			[BUTTONS.Save]: false,
			[BUTTONS.Cancel]: false
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete, getLangByResId(this, '4001BACKREASON-000011')); /* 国际化处理： 确定要删除吗？*/
	} else if (status == UISTATE.edit) {
		//编辑态按钮状态
		let visibleBtns = {
			[BUTTONS.Edit]: false,
			[BUTTONS.Print]: false,
			[BUTTONS.Add]: true,
			[BUTTONS.Delete]: true,
			[BUTTONS.Refresh]: false,
			[BUTTONS.Save]: true,
			[BUTTONS.Cancel]: true
		};
		props.button.setButtonsVisible(visibleBtns);
		props.button.setPopContent(BUTTONS.Delete);
	}
	setButtonsEnable.call(this, props, status);
}
