/*
 * @Author: CongKe
 * @PageInfo: 返回
 * @Date: 2018-05-03 20:43:29
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-17 20:18:37
 */
import { URL, PAGECODE, CONSTFIELD, TRANSFER2C } from '../../constance';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function backButton(error) {
	let transfer = this.props.getUrlParam('transfer');

	if (transfer) {
		//页面回退 处理拉单
		if (error && error.message) {
			//拉单报错
			goSourceBack.call(this, transfer);
		}
		let allprocess = true;
		if (allprocess === false) {
			showBackWarningDialog({
				beSureBtnClick: () => {
					// 移除浏览器监听提示
					window.removeEventListener('beforeunload', this.onMove);
					//如果是推单过来的直接返回到
					if (channelType) {
						// add by CongKe 推单取消需求变更
						this.props.pushTo(URL.list, { pagecode: PAGECODE.list });
					} else {
						goSourceBack.call(this, transfer);
					}
				}
			});
		} else {
			goSourceBack.call(this, transfer);
		}
	} else {
		let scene = getDefData(OrderCache.OrderCardCache, 'scene');
		let urlJson = {};
		urlJson = scene != null ? { scene: scene, pagecode: PAGECODE.list } : urlJson;
		this.props.pushTo(URL.list, urlJson);
	}
}

function goSourceBack(transfer) {
	let map = new Map();
	map.set('21P', TRANSFER2C.GOTO2C);

	let _url = map.get(transfer);
	let map2 = new Map();
	map2.set('21P', TRANSFER2C.PAGEID);

	let pagecdoe = map2.get(transfer);
	let scene = getDefData(CONSTFIELD.planConfirmCacheKey, 'scene');
	let srcappcode = getDefData(CONSTFIELD.planConfirmCacheKey, 'srcappcode');
	let urlJson = {};
	urlJson = scene != null ? { scene: scene, appcode: srcappcode, pagecode: pagecdoe } : urlJson;
	this.props.pushTo(_url, urlJson);
}
