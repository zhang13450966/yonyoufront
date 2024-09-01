import initData from '../init/initData';
import { showHasQueryResultInfo, showNoQueryResultInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props) {
	initData.call(this, props, {
		success: (length) => {
			showHasQueryResultInfo(length);
		},
		failure: () => {
			showNoQueryResultInfo();
		}
	});
}
