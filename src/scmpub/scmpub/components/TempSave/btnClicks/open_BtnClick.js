/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-30 16:05:25
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-04-08 15:23:16
 */

export default function open_BtnClick(props, record, index) {
	let addcallback = this.props.clickTemporary;
	if (addcallback) {
		addcallback(this.props.parentProps, this.state.tempDataList.rows[index].values.data.value);
	}
	this.props.close();
}
