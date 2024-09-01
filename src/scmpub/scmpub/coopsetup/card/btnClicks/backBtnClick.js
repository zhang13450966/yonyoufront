/*
 * @Author: yechd5 
 * @PageInfo: 卡片态返回按钮事件
 * @Date: 2018-05-24 18:39:38 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2021-03-19 14:59:46
 */
import { COOPSETUP_CONST } from '../../const';

export default function clickBackBtn(props) {
	props.pushTo(COOPSETUP_CONST.TOLISTURL, {});
}
