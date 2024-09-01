import search47BtnClick from './search47BtnClick';
import search61BtnClick from './search61BtnClick';
import selected_BtnClick from './selected_BtnClick';
import searchAllBtnClick from './searchAllBtnClick';
import clickBackBtn from '../../utils/backBtnClick';
import refreshBtnClick from './refreshBtnClick';
import { BUTTONID } from '../../constance';

function btnClick(props, buttonid, record, index) {
	switch (buttonid) {
		// 返回
		case BUTTONID.Back:
			return clickBackBtn.call(this);
		// 刷新
		case BUTTONID.Refresh:
			return refreshBtnClick.call(this);
	}
}

export { search61BtnClick, search47BtnClick, searchAllBtnClick, selected_BtnClick, btnClick };
