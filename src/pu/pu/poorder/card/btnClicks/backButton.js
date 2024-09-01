/*
 * @Author: CongKe
 * @PageInfo: 返回
 * @Date: 2018-05-03 20:43:29
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 21:06:06
 */
import {
	URL,
	PAGECODE,
	TRANSFER,
	TRANSFER20,
	TRANSFERZ2,
	TRANSFER30TO21,
	TRANSFER30TO21COOP,
	TRANSFERMULTI,
	OrderCache,
	TRANSFER49
} from '../../constance';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';
import { changeUrlParam, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function backButton(error) {
	let transfer = this.props.getUrlParam('transfer');
	//推单标识
	let channelType = this.props.getUrlParam(TRANSFER.channelType);
	if (transfer || channelType) {
		//页面回退 处理拉单
		if (error && error.message) {
			//拉单报错
			goSourceBack.call(this, transfer);
		}
		let allprocess = this.props.transferTable.getTransformFormStatus(PAGECODE.leftarea);
		if (allprocess === false) {
			showBackWarningDialog({
				beSureBtnClick: () => {
					// 移除浏览器监听提示
					window.removeEventListener('beforeunload', this.onMove);
					//如果是推单过来的直接返回到
					if (channelType) {
						// add by CongKe 推单取消需求变更
						this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
					} else {
						goSourceBack.call(this, transfer);
					}
				}
			});
		} else {
			if (channelType) {
				this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.listcode });
			} else {
				goSourceBack.call(this, transfer);
			}
		}
	} else {
		let scene = getDefData(OrderCache.OrderCardCache, 'scene');
		let urlJson = {};
		urlJson = scene != null ? { scene: scene, pagecode: PAGECODE.listcode } : urlJson;
		this.props.pushTo(URL.gotoList, urlJson);
	}
}

function goSourceBack(transfer) {
	let map = new Map();
	map.set('20', TRANSFER20.GOTO20);
	map.set('Z2', TRANSFERZ2.GOTOZ2);
	map.set('30TO21', TRANSFER30TO21.GOTO30SALE);
	map.set('30TO21COOP', TRANSFER30TO21COOP.GOTO30COOP);
	map.set('MULTI', TRANSFERMULTI.GOTOMULTI);
	map.set('49', TRANSFER49.GOTO49);
	let _url = map.get(transfer);
	let map2 = new Map();
	map2.set('20', TRANSFER20.PAGEID);
	map2.set('Z2', TRANSFERZ2.PAGEID);
	map2.set('30TO21', TRANSFER30TO21.PAGEID);
	map2.set('30TO21COOP', TRANSFER30TO21COOP.PAGEID);
	map2.set('MULTI', TRANSFERMULTI.PAGEID);
	map2.set('49', TRANSFER49.PAGEID);
	let pagecdoe = map2.get(transfer);
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	let srcappcode = getDefData(OrderCache.OrderCardCache, 'srcappcode');
	let urlJson = {};
	urlJson = scene != null ? { scene: scene, appcode: srcappcode, pagecode: pagecdoe } : urlJson;
	this.props.pushTo(_url, urlJson);
}
