/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-27 18:37:36 设置表体数据
 * @Last Modified by:   mikey.zhangchqf 
 * @Last Modified time: 2018-08-27 18:37:36 
 */

import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST, BUYINGREQ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';

//点击加号展开内嵌表格时，业务组请求表格数据，并且返回该数据
//record为点击的当前行信息; hasThisChild:是否已经有该子表，如果有，不需要再次请求；
export default function(record, hasThisChild) {
	
	if (!hasThisChild) {
		//发送ajax请求内嵌表格数据，并return该数据
		//内嵌表格列信息
		ajax({
			url: BUYINGREQ_CARD.queryHistoryb,
			data: {
				keyword: record.pk_praybill.value,
				pageid: BUYINGREQ_LIST.historypageid
			},
			success: (res) => {
				
				let { success, data } = res;
				if (success) {
					
					console.log(data);
					this.props.insertTable.setChildTableData(
						BUYINGREQ_CARD.formId,
						record,
						data[BUYINGREQ_CARD.tableId],
						ATTRCODE.pk_praybill_b
					);
				} else {
					this.props.insertTable.setChildTableData(BUYINGREQ_CARD.tableId, record, { rows: [] });
				}
			}
		});
	}
}
