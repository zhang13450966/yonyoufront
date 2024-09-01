import { URL, AREA, PAGECODE } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import {
	showWarningInfo,
	showHasQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function clickSearchBtn(isRefresh) {
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea);
	ajax({
		url: URL.queryScheme,
		data: {
			queryInfo: queryInfo,
			pageCode: PAGECODE.list, //页面编码
			templetid: '0001Z81000000006UQ1W',
			currentTab: 'all' //当前页签编码
		},
		success: (res) => {
			let { success, data } = res;
			if (!success) return;
			if (isRefresh) {
				showRefreshInfo();
			} else if (Array.isArray(data)) {
				showHasQueryResultInfo(data.length); // 显示查询成功条数
			} else {
				showWarningInfo(getLangByResId(this, '4004MILESTONEBOARD-000028')); // 国际化处理： 未查询出符合条件的数据
			}
			this.setState(
				{
					orders: data || [],
					pageIndex: 0,
					renderOrders: []
				},
				() => {
					this.chartArea.scrollTop = 0;
					this.loadPageOrder();
				}
			);
		}
	});
}

export function clickRefreshBtn() {
	clickSearchBtn.call(this, true);
	// 刷新按钮点击时添加旋转动画
	let refreshIcon = document.querySelector('.refreshIcon');
	refreshIcon.classList.add('animate_rotate');
	setTimeout(() => {
		refreshIcon.classList.remove('animate_rotate');
	}, 300);
}
