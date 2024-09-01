/*
 * @Author: zhaochyu 
 * @PageInfo: 查询按钮
 * @Date: 2018-06-19 10:34:44 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:04:29
 */

import { ajax, toast } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE, DATASOURCE, FIELD } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//点击查询，获取查询区数据
export default function(props, key) {
	let flag = key === 'Refresh';
	let searchVal = this.props.search.getAllSearchData(AREA.searchArea);
	if (!searchVal) return;
	let transtype = getDefData(DATASOURCE.dataSource, 'transtype');
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea);
	let data = {
		templetid: getDefData(DATASOURCE.transferdataSource, FIELD.templetid),
		queryInfo: queryInfo,
		pageCode: PAGECODE.transferlist,
		userobj: { billtype_qs_key: transtype }
	}; //分页信息 //查询区编码 //查询模板id //查询条件 //页面编码
	//得到数据渲染到页面
	ajax({
		url: URL.queryOrder,
		data: data,
		success: (res) => {
			if (flag) {
				showSuccessInfo(getLangByResId(this, '4004INITIALEST-000037')); /* 国际化处理： 刷新成功*/
			}
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res.data) {
				this.props.transferTable.setTransferTableValue(
					AREA.cardFormArea,
					AREA.cardTableArea,
					res.data,
					'pk_order',
					'pk_order_b'
				);
				if (!flag) {
					toast({
						color: 'success',
						content: getLangByResId(this, '4004INITIALEST-000038') /* 国际化处理："查询成功！"*/
					});
				}
			} else {
				if (!flag) {
					toast({
						color: 'warning',
						content: getLangByResId(this, '4004INITIALEST-000034') /* 国际化处理："未查询出符合条件的数据!"*/
					});
				}
				this.props.transferTable.setTransferTableValue(
					AREA.cardFormArea,
					AREA.cardTableArea,
					[],
					'pk_order',
					'pk_order_b'
				);
			}
		}
	});
}
