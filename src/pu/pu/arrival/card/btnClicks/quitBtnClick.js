import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { URL, AREA, PAGECODE } from '../../constance';
import { showQuitTransferWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function(props) {
	let _this = this;
	let allprocess = _this.props.transferTable.getTransformFormStatus(AREA.leftarea);
	let url = URL.list;
	let pagecode = PAGECODE.head;
	if (_this.isrece == 'N') {
		url = '/ref21';
		pagecode = PAGECODE.transferOrder;
	}
	if (allprocess === false) {
		showQuitTransferWarningDialog({
			/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
			beSureBtnClick: () => {
				_this.props.cardTable.setStatus(AREA.body, 'browse');
				if (_this.srcappcode) {
					_this.props.pushTo(url, { appcode: _this.srcappcode, pagecode: pagecode });
				} else {
					_this.props.pushTo(url, { pagecode: pagecode });
				}
			}
		});
	} else {
		if (_this.srcappcode) {
			_this.props.pushTo(url, { appcode: _this.srcappcode, pagecode: pagecode });
		} else {
			_this.props.pushTo(url, { pagecode: pagecode });
		}
	}
	//
}
