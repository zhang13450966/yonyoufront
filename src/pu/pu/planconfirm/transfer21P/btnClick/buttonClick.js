/*
 * @Author: fangmj
 * @PageInfo: 采购订单付款计划生成进度确认单按钮事件
 * @Date: 2018-06-19 11:40:09 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-02-24 16:02:05
 */
import { BTNID } from '../../constance';
import { searchBtnClick, supplierremoteRequest } from './index.js';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, key, text, record, index) {
	switch (key) {
		case BTNID.Refresh: // 刷新
			searchBtnClick.call(this, null, true);
			break;
	}
}
