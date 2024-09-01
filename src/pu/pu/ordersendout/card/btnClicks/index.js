import { BUTTONID } from '../../constance';
import backBtnClick from './backBtnClick';
import pageInfoClick from './pageInfoClick';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';
import sendoutBtnClick from './sendoutBtnClick';
import unSendoutBtnClick from './unSendoutBtnClick';

function buttonClick(props, id) {
	switch (id) {
		case BUTTONID.Back:
			backBtnClick.call(this, props);
			break;
		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case BUTTONID.SendOut:
			sendoutBtnClick.call(this, props);
			break;
		case BUTTONID.UnSendout:
			unSendoutBtnClick.call(this, props);
			break;
	}
}

export { buttonClick, pageInfoClick };
