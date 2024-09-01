/*
 * @Author: jiangfw 
 * @PageInfo: 刷新按钮
 * @Date: 2018-08-24 11:22:54 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-11-08 17:01:55
 */
import commonSerach from './commonSearch';

export default function clickRefreshBtn() {
	commonSerach.call(this, true); // 调用查询方法
}
