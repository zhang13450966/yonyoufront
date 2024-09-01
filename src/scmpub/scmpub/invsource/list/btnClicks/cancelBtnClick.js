/*
 * @Author: 王龙华 
 * @PageInfo: 取消按钮点击事件
 * @Date: 2018-04-11 11:03:33 
 * @Last Modified by: 王龙华
 * @Last Modified time: 2018-10-22 16:14:41
 */
import { INVSOURCE_CONST } from '../../const';
import buttonController from '../../list/viewController/buttonController'
import { showCancelDialog } from '../../../pub/tool/messageUtil';

export default function cancelBtnClick(props) {
	showCancelDialog({
		beSureBtnClick: cancelBtn.bind(this, props)
	});	
}
function cancelBtn(props){
	props.editTable.cancelEdit(INVSOURCE_CONST.TABLEID);
	buttonController.call(this, props, INVSOURCE_CONST.BROWSER_STATUS)
};
