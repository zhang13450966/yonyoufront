/* 
* @Author: lichaoah  
* @PageInfo:指标名称编辑后   
* @Date: 2020-03-05 18:06:18  
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-11-27 15:59:34
*/
import { getLangCode } from 'nc-lightapp-front';
import { TARGET_CARD } from '../../siconst';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function targetNameBodyAfterEvent(props, moduleId, key, value, index) {
	let names = props.cardTable.getColValue(moduleId, key);
	let langCode = getLangCode();
	let nameField =
		langCode == 'simpchn'
			? TARGET_CARD.vtargetname
			: langCode == 'english' ? TARGET_CARD.vtargetname1 : TARGET_CARD.vtargetname2;
	names.map((name, i) => {
		if (i != index && name && value && value[nameField] && name.value == value[nameField].value) {
			showWarningInfo(undefined, getLangByResId(this, '4001TARGET-000010')); /* 国际化处理： 同一指标表内指标项名称不能重复*/
		}
	});
}
