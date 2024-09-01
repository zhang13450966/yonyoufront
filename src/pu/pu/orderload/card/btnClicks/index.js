import { BUTTONID, URL } from '../../constance';
import backBtnClick from './backBtnClick';
import pageInfoClick from './pageInfoClick';
import handleCardBtnClick from './handleCardBtnClick';
import printBtnclick from './printBtnClick';

function buttonClick(props, id) {
	switch (id) {
		case BUTTONID.Back: //返回
			backBtnClick.call(this, props);
			break;
		case BUTTONID.Refresh: //刷新
			pageInfoClick.call(this, this.props, null, true);
			break;
		case BUTTONID.Load: //装运
			handleCardBtnClick.call(this, this.props, URL.load);
			break;
		case BUTTONID.UNLoad: //反装运
			handleCardBtnClick.call(this, this.props, URL.unload);
			break;
		case BUTTONID.Print: // 打印
			printBtnclick.call(this, this.props);
	}
}

export { buttonClick, pageInfoClick };
