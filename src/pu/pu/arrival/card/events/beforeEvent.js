import { ajax, toast } from 'nc-lightapp-front';
import { URL, AREA, PAGEID } from '../../constance';
import headBeforeEditHandler from './headBeforeEditHandler';
import bodyBeforeEditHandler from './bodyBeforeEditHandler';
export default function beforeEvent(props, id, key, item, index, value, record) {
	// export default function beforeEvent(id, key, value, record) {
	if (id == AREA.form) {
		return headBeforeEditHandler.call(this, id, key, value, record);
	} else if (id == AREA.body) {
		return bodyBeforeEditHandler.call(this, id, key, value, record);
	}
}
