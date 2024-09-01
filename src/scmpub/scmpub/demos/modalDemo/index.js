/*
 * @Author: hufei 
 * @PageInfo: 弹窗调用方法
 * @Date: 2018-09-21 15:23:50 
 * @Last Modified by: hufei
 * @Last Modified time: 2018-09-26 16:40:44
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, promptBox } from 'nc-lightapp-front';
import './index.less';
let { NCButton: Button, NCModal } = base;
let { Header, Body, Footer, Title } = NCModal;
class ModalDemo extends Component {
	constructor() {
		super();
		this.state = {
			value: 100,
			height: 100,
			show: false
		};
	}
	confirmBtn = () => {
		this.setState({
			height: this.state.value - 0
		});
	};

	close = () => {
		this.setState({ show: false });
	};
	render() {
		return (
			<div>
				<h3>1. createModal-junior 小型弹窗</h3>
				<Button onClick={() => this.props.modal.show('junior')}>弹窗</Button>
				{this.props.modal.createModal('junior', {
					title: '弹窗测试', // 弹框表头信息
					content: (
						<div className="content">
							高度：
							<input
								type="text"
								value={this.state.value}
								onChange={(e) => this.setState({ value: e.target.value })}
							/>
							<a href="javascript:void(0)" onClick={this.confirmBtn}>
								确定
							</a>
							<div style={{ height: this.state.height }}>
								弹窗固定宽度410PX，高度210PX，适合少量内容展示和录入，弹窗体部分不宜出现滚动条
							</div>
						</div>
					), //弹框内容，可以是字符串或dom
					beSureBtnClick: () => this.props.modal.close('junior'), //点击确定按钮事件
					cancelBtnClick: () => this.props.modal.close('junior'), //取消按钮事件回调
					closeModalEve: () => this.props.modal.close('junior'), //关闭按钮事件回调
					userControl: true, // 点确定按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
					// size: 'xlg', //  模态框大小 sm/lg/xlg
					noFooter: false, //是否需要底部按钮,默认有footer,有false,没有true
					rightBtnName: '取消', //左侧按钮名称,默认‘取消’
					leftBtnName: '确定', //右侧按钮名称， 默认‘确定’
					className: 'junior'
				})}
				<h3>2. createModal-senior 中型弹窗</h3>
				<Button onClick={() => this.props.modal.show('senior')}>弹窗</Button>
				{this.props.modal.createModal('senior', {
					title: '弹窗测试', // 弹框表头信息
					content: (
						<div className="content">
							高度：
							<input
								type="text"
								value={this.state.value}
								onChange={(e) => this.setState({ value: e.target.value })}
							/>
							<a href="javascript:void(0)" onClick={this.confirmBtn}>
								确定
							</a>
							<div style={{ height: this.state.height }}>
								宽度固定520px，高度根据内容自适应，最小高度268px，最大高度420px，当弹窗主体部分内容较多时，主体部分出现滚动条
							</div>
						</div>
					), //弹框内容，可以是字符串或dom
					beSureBtnClick: () => this.props.modal.close('senior'), //点击确定按钮事件
					cancelBtnClick: () => this.props.modal.close('senior'), //取消按钮事件回调
					closeModalEve: () => this.props.modal.close('senior'), //关闭按钮事件回调
					userControl: true, // 点确定按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
					// size: 'xlg', //  模态框大小 sm/lg/xlg
					noFooter: false, //是否需要底部按钮,默认有footer,有false,没有true
					rightBtnName: '取消', //左侧按钮名称,默认‘取消’
					leftBtnName: '确定', //右侧按钮名称， 默认‘确定’
					className: 'senior'
				})}
				<h3>3. createModal-combine 混合型弹窗</h3>
				<Button onClick={() => this.props.modal.show('combine')}>弹窗</Button>
				{this.props.modal.createModal('combine', {
					title: '弹窗测试', // 弹框表头信息
					content: (
						<div className="content">
							高度：
							<input
								type="text"
								value={this.state.value}
								onChange={(e) => this.setState({ value: e.target.value })}
							/>
							<a href="javascript:void(0)" onClick={this.confirmBtn}>
								确定
							</a>
							<div style={{ height: this.state.height }}>
								宽度固定680px，高度根据内容自适应，最小高度268px，最大高度570px，当弹窗主体部分内容较多时，主体部分出现滚动条
							</div>
						</div>
					), //弹框内容，可以是字符串或dom
					beSureBtnClick: () => this.props.modal.close('combine'), //点击确定按钮事件
					cancelBtnClick: () => this.props.modal.close('combine'), //取消按钮事件回调
					closeModalEve: () => this.props.modal.close('combine'), //关闭按钮事件回调
					userControl: true, // 点确定按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
					// size: 'xlg', //  模态框大小 sm/lg/xlg
					noFooter: false, //是否需要底部按钮,默认有footer,有false,没有true
					rightBtnName: '取消', //左侧按钮名称,默认‘取消’
					leftBtnName: '确定', //右侧按钮名称， 默认‘确定’
					className: 'combine'
				})}
				<h3>4. promptbox 提示框</h3>
				<Button
					onClick={() =>
						promptBox({
							color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
							title: '确认取消', // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
							content: '是否确认要取消？', // 提示内容,非必输
							noFooter: false, // 是否显示底部按钮(确定、取消),默认显示(false),非必输
							noCancelBtn: false, // 是否显示取消按钮,，默认显示(false),非必输
							beSureBtnName: '确定', // 确定按钮名称, 默认为"确定",非必输
							cancelBtnName: '取消', // 取消按钮名称, 默认为"取消",非必输
							hasCloseBtn: false, //显示“X”按钮，默认不显示，不显示是false，显示是true
							beSureBtnClick: () => {
								console.log('确定事件');
							} // 确定按钮点击调用函数,非必输
						})}
				>
					弹窗
				</Button>
				<h3>5.ncmodal.createModal</h3>
				<Button onClick={() => this.props.modal.show('ncmodal')}>弹窗</Button>
				{this.props.ncmodal.createModal('ncmodal', {
					title: '确认取消', // 弹框表头信息
					content: '是否确认要取消？', //弹框内容，可以是字符串或dom
					beSureBtnClick: () => this.props.modal.close('ncmodal'), //点击确定按钮事件
					cancelBtnClick: () => this.props.modal.close('ncmodal'), //取消按钮事件回调
					closeModalEve: () => this.props.modal.close('ncmodal'), //关闭按钮事件回调
					userControl: true, // 点确定按钮后，是否自动关闭弹框.true:手动关。false:自动关,默认false
					noFooter: false, //是否需要底部按钮,默认有footer,有false,没有true
					rightBtnName: '取消', //左侧按钮名称,默认‘取消’
					leftBtnName: '确定' //右侧按钮名称， 默认‘确定’
				})}

				<div className="tip">
					注意: ncmodal.createModal的用法与modal.createModal一样, 不需要加className(指senior,junior,combine)和size属性,
					页面样式和prompt提示框一样, 同时关闭提示方法也是用的modal.close而不是ncmodal.close。由于关系比较乱，推荐提示用的弹窗使用promptBox。
				</div>
				<h3>6. Modal 组件</h3>
				<Button onClick={() => this.setState({ show: true })}>弹窗</Button>
				<NCModal show={this.state.show} onHide={this.close} className="simpleModal">
					<Header closeButton>
						<Title>弹窗测试</Title>
					</Header>
					<Body>弹窗内容</Body>
					<Footer>
						<Button className="button-primary" onClick={this.close}>
							确认
						</Button>
						<Button onClick={this.close}>取消</Button>
					</Footer>
				</NCModal>
				<div className="tip">
					注意：NCModal组件创建弹窗的方法是最基本也是最原始的方法，可以根据页面需要控制样式，也可以通过className直接调用到平台的样式。调用平台样式的方法是给NCModal增加
					simpleModal + junior(或senior,或combine)组合类名，如 &lt;NCModal className="simpleModal
					junior(或senior,或combine)" /&gt;
				</div>
			</div>
		);
	}
}
ModalDemo = createPage({})(ModalDemo);
ReactDOM.render(<ModalDemo />, document.getElementById('app'));
