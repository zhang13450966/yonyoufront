/*
 * @Author: wangceb 
 * @PageInfo: 交互式异常界面处理  
 * @Date: 2018-06-18 11:47:50 
 * @Last Modified by: chenggangk
 * @Last Modified time: 2022-03-09 15:51:52
 */
import React from 'react';
import './index.less';
import { promptBox, getMultiLang } from 'nc-lightapp-front';

function showResumeModal(props, dlgcode, skipCodes, expinfo, okBtnClick, ...args) {
	if (expinfo.showStyle === 'simple') {
		promptBox({
			color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
			title: expinfo.title,
			content: getShowContent(props, expinfo),
			noFooter: false,
			noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
			beSureBtnName: lang.getLangByResId('4001RESUMEEXCEPTION-000000'), // 确定按钮名称, 默认为"确定",非必输
			cancelBtnName: expinfo.isStrict ? '' : lang.getLangByResId('4001RESUMEEXCEPTION-000001'), //国际化：取消
			hasCloseBtn: false, //显示“X”按钮，默认不显示，不显示是false，显示是true
			beSureBtnClick: beSureBtnClick.bind(
				this,
				props,
				skipCodes,
				expinfo.exceptionType,
				expinfo.isStrict,
				okBtnClick,
				...args
			), //点击确定按钮事件
			closeModalEve: '',
			cancelBtnClick: ''
		});
	} else {
		props.modal.show(dlgcode, {
			title: getTitle(props, expinfo), // 弹框表头信息
			content: getShowContent(props, expinfo), //弹框内容，可以是字符串或dom
			size: 'xlg',
			noFooter: false,
			leftBtnName: lang.getLangByResId('4001RESUMEEXCEPTION-000000'), //国际化：确定
			rightBtnName: expinfo.isStrict ? '' : lang.getLangByResId('4001RESUMEEXCEPTION-000001'), //国际化：取消
			hideRightBtn: false, //隐藏足部右边的按钮，默认是false不隐藏，隐藏是true
			hideLeftBtn: false, //隐藏足部左边的按钮，默认是false不隐藏，隐藏是true
			beSureBtnClick: beSureBtnClick.bind(
				this,
				props,
				skipCodes,
				expinfo.exceptionType,
				expinfo.isStrict,
				okBtnClick,
				...args
			), //点击确定按钮事件
			closeModalEve: '',
			cancelBtnClick: ''
		});
		// iframe 的样式通关css设置不生效，需要通过js来设置iframe内部的样式。
		setTimeout(() => {
			let innerBody = document.querySelector('#iframe').contentWindow.document.body;
			let innerApp = innerBody.getElementsByTagName('div')[0];
			innerBody.style.padding = 0;
			innerApp.style.minWidth = 'auto';
		}, 100);
	}
}
// 弹出框点击确定事件
function beSureBtnClick(props, skipCodes, exceptionType, isStrict, okBtnClick, ...args) {
	if (okBtnClick && !isStrict) {
		skipCodes ? skipCodes.push(exceptionType) : (skipCodes = [ exceptionType ]);
		okBtnClick.call(this, ...args, skipCodes);
	}
}

function getTitle(props, expinfo) {
	if (expinfo.tips == null) {
		return expinfo.title;
	}
	return (
		<span>
			{expinfo.title}
			<h className="table-filter-tips-befor" />
			<span className="table-filter-tips">
				<span className="iconfont icon icon-gantanhao" />
				{expinfo.tips}
			</span>
		</span>
	);
}

function getShowContent(props, expinfo) {
	if (expinfo.showStyle === 'simple') {
		return expinfo.message;
	}
	window.location.hash = window.location.hash + `?c=${props.getSearchParam('c')}`;
	return <iframe src={expinfo.url} style={{ width: '100%' }} id="iframe" sandbox />;
}
class LangContainer {
	constructor() {
		this.lang = null;
		this.inlt = null;
		// 初始化提示多语信息
		getMultiLang({
			moduleId: '4001resumeexception',
			domainName: 'scmpub',
			callback: this.init.bind(this),
			needInlt: true
		});
	}

	init(lang, status, inlt) {
		if (status) {
			this.lang = lang;
			this.inlt = inlt;
		}
	}

	getLangByResId(resid, param) {
		let str = resid;
		if (param) {
			str = this.inlt.get(resid, param);
			return str ? str : resid;
		} else {
			// 如果还没有加载回来，则返回空，避免页面显示多语字符串
			if (this.lang) {
				str = this.lang[resid];
				return str ? str : resid;
			} else {
				return resid;
			}
		}
	}
}

/**
 * 实例化多语容器
 */
const lang = new LangContainer();

export { showResumeModal };
