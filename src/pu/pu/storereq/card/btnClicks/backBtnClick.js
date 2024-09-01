/*
 * @Author: zhangchangqing 
 * @PageInfo: 返回按钮事件
 * @Date: 2018-04-19 10:37:43 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:29:31
 */
import { STOREREQ_CARD } from '../../siconst';
// let tableId = STOREREQ_CARD.tableId;
// let formId = STOREREQ_CARD.formId;
export default function clickBackBtn(props) {
	props.pushTo(STOREREQ_CARD.listUrl, { pagecode: STOREREQ_CARD.listpageid });
}
