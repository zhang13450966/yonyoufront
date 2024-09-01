/**
 * 附件
 * @param {} props
 */
export default function fileClick(props) {
	let flag = this.state.showUploader;
	this.setState({ showUploader: !flag });
}
