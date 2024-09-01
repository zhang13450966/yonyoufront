/*
 * @Author: raoczh 
 * @PageInfo: 拉单查询按钮处理方法
 * @Date: 2018-06-11 19:35:00 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 14:25:00
 */
import { PAGECODE, PAGEAREA, PK, URL, KEYMAP } from '../const';
import { OrderCache } from '../../constance';
import translateData from '../utils/translateData';
import { ajax, toast } from 'nc-lightapp-front';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, isRefresh) {
	let _this = this;
	let queryInfo = new Array();
	let query23Info = this.props.search.getQueryInfo(PAGEAREA.searchall, true);
	let query45info = this.props.search.getQueryInfo(PAGEAREA.searchall, true);
	if (query23Info.querycondition) {
		query45info.oid = this.oid45;
		let data23 = {
			queryInfo: query23Info,
			currentTab: PAGECODE.appcode23,
			pageCode: PAGECODE.pagecode23, //页面编码
			templetid: this.templet23id
		};
		let data45 = {
			queryInfo: query45info,
			currentTab: PAGECODE.appcode45,
			pageCode: PAGECODE.pagecode45, //页面编码
			templetid: this.templet45id
		};
		queryInfo.push(data23);
		queryInfo.push(data45);
		let multidata = {
			queryInfo: queryInfo
		};
		ajax({
			url: URL.searchall,
			data: multidata,
			success: (res) => {
				clearTransferCache(_this.props, OrderCache.OrderTransferCache);
				this.setState({ ntotalnum: 0 });
				let { success, data } = res;
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					_this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (success) {
					let content = null;
					if (data) {
						let destdatas = [];
						let data23 = [];
						let data45 = [];
						for (let d of data) {
							if (PAGECODE.pagecode23 == d.pageid) {
								data23.push(d);
							} else if (PAGECODE.pagecode45 == d.pageid) {
								data45.push(d);
							}
						}
						let m23extatt = {
							cbilltypeid: { value: '23', display: getLangByResId(this, '4004POORDER-000089') }
						}; /* 国际化处理： 退货单*/
						let dest23datas = translateData(
							data23,
							PAGEAREA.head23,
							PAGEAREA.body23,
							PAGEAREA.headall,
							PAGEAREA.bodyall,
							KEYMAP.KEYMAP23TO21,
							m23extatt
						);
						// 表头取表体的值，biao'ti
						destdatas.push(...dest23datas);
						let m45extatt = {
							cbilltypeid: { value: '45', display: getLangByResId(this, '4004POORDER-000090') }
						}; /* 国际化处理： 退库单*/
						let dest45datas = translateData(
							data45,
							PAGEAREA.head45,
							PAGEAREA.body45,
							PAGEAREA.headall,
							PAGEAREA.bodyall,
							KEYMAP.KEYMAP45TO21,
							m45extatt
						);
						destdatas.push(...dest45datas);
						content = destdatas.length;
						this.props.transferTable.setTransferTableValue(
							PAGEAREA.headall,
							PAGEAREA.bodyall,
							destdatas,
							[ PK.head23, PK.head45 ],
							[ PK.body23, PK.body45 ]
						);
					}
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(content);
					// toast({color: 'success',content: getLangByResId(this, '4004POORDER-000006')});
					/* 国际化处理： 查询成功！*/
					// showSuccessInfo(getLangByResId(this, '4004POORDER-000006'));
				}
			}
		});
	}
}
