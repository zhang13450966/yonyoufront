/*
 * @Author: zhangchangqing 
 * @PageInfo: 返回按钮事件
 * @Date: 2018-04-19 10:37:43 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:49:25
 */
import { TARGETADJ_CARD } from '../../siconst';
export default function clickBackBtn(props) {
	props.pushTo(TARGETADJ_CARD.listUrl, { pagecode: TARGETADJ_CARD.listpageid });
}
