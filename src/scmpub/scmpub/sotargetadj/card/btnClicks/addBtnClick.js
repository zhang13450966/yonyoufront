/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片新增按钮事件
 * @Date: 2018-04-19 10:38:05 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:49:00
 */
import { TARGETADJ_CARD } from '../../siconst';
import pageInfoClick from './pageInfoClick';
export default function addBtnClick(props) {
	let id = this.props.getUrlParam(TARGETADJ_CARD.id);
	props.pushTo(TARGETADJ_CARD.cardUrl, {
		status: TARGETADJ_CARD.add,
		id: id,
		comeType: true,
		pagecode: TARGETADJ_CARD.cardpageid
	});
	pageInfoClick.call(this, props);
}
