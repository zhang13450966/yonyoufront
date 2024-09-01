/*
 * @Author: zhangchangqing 
 * @PageInfo: 新增按钮处理
 * @Date: 2018-04-19 10:34:18 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:25:14
 */
import { BUYINGREQ_LIST } from '../../siconst';

export default function clickAddBtn(props) {
	props.pushTo(BUYINGREQ_LIST.cardUrl, {
		status: BUYINGREQ_LIST.add,
		pagecode: BUYINGREQ_LIST.cardpageid
	});
}
