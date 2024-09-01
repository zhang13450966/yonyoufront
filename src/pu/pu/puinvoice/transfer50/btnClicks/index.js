import searchBtnClick from './searchBtnClick';
import backBtnClick from './backBtnClick';
import refreshBtnClick from './refreshBtnClick';
import { BUTTONID } from '../../constance';

function btnClick(props, buttonid, record, index) {
	switch (buttonid) {
		// 返回
		case BUTTONID.Back:
			return backBtnClick.call(this);
		case BUTTONID.Refresh:
			return refreshBtnClick.call(this);
	}
}

export { searchBtnClick, backBtnClick, btnClick };
