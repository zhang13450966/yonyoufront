import { PAGECODE } from '../../constance';
import headBeforeEvent from './headBeforeEvent';
// import bodyBeforeEvent from './bodyBeforeEvent';
export default function beforeEvent(props, moduleId, key, value, index, record) {
	if (moduleId == PAGECODE.cardhead) {
		return headBeforeEvent.call(this, props, moduleId, key, value);
	} else if (moduleId == PAGECODE.cardbody || moduleId == PAGECODE.cardbodyano) {
		// return bodyBeforeEvent.call(this, props, moduleId, key, value, index, record);
	}
}
