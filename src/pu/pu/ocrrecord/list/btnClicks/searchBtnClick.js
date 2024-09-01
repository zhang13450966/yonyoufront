/*
 * @Author: zhangbfk 
 * @PageInfo: 查询  
 * @Date: 2018-05-02 16:42:49 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:42:34
 */
import { ajax } from 'nc-lightapp-front';
import { BUTTONID, URL, AREA, FIELD, UISTATE, BUTTONSTATE } from '../../constance';
import {
	showWarningInfo,
	showRefreshInfo,
	showNoQueryResultInfo,
	showHasQueryResultInfo
} from 'src/scmpub/scmpub/pub/tool/messageUtil.js';
import { buttonCntrol } from '../init/btnEnable';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal, flag) {
	let queryInfo = props.search.getQueryInfo(AREA.searchArea);
	let pk_org = this.pk_org;
	if (pk_org) {
		let condition = {
			field: 'pk_org',
			value: {
				firstvalue: this.pk_org,
				secondvalue: null
			},
			oprtype: '='
		};
		if (searchVal == null) {
			searchVal = {
				conditions: [],
				logic: 'and'
			};
			searchVal.conditions.push(condition);
		} else {
			searchVal.conditions.push(condition);
		}
	} else {
		showWarningInfo(null, '主组织为空');
		return;
	}
	queryInfo.querycondition = {
		conditions: searchVal.conditions,
		logic: 'and'
	};
	queryInfo.userdefObj = {
		pk_org: this.pk_org
	};
	if (searchVal === null) {
		return;
	} else {
		ajax({
			url: URL.conditionQuery,
			data: queryInfo,
			success: (res) => {
				let { success, data } = res;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (success) {
					//查询后进行是否期初记账的判定
					if (res.data.extra) {
						this.isBeginAccount = res.data.extra.isBeginAccount;
						buttonCntrol.call(this, BUTTONSTATE.SEARCH_SUCCESS_ISBEGINACCOUNT, this.isBeginAccount);
					}
					if (res.data.data) {
						let scale = this.scale;
						let meta = this.props.meta.getMeta();
						meta[AREA.tableArea].items.forEach((item) => {
							if (item.attrcode == FIELD.ndifferencemny) {
								item.scale = scale;
							}
						});
						this.props.meta.setMeta(meta);
						props.editTable.setTableData(AREA.tableArea, res.data.data[AREA.tableArea]);
						//设置pop
						this.popContentShow(props, UISTATE.browse);
						if (flag != true) {
							showHasQueryResultInfo(res.data.data.head.rows.length);
						}
					} else {
						props.button.setDisabled({
							[BUTTONID.Edit]: true
						});
						if (flag != true) {
							showNoQueryResultInfo();
						}
						props.editTable.setTableData(AREA.tableArea, { rows: [] });
					}
					buttonCntrol.call(this, BUTTONSTATE.SEARCH_SUCCESS, true, UISTATE.browse);
					//设置表格编辑态
					props.editTable.setStatus(AREA.tableArea, UISTATE.browse);
				}
				if (flag == true) {
					showRefreshInfo();
				}
			}
		});
	}
}
