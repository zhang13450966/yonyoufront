import multiCorpRefHandler from '../../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { FIELD } from '../../constance';

export default function(props, field, value, searchId) {
	if (field === FIELD.pk_org) {
		multiCorpRefHandler(props, value, searchId, [ FIELD.pk_material, FIELD.pk_marbasclass ]);
	}
}
