import { searchBtnClick } from '../btnClicks';
import { AREA } from '../../constance';
/*
 * 刷新
 * @Author: zhangbfk
 * @Date: 2018-07-05 20:55:46 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2018-10-29 09:38:00
 */
export default function(props) {
	let searchVal = props.search.getAllSearchData(AREA.searchArea);
	//重新执行数据查询
	searchBtnClick.call(this, props, searchVal, true);
}
