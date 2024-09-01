/*
 * @Author: CongKe 
 * @PageInfo: 采购订单卡片保存提交 
 * @Date: 2018-07-20 22:39:39 
 * @Last Modified by: CongKe
 * @Last Modified time: 2018-10-12 20:43:56
 */
import { saveBtnClick, commit } from './index';
import { URL, PAGECODE, FIELD, STATUS, TRANSFER, OrderCache } from '../../constance';

export default function savecommit(skipCodes) {
	saveBtnClick.call(this, this.props, skipCodes, () => {
		let transfer = this.props.getUrlParam(TRANSFER.transfer);
		let channelType = this.props.getUrlParam(TRANSFER.channelType);
		commit.call(this, this.props, null, null, 'Tran_S_C');
	});
}
