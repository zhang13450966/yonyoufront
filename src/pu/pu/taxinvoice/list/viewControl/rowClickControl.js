/*
 * @Author: chaiwx 
 * @PageInfo: 行点击事件
 * @Date: 2019-02-14 10:06:57 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:17:40
 */

import { REQUESTURL, PAGECODE } from '../../constance';
import { FIELDS } from '../../constance';

function onRowDoubleClick(record, index) {
	this.props.pushTo(REQUESTURL.toCard, {
		status: 'browse',
		id: record['pk_taxinvoice'].value,
		pagecode: PAGECODE.cardPagecode
	});
}

export { onRowDoubleClick };
