/*
 * @Author: 刘奇 
 * @PageInfo: 浏览态编辑前事件  
 * @Date: 2018-05-25 09:44:49 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2022-04-21 09:40:55
 */
import { FIELD } from '../constance';
export default function table_BeforeEvent(props, moduleId, item, index, value, record) {
	let key = item.attrcode;
	let attrcode = item.attrcode;
	let meta = props.meta.getMeta();
	if (key == FIELD.cmaterialvid) {
		//物料编码
		if (!!record.values[FIELD.pk_batchcode].value) {
			return false;
		}
		let item = meta[moduleId].items.find((item) => item.attrcode == attrcode);
		item.queryCondition = () => {
			return {
				wholemanaflag: 'Y',
				GridRefActionExt: 'nccloud.web.scmpub.ref.MaterialMultiVersionGridRefFilterUtils'
			};
		};
		item.isShowUnit = true;
		props.meta.setMeta(meta);
		return true;
	} else if (key == FIELD.vbatchcode) {
		if (!!record.values[FIELD.pk_batchcode].value) {
			return false;
		}
	}
	return true;
}
