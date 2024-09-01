/*
 * @Author: qishy 
 * @PageInfo:业务对账单新增采购订单
 * @Date: 2019-05-05 11:06:19 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:04:50
 */
import { REQUESTURL, CACHDATASOURCE, PAGECODE } from '../../constance';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props) {
	clearTransferCache(props, CACHDATASOURCE.dataSourceTransfer);

	props.pushTo(REQUESTURL.toTransfer21, { type: 'transfer21', pagecode: PAGECODE.transferPagecode21 });
}
