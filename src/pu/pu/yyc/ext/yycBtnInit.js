/*
 * 云采按钮初始化
 * @Author: guozhq 
 * @Date: 2019-05-16 16:51:55 
 * @Last Modified by: guozhq
 * @Last Modified time: 2022-04-11 16:09:09
 */
import { getDefData, setDefData } from '../../../../scmpub/scmpub/pub/cache';
import { YYC_PARAM, YYC_BUTTON_ARRAY } from '../constance';
import { ajax } from 'nc-lightapp-front';

/**
 * 友云采按钮初始化
 * @param {*} props 
 */
function yycBtnInit(props) {
	// 判断当前缓存是否存在
	let param = getDefData(YYC_PARAM.DATASOURCE, YYC_PARAM.YCPO001);
	if (param) {
		let isEnable = param[YYC_PARAM.YCPO001];
		props.button.setButtonVisible(YYC_BUTTON_ARRAY, isEnable);
	} else {
		let data = [ YYC_PARAM.YCPO001 ];
		ajax({
			url: '/nccloud/scmpub/pub/sysinitgroup.do',
			data: data,
			async: false,
			success: (res) => {
				if (res.data) {
					let isEnable = res.data[YYC_PARAM.YCPO001];
					if (isEnable) {
						isEnable = true;
					} else {
						isEnable = false;
					}
					setDefData(YYC_PARAM.DATASOURCE, YYC_PARAM.YCPO001, { [YYC_PARAM.YCPO001]: isEnable });
					props.button.setButtonVisible(YYC_BUTTON_ARRAY, isEnable);
				}
			}
		});
	}
}

/**
 * 判断是否已经启用友云采参数
 */
function isYYC() {
	let param = getDefData(YYC_PARAM.DATASOURCE, YYC_PARAM.YCPO001);
	if (param) {
		return param[YYC_PARAM.YCPO001];
	}
	return null;
}

export { yycBtnInit, isYYC };
