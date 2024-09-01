import outPutClick from '../btnClicks/outPutClick';
import unOutPutClick from '../btnClicks/unOutPutClick';
import refreshBtnClick from '../btnClicks/refreshBtnClick';
import { BUTTON } from '../../constance/constance';

export default function btnClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		case BUTTON.OutPut: //输出
			return outPutClick.call(this);
		case BUTTON.UnOutPut: //反输出
			return unOutPutClick.call(this);
		case BUTTON.Refresh: //刷新
			return refreshBtnClick.call(this);
	}
}
