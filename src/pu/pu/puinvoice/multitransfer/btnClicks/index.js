import search21BtnClick from './search21BtnClick';
import search4TBtnClick from './search4TBtnClick';
import search45BtnClick from './search45BtnClick';
import refreshBtnClick from './refreshBtnClick';
import selected_BtnClick from './selected_BtnClick';
import searchAllBtnClick from './searchAllBtnClick';
import scanBtnClick from './scanBtnClick';

import { BUTTONID } from '../../constance';

function btnClick(props, buttonid, text, record, index) {
	switch (buttonid) {
		// 刷新
		case BUTTONID.Refresh:
			return refreshBtnClick.call(this);
		// 扫码拉单
		case BUTTONID.ScanTransfer:
			return this.scanTransfer.call(this);
	}
}

export {
	search21BtnClick,
	search4TBtnClick,
	search45BtnClick,
	selected_BtnClick,
	searchAllBtnClick,
	btnClick,
	scanBtnClick
};
