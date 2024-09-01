/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，重排行号
 * @Date: 2021-11-22 16:07:24 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-02 17:22:52
 */
import { RownoUtils } from 'src/scmpub/scmpub/pub/tool/cardTableTools';
import { AREA, FIELD } from '../../constance';

export default function resetRowNoBtnClick(props) {
	props.beforeUpdatePage(); // 效率优化开启
	RownoUtils.resetRowNo(props, AREA.body, FIELD.crowno);
	props.updatePage(AREA.head, AREA.body); // 效率优化关闭
}
