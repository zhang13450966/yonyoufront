/*
 * @Author: jiangfw
 * @PageInfo: 附件管理
 * @Date: 2018-07-02 16:56:15
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-07-02 20:38:42
 */
export default function docMngBtnClick() {
	let flag = this.state.showUploader;
	this.setState({
		showUploader: !flag,
		// target: event.target
	});
}
