/*
 * @Author: chaiwx 
 * @PageInfo: 保存提交 
 * @Date: 2018-04-11 17:50:22 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-10-23 19:00:48
 */
import saveBtnClick from './saveBtnClick';
import commitBtnClick from './commitBtnClick';

export default function saveCommitBtnClick(props) {
	//优先执行保存接口
	saveBtnClick.call(this, props, commitBtnClick);
}
