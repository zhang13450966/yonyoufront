import { BUTTONID } from '../../constance';
import backBtnClick from './backBtnClick';
import pageInfoClick from './pageInfoClick';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';
import outCustomBtnClick from './outCustomBtnClick';
import unOutCustomBtnClick from './unOutCustomBtnClick';

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
		case BUTTONID.OutCustom:
			outCustomBtnClick.call(this, props);
			break;
		case BUTTONID.UnOutCustom:
			unOutCustomBtnClick.call(this, props);
			break;
	}
}

export { buttonClick, pageInfoClick };
