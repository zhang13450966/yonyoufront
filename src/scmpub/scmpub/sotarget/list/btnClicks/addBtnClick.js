/*
 * @Author: zhangchangqing 
 * @PageInfo: 新增按钮处理
 * @Date: 2018-04-19 10:34:18 
 * @Last Modified by: liulux
 * @Last Modified time: 2021-09-08 14:44:26
 */
import { TARGET_LIST } from '../../siconst';

export default function clickAddBtn(props) {
	props.pushTo(TARGET_LIST.cardUrl, {
		status: TARGET_LIST.add,
		pagecode: TARGET_LIST.cardpageid
	});
}
