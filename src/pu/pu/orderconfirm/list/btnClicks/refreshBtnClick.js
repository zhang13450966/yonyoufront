import initData from '../init/initData';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props) {
	let messageFunction = () => {
		showSuccessInfo(null, '刷新成功!');
	};
	initData.call(this, props, { success: messageFunction, failure: messageFunction }, true);
}
