/*
 * @Author: 李浩
 * @PageInfo:按钮处理方法
 * @Date: 2018-04-19 10:33:09 
 * @Last Modified by: 李浩
 * @Last Modified time: 2018-07-19 16:54:05
 */

import { ajax, toast } from 'nc-lightapp-front';
import { AREA, PAGECODE, URL } from '../../constance';

export default function setPieceBtnClick(props, record, index) {
	// 拼接主子表json方法，参数分别为：pageid（模板id），form区id，table区id，调用此方法即可自动拼接向后台传的json（data）
	let cmaterialoids = [ record.values.pk_srcmaterial.value ];
	let pk_corp = record.values.pk_group.value;
	let data = {
		cmaterialoids: cmaterialoids,
		pk_corp: pk_corp
	};

	ajax({
		url: URL.generalSetpiece,
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				this.setState({ showSetPiece: true, setPieceData: data });
			}
		}
	});
}
