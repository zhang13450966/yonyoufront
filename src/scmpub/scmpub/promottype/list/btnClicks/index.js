import addBtnClick from './addBtnClick';
import saveBtnClick from './saveBtnClick';
import editBtnClick from './editBtnClick';
import commonSearch from './commonSearch';
import printBtnClick from './pintBtnClick';
import { BTNID } from '../constance/index';
import deleteBtnClick from './deleteBtnClick';
import cancelBtnClick from './cancelBtnClick';

function btnClick(props, key, record, index, isLine) {
	switch (key) {
		case BTNID.add:
			addBtnClick.call(this, props);
			break;
		case BTNID.del:
			deleteBtnClick.call(this, props, record, index, isLine);
			break;
		case BTNID.edit:
			editBtnClick.call(this, props, index, isLine);
			break;
		case BTNID.refresh:
			commonSearch.call(this, props, true);
			break;
		case BTNID.print:
			printBtnClick.call(this, props);
			break;
		case BTNID.output:
			printBtnClick.call(this, props, true);
			break;
		case BTNID.save:
			saveBtnClick.call(this, props);
			break;
		case BTNID.cancel:
			cancelBtnClick.call(this, props);
			break;
	}
}

export { btnClick, commonSearch };
