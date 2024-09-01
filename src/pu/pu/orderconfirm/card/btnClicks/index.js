import { BUTTONID, BUTTON_ID } from '../../constance';
import backBtnClick from './backBtnClick';
import pageInfoClick from './pageInfoClick';
import refreshBtnClick from './refreshBtnClick';
import confirmBtnClick from './confirmBtnClick';
import unConfirmBtnClick from './unConfirmBtnClick';
import printBtnClick from './printBtnClick';

function buttonClick(props, id) {
	switch (id) {
		case BUTTON_ID.BACK:
			backBtnClick.call(this, props);
			break;
		case BUTTON_ID.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTON_ID.Refresh:
			refreshBtnClick.call(this, props, true);
			break;
		case BUTTON_ID.Confirm:
			confirmBtnClick.call(this, props);
			break;
		case BUTTON_ID.UnConfirm:
			unConfirmBtnClick.call(this, props);
			break;
	}
}

export { buttonClick, pageInfoClick };
