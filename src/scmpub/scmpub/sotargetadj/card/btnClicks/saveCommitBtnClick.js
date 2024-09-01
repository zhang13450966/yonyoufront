/*
 * @Author: zhangchangqing 
 * @PageInfo: 保存提交按钮事件
 * @Date: 2018-04-19 10:35:13 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 11:23:54
 */
import saveBtn from './saveBtnClick';
import commitBtnClick from './commitBtnClick';
export default function clickSaveBtn(props) {
	saveBtn.call(this, props, commitBtnClick);
}
