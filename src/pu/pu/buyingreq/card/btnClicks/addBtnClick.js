/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片新增按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:15:07
 */
import { BUYINGREQ_CARD } from '../../siconst';
import pageInfoClick from './pageInfoClick';
export default function clickAddBtn(props) {
	let id = this.props.getUrlParam(BUYINGREQ_CARD.id);
	props.pushTo(BUYINGREQ_CARD.cardUrl, {
		status: BUYINGREQ_CARD.add,
		id: id,
		comeType: true,
		pagecode: BUYINGREQ_CARD.cardpageid
	});
	pageInfoClick.bind(this)();
}
