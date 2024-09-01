/*
 * @Author: huangkewei 
 * @Date: 2018-04-17 10:55:09 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2020-03-11 11:13:18
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base } from 'nc-lightapp-front';
import { buttonClick } from '../event/index';
import BrTree from '../containers/brTree';
import BrForm from '../containers/brForm';
import { queryTreeData } from '../containers/method';
import { defaultRuleInfo } from '../event/config';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { showSuccessInfo, showWarningInfo, showCancelDialog } from '../../pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../viewController/buttonController';
import { BATCHCODERULE_CONST } from '../const';
import './index.less';
const { NCAffix, NCDiv } = base;
class BatchRule extends Component {
	constructor() {
		super();
		this.close = false;
		this.state = {
			isEdit: false, // 是否是编辑态
			ruleInfo: {
				vprefix: { value: '' },
				object1: { value: '' },
				object2: { value: '' },
				vyear: { value: '' },
				vmonth: { value: '' },
				vday: { value: '' },
				snnum: { value: '0' },
				vsuffix: { value: '' },
				obj1length: { value: '' },
				obj2length: { value: '' },
				snresetflag: { value: '' }
			}, // 当前节点的规则信息
			pk_marbasclass: '',
			objectOps: {},
			// 多语
			json: {},
			inlt: null
		};
		initLang(this, [ '4001batchrule' ], 'scmpub');
	}

	componentDidMount() {
		// 请求注册按钮
		ajax({
			url: BATCHCODERULE_CONST.QUERYBTNSURL,
			data: {
				appcode: BATCHCODERULE_CONST.APPCODE,
				pagecode: BATCHCODERULE_CONST.PAGECODE
			},
			success: (res) => {
				// 拿到按钮数据，调用setButtons方法将数据设置到页面上，然后执行后续的按钮逻辑
				if (res.data) {
					this.props.button.setButtons(res.data);
					// 控制按钮显示隐藏
					buttonController.call(this, this.props, BATCHCODERULE_CONST.BROWSE);
				}
			}
		});

		ajax({
			url: BATCHCODERULE_CONST.QUERYOBJLENGTHURL,
			success: (res) => {
				if (res.success) {
					this.setState({ objectOps: res.data });
				}
			}
		});
	}

	// 关闭浏览器提示
	componentWillMount() {
		window.onbeforeunload = () => {
			if (this.close) {
				return getLangByResId(this, '4001BATCHRULE-000016'); /* 国际化处理： 当前界面数据未保存，您确认离开此页面？*/
			}
		};
	}

	// 点击修改按钮事件
	handleIsEdit = () => {
		this.close = true;
		this.setState({ isEdit: true });
		this.props.syncTree.setNodeDisable('tree', true); // 设置树图不可编辑
		// 控制按钮显示隐藏
		buttonController.call(this, this.props, BATCHCODERULE_CONST.EDIT);
	};

	// 刷新操作
	refreshTree = () => {
		this.setState({ ruleInfo: defaultRuleInfo, isEdit: false });
		queryTreeData.call(this, 'tree', this.props, 'refresh');
	};

	// 保存规则
	saveRule = () => {
		let { ruleInfo, snresetflag, pk_marbasclass } = this.state;
		let flag = ruleInfo.snresetflag.value;
		if (flag != 0) {
			switch (flag) {
				case '1':
					if (ruleInfo.vyear.value == '') {
						showWarningInfo(
							null,
							getLangByResId(this, '4001BATCHRULE-000017')
						); /* 国际化处理： 归零标志为年，批次号规则中必须包含年！*/
						return;
					}

					break;
				case '2':
					if (ruleInfo.vmonth.value == '') {
						showWarningInfo(
							null,
							getLangByResId(this, '4001BATCHRULE-000018')
						); /* 国际化处理： 归零标志为月，批次号规则中必须包含月！*/
						return;
					}
					break;
				case '3':
					if (ruleInfo.vday.value == '') {
						showWarningInfo(
							null,
							getLangByResId(this, '4001BATCHRULE-000019')
						); /* 国际化处理： 归零标志为日，批次号规则中必须包含日！*/
						return;
					}
					break;
				default:
					break;
			}
		}
		let postData = {};
		for (let key in ruleInfo) {
			postData[key] = ruleInfo[key].value;
			if (key == 'snnum' && ruleInfo[key].value == '') {
				postData[key] = 0;
			}
		}

		postData['pk_marbasclass'] = pk_marbasclass;

		ajax({
			url: BATCHCODERULE_CONST.SAVEURL,
			data: postData,
			success: (res) => {
				if (res.success) {
					this.close = false;
					this.setState({ isEdit: false }, () => {
						console.log(this.state.ruleInfo);
					});
					this.props.syncTree.setNodeDisable('tree', false);
					// 控制按钮显示隐藏
					buttonController.call(this, this.props, BATCHCODERULE_CONST.BROWSE);
					showSuccessInfo(getLangByResId(this, '4001BATCHRULE-000020')); /* 国际化处理： 保存成功*/
				}
			}
		});
	};

	// 取消事件
	cancel = () => {
		showCancelDialog({ beSureBtnClick: this.cancelOpr.bind(this) });
	};

	// 取消确认
	cancelOpr = () => {
		this.close = false;
		this.props.syncTree.setNodeDisable('tree', false);
		this.setState({ ruleInfo: this._ruleInfo, isEdit: false });
		buttonController.call(this, this.props, BATCHCODERULE_CONST.BROWSE);
	};

	// 获取当前节点的规则
	queryNodeRule = (data) => {
		if (this._ruleInfo) {
			delete this._ruleInfo;
		}
		this.setState({ ruleInfo: data });
		this._ruleInfo = JSON.parse(JSON.stringify(data)); // 取消时用做原始数据
	};

	// 获取节点pk
	getPk = (key, val) => {
		this.setState({ [key]: val });
	};

	// 获取最新规则
	getNewRule = (key, val) => {
		this.state.ruleInfo[key].value = val;
		this.setState({ ruleInfo: this.state.ruleInfo });
	};

	render() {
		let { isEdit, ruleInfo, objectOps } = this.state;
		return (
			<div className="batch-rule-container nc-bill-tree-card">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="header" style={{ padding: 0 }}>
						<div className="header">
							{createListTitle(this)}
							<div className="btn-group">
								{this.props.button.createButtonApp({
									area: BATCHCODERULE_CONST.LIST_HEAD,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</div>
					</NCDiv>
				</NCAffix>
				<div className="tree-card br-containers">
					<div className="left-tree nc-theme-l-area-bgc">
						<div className="batch-rule-title nc-theme-common-font-c">
							{getLangByResId(this, '4001BATCHRULE-000022') /* 国际化处理：物料基本分类*/}
						</div>
						<BrTree
							NCProps={this.props}
							handleIsEdit={this.handleIsEdit}
							getPk={this.getPk}
							queryNodeRule={this.queryNodeRule}
						/>
					</div>
					<div className="right-form nc-theme-r-area-bgc">
						<BrForm
							getNewRule={this.getNewRule}
							objectOps={objectOps}
							isEdit={isEdit}
							ruleInfo={ruleInfo}
						/>
					</div>
				</div>
			</div>
		);
	}
}
BatchRule = createPage({})(BatchRule);
ReactDOM.render(<BatchRule />, document.querySelector('#app'));
