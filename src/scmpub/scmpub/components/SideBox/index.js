/*
 * @Author: hufei
 * @PageInfo: 侧拉框组件
 * @Date: 2018-05-03 15:07:57
 * @Last Modified by: chenggangk
 * @Last Modified time: 2022-04-24 13:50:16
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import './index.less';
export default class SideBox extends Component {
	static defaultProps = {
		title: '',
		showHeader: true,
		showFooter: true,
		bodyInnerHTML: '',
		flag: false
	};
	constructor() {
		super();
		initLang(this, [ '4001components' ], 'scmpub', () => this.setState(this.state));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.flag) {
			setTimeout(() => {
				this.focusHandle('.side-box-content');
			}, 500);
		} else {
			// 这里会导致高级查询  左侧树输入之后自动失去焦点  所以特殊情况下这里加个参数进行禁用
			// 此法仅用于防止影响原来的引用，建议郭祉祺找个时间好好测试下这个自动聚焦能不能去除
			// 或则找到当前这个自动聚焦代码的实现原因
			!nextProps.disableFoucus && this.focusHandle('#app');
		}
	}

	onMaskClick = (e) => {
		let { status } = this.props;
		if (e.target.classList.contains('side-box')) {
			if (status && status === 'edit') {
				return;
			}
			this.props.onChange(false);
			this.focusHandle('#app');
		}
	};

	closeSideBox = () => {
		let { status } = this.props;
		if (status && status === 'edit') {
			return;
		}
		this.props.onChange(false);
		this.focusHandle('#app');
	};

	focusHandle(selector) {
		let dom = document.querySelector(selector);
		if (dom) {
			dom.tabIndex = '0';
			dom.focus();
		} else {
			let app = document.querySelector('#app');
			app.tabIndex = '0';
			app.focus();
		}
	}

	render() {
		let {
			showHeader,
			showFooter,
			title,
			headerInnerHTML,
			bodyInnerHTML,
			footerInnerHTML,
			className = '',
			flag,
			isAdaptorStyle = true
		} = this.props;
		const { NCDiv } = base;
		let outerClass = (className + ' side-box').trim();
		if (flag) {
			return ReactDOM.createPortal(
				<div className={outerClass} onClick={this.onMaskClick}>
					<div
						className={
							isAdaptorStyle ? (
								'side-box-content  nc-theme-area-bgc nc-theme-area-split-bc flex-container'
							) : (
								'side-box-content  flex-container'
							)
						}
					>
						{showHeader && (
							<NCDiv
								areaCode={NCDiv.config.HEADER}
								className={isAdaptorStyle ? 'header nc-theme-area-split-bc' : 'header'}
							>
								<span className="title" fieldid={title + '_title'}>
									{title}
								</span>
								{headerInnerHTML}
							</NCDiv>
						)}
						<div className="body flex-container">{bodyInnerHTML}</div>
						{showFooter && (
							<footer
								fieldid="bottom-area"
								className={isAdaptorStyle ? 'footer nc-theme-area-split-bc' : 'footer'}
							>
								{footerInnerHTML}
								<a href="#" onClick={this.closeSideBox}>
									{getLangByResId(this, '4001COMPONENTS-000002') /* 国际化处理： 收起*/}
								</a>
							</footer>
						)}
					</div>
				</div>,
				document.body
			);
		} else {
			return null;
		}
	}
}
