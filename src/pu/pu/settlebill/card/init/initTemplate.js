/*
 * @Author: zhangshqb 
 * @PageInfo: 采购结算单卡片界面  
 * @Date: 2018-06-10 14:48:34 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-02-26 15:11:29
 */
import { PAGECODE, FIELD } from '../../constance';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.cardcode
		},
		callbackFun
	); //模板pageid //应用id

	function callbackFun(templedata) {
		if (templedata) {
			if (templedata.template) {
				let meta = templedata.template;
				columnSortUtils.numberSort(meta, PAGECODE.cardbody, FIELD.crowno);
				props.meta.setMeta(meta);
			}
			if (templedata.button) {
				let button = templedata.button;
				props.button.setButtons(button);
			}
		}
	}
}
