/*
 * @Author: 王龙华
 * @PageInfo: 刷新按钮点击事件
 * @Date: 2019-01-08 16:16:08
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-07-18 09:58:40
 */
import commonSearch_BtnClick from './commonSearch_BtnClick';
export default function refresh_BtnClick(props) {
	commonSearch_BtnClick.call(this, this.mainorgvalue, true);
}
