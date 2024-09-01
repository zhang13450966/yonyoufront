import React, { Component } from 'react';

export default class ReferLoader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refer: null
		};
	}

	componentDidMount() {
		this.createScript(this.props.refcode);
	}

	//WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
	componentWillReceiveProps(nextProps) {
		if (this.props.refcode !== nextProps.refcode) {
			this.createScript(nextProps.refcode);
		}
	}

	createScript = (src, config = {}) => {
		if (src) {
			var that = this,
				scripts = Array.from(document.getElementsByTagName('script')),
				s = src.split('/'),
				flag,
				refKey;
			refKey = s.slice(s.length - 5).join('/');
			refKey.includes('.js') && (refKey = refKey.substring(0, refKey.length - 3));
			flag = scripts.find((e) => {
				return e.src.includes(refKey);
			});
			if (window[refKey]) {
				// 已经加载过script标签
				this.handleLoad(refKey);
			} else {
				this.setState(
					{
						refer: null,
						config: config
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

						script.addEventListener('load', this.handleLoad.bind(null, refKey));
						script.addEventListener('error', () => {
							that.setState({
								refer: null
							});
							console.error(`找不到${src}这个文件，请检查引用路径`);
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

	handleLoad = (refcode) => {
		let that = this;
		try {
			that.setState({
				refer: window[refcode].default
			});
		} catch (e) {
			that.setState({
				refer: null
			});
			console.error(e.message);
			console.error(`请检查引用的${refcode}这个文件是源码还是编译好的。源码需要在config.json/buildEntryPath配相应的路径，编译好的则不用`);
		}
	};

	render() {
		let App = this.state.refer;
		return typeof App === 'function' && <App ref={ref => this.referLoadRef = ref} {...this.props} {...this.state.config}/>;
	}
}
