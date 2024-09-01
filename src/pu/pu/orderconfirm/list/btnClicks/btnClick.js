import { BUTTON_ID } from '../../constance';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';

export default function(props, buttonid) {
	switch (buttonid) {
		case BUTTON_ID.Refresh:
			refreshBtnClick.call(this, props);
			break;
		case BUTTON_ID.Print:
			printBtnClick.call(this, props);
			break;
	}
}
