// 总结一些ajax 的重复的地方，封装掉

/**
 *
 * @param data:<object(url, body)>
 *
*/

import React from 'react';
import ReactDom from 'react-dom';

import { ajax, toast } from 'nc-lightapp-front';

import Loading from '../components/Loading';

let loadingDom = null;
let loadingTime = null;
let count = 0;

const showLoading = (loading) => {
	count++;
	if (loadingDom) {
		return;
	}
	loadingDom = document.createElement('div');
	loadingDom.style.opacity = 1;
	document.body.appendChild(loadingDom);

	ReactDom.render(<div>{loading}</div>, loadingDom);
};

const hideLoading = () => {
	count--;
	if (count > 0 || !loadingDom) {
		return;
	}
	loadingDom.style.transition = 'all .3s';
	loadingDom.style.opacity = 0;
	clearTimeout(loadingTime);
	loadingTime = setTimeout(() => {
		ReactDom.unmountComponentAtNode(loadingDom);
		document.body.removeChild(loadingDom);
		loadingDom = null;
	}, 300);
};

export default ({
	data,
	body,
	url,
	loadingTxt, // loading 显示的提示语
	loadingComponent, // loading组件
	success = () => {},
	error,
	hrLoading = false, // hr默认loading开关
	loading = true, // 平台默认loading开关
	...other
}) => {
	loadingComponent = loadingComponent || <Loading loadingTxt={loadingTxt || ''} />;
	body = data || body;
	hrLoading && showLoading(loadingComponent);
	return new Promise((resolve, reject) => {
		ajax({
			url: url,
			method: 'post',
			data: body,
			loading,
			success: (res) => {
				hrLoading && hideLoading();
				success(res);
				resolve(res);
			},
			error: (err) => {
				hrLoading && hideLoading();
				error !== undefined && (typeof error).toLowerCase() === 'function'
					? error(err)
					: toast({
							color: 'danger',
							content: err.message
						});
				reject(err);
			},
			...other
		});
	});
};
