/**
 *
 * @title Tree可搜索示例
 * @description
 *
 */

import React, { Component } from 'react';
window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}
import TreeToListTransfer from './comm';

function MeTransfer(WrappedComponent) {
	return class Content extends Component {
		constructor(props) {
			super(props);
			this.state = {
				targetKeys: {},
				dataSource: {}
			};
		}

		componentWillMount() {
			if(_.isEmpty($appRoot.state.json)){
				// 初始化调用getPlatformLang方法获取多语
				let callback = (json, bool, LangData) => {
					$appRoot.state.json = json;
				}
				$nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
			}
		}

		setDataSource = (id, data, callback) => {
			this.state.dataSource[id] = data;
			this.setState({ dataSource: this.state.dataSource }, () => {
				if (callback) callback();
			});
		};
		getDataSoure = (id) => {
			return this.state.dataSource[id] || [];
		};
		setTargetKeys = (id, data, callback) => {
			console.log('================================')
			this.state.targetKeys[id] = data;
			this.setState({ targetKeys: this.state.targetKeys }, () => {
				if (callback) callback();
			});
		};
		getTargetKeys = (id) => {
			return this.state.targetKeys[id] || [];
		};
		onTargetKeysChange = (id, data) => {
			console.log(id,data,'9999999999999999991111111111')
			this.state.targetKeys[id] = data;
			this.setState({ targetKeys: this.state.targetKeys }, () => {
				// if(callback)callback();
			});
		};
		createMeTransfer = (id, config) => {
			console.log(config,'=9999999999999')
			const transferProps = {
				dataSource: this.state.dataSource[id] || [],
				targetKeys: this.state.targetKeys[id] || [],
				rowKey: 'key', // 和默认值相同时可以不指定
				rowTitle: 'title',
				rowChildren: 'children',
				treeType: true,
				onTargetKeysChange: (targetKeys) => {
					this.onTargetKeysChange(id, targetKeys);
				},
				checkable:false,
				className: 'my-transfer-demo',
				showMoveBtn: true,
				showSearch: true,
				listRender: ({ key, title }) => key + ' ' + title,
				...config
			};
			return <TreeToListTransfer {...transferProps} />;
		};
		render() {
			console.log($appRoot.state.json['public_lang-000108'], this);/* 国际化处理： 高阶组件this*/
			return (
				<div>
					<WrappedComponent
						meTransfer={{
							createMeTransfer: this.createMeTransfer,
							setDataSource: this.setDataSource,
							setTargetKeys: this.setTargetKeys,
							getDataSource: this.getDataSource,
							getTargetKeys: this.getTargetKeys
						}}
						{...this.props}
					/>
				</div>
			);
		}
	};
}
export default MeTransfer;
