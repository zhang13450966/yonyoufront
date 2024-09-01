import refreshBtnClick from './refreshBtnClick';
import { BUTTONID } from '../../constance';

function btnClick(props, buttonid, record, index) {
	switch (buttonid) {
		case BUTTONID.Refresh:
			return refreshBtnClick.call(this);
	}
}

export { btnClick };
