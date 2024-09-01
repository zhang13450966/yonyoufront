import searchBtnClick from './searchBtnClick';
import pageInfoBtnClick from './pageInfoBtnClick';
import refreshBtnClick from './refreshBtnClick';
import printBtnClick from './printBtnClick';
import { BUTTONID } from '../../constance';

function buttonClick(props, id) {
	switch (id) {
		case BUTTONID.Print:
			printBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh:
			refreshBtnClick.call(this, props);
			break;
	}
}

export { buttonClick, searchBtnClick, pageInfoBtnClick };
