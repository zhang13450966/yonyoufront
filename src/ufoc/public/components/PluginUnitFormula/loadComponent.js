
import React, { Component } from 'react';

export default class LoadComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: null
		};
	}

	componentDidMount() {
		this.createScript(this.props.refcode);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.refcode !== nextProps.refcode) {
			this.createScript(nextProps.refcode);
		}
	}

	refCodeToRefKey = refcode => {
		var s = refcode.split('/'),
			refKey;
		refKey = s.slice(s.length - 5).join('/');
		refKey.includes('.js') && (refKey = refKey.substring(0, refKey.length - 3));
		return refKey;
	};

	createScript = src => {
		if (src) {
			var that = this,
				scripts = Array.from(document.getElementsByTagName('script')),
				flag,
				refKey = this.refCodeToRefKey(src);
			flag = scripts.find(e => {
				return e.src.includes(refKey);
			});
			if (window[refKey]) {
				// 已经加载过script标签
				this.handleLoad(refKey);
			} else {
				this.setState(
					{
						refer: null
					},
					() => {
						let script;
						if (flag) {
							script = flag;
						} else {
							script = document.createElement('script');
							script.src = '../../../../' + refKey + '.js';
							script.type = 'text/javascript';
							document.body.appendChild(script);
						}

						script.addEventListener('load', this.handleLoad.bind(null, refKey, true));
						script.addEventListener('error', () => {
							that.setState({
								refer: null
							});
							console.error($appRoot.state.json['public_lang-000151']); /* 国际化处理： 找不到,这个文件,请检查引用路径*/
						});
					}
				);
			}
		} else {
			this.setState({
				refer: null
			});
		}
	};

	handleLoad = (refKey, async = false) => {
		let that = this;
		try {
			if (!(async && refKey !== that.refCodeToRefKey(that.props.refcode))) {
				that.setState({
					refer: window[refKey].default
				});
			}
		} catch (e) {
			that.setState({
				refer: null
			});
			console.error(e.message);
		}
	};

	render() {
		let App = this.state.refer;
		console.log($appRoot.state.json['public_lang-000152'],this,App);/* 国际化处理： 异步加载组件*/
		return typeof App === 'function' && <App {...this.props} />;
	}
}
