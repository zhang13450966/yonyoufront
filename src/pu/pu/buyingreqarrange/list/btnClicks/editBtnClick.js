/*
 * @Author: zhangchangqing 
 * @PageInfo: 安排按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-04 10:49:40
 */
import { BUYINGREQ_LIST } from '../../siconst';
let formId = BUYINGREQ_LIST.formId; //'head';

export default function clickDelBtn(props) {
	// 获取选中行
	this.setState({
		showSearch: false,
		showCheck: false
	});
	this.props.editTable.selectAllRows(formId, false);
	this.toggleShow(BUYINGREQ_LIST.edit);
}
