/*
 * @Author: chaiwx 
 * @PageInfo: 联查预算联查初始化模板  
 * @Date: 2018-04-10 12:21:36 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-24 11:33:39
 */
import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST } from '../../const';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
const { init, initQuery } = transtypeUtils;
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: ARSUB_CONST.budgetPageId //列表页面编码
		},
		callbackFun
	);
	function callbackFun(data) {
		if (data) {
			if (data.context) {
				// 发布交易类型处理 add by guozhq
				init.call(_this, data.context);
			}
			if (data.template) {
				let meta = data.template;
				// modifierMeta.call(_this, props, meta);
				props.meta.setMeta(meta);
			}

			setData.call(_this, props);
		}
	}
}

function setData(props) {
	let id = this.props.getUrlParam('pk_ntbparadimvo');
	this.props.editTable.setStatus(ARSUB_CONST.budgetTableId, 'browse');
	ajax({
		url: ARSUB_CONST.budgetQueryUrl,
		data: {
			pks: [ id ],
			pageid: ARSUB_CONST.budgetPageId
		},
		success: (res) => {
			if (res.success) {
				if (res.data && res.data[ARSUB_CONST.budgetTableId]) {
					this.props.editTable.setTableData(ARSUB_CONST.budgetTableId, res.data[ARSUB_CONST.budgetTableId]);
				} else {
					this.props.editTable.setTableData(ARSUB_CONST.budgetTableId, { rows: [] });
				}
			}

			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
		}
	});
}
