/*
 * @Author: zhangchangqing 
 * @PageInfo: 返回按钮事件
 * @Date: 2018-04-19 10:37:43 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 19:36:25
 */
import { BUYINGREQ_CARD } from '../../siconst';
export default function clickBackBtn(props) {
	props.pushTo(BUYINGREQ_CARD.listUrl, { pagecode: BUYINGREQ_CARD.listpageid });
}
