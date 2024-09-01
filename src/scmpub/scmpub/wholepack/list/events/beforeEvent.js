import { FIELDS, PAGEAREA } from '../constance';

export default function beforeEvent(props, moduleId, item, index, value, record) {
	let meta = props.meta.getMeta();
	meta[PAGEAREA.list].items.forEach((item) => {
		if (item.attrcode == FIELDS.cmaterialvid) {
			//按组织过滤,按照物料基本分类
			item.queryCondition = () => {
				let pk_org = this.state.pk_org.value;
				let cmaterialclass = record.values[FIELDS.cmaterialclass].value;
				let returnData = {};
				if (pk_org) {
					returnData.pk_org = pk_org;
				}
				if (cmaterialclass) {
					returnData.pk_marbasclass = cmaterialclass;
				}
				return returnData;
			};
		}
	});
	props.meta.setMeta(meta);
	return true;
}
