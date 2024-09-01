/*
 * @Author: zhangchangqing 
 * @PageInfo: 新增按钮处理
 * @Date: 2018-04-19 10:34:18 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 15:01:28
 */
import { TARGETADJ_LIST } from '../../siconst';

export default function clickAddBtn(props) {
	props.pushTo(TARGETADJ_LIST.cardUrl, {
		status: TARGETADJ_LIST.add,
		pagecode: TARGETADJ_LIST.cardpageid
	});
}
