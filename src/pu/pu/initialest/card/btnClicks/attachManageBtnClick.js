/*
 * @Author: zhaochyu 
 * @PageInfo: 卡片附件管理 
 * @Date: 2018-06-30 14:43:06 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-02-13 16:13:12
 */
export default function() {
	//获取当前弹出框状态
	let flag = this.state.showUploader;
	this.setState({ showUploader: !flag /*, target: event.target */ });
}
