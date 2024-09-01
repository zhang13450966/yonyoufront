/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-11-02 14:29:58
 */
import { BUYINGREQ_LIST } from '../../siconst';
import refreshBtnClick from './refreshBtnClick';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function clickDelBtn() {
	// 弹出确认框
	showWarningDialog(
		getLangByResId(this, '4004PRAYBILLARRANGE-000010'),
		getLangByResId(this, '4004PRAYBILLARRANGE-000003'),
		{
			/* 国际化处理： 确认要取消吗？*/
			beSureBtnClick: () => {
				this.setState({
					showSearch: true
				});
				//点击取消重新刷新数据
				refreshBtnClick.bind(this)();
				this.toggleShow(BUYINGREQ_LIST.browse);
			}
		}
	);
}
