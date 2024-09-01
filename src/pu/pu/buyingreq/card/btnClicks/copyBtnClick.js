/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片新增按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:18:37
 */
import { BUYINGREQ_CARD } from '../../siconst';
import pageInfoClick from './pageInfoClick';
// let tableId = BUYINGREQ_CARD.tableId;
// let formId = BUYINGREQ_CARD.formId;
export default function clickCopyBtn(props) {
	let id = this.props.getUrlParam(BUYINGREQ_CARD.id);
	props.pushTo(BUYINGREQ_CARD.cardUrl, {
		status: BUYINGREQ_CARD.add,
		id: id,
		copy: true,
		pagecode: BUYINGREQ_CARD.cardpageid
	});
	pageInfoClick.bind(this)();
}
