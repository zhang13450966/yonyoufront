/*
 * @Author: hufei
 * @PageInfo: 表格单元格渲染的类传参照样式的穿梭组件
 * @Date: 2018-06-07 10:08:57
 * @Last Modified by: gaoxwu
 * @Last Modified time: 2022-05-24 18:09:28
 */
import React, { Component } from 'react';
import { base, high } from 'nc-lightapp-front';
let { Transfer } = high;
let { NCModal: Modal, NCButton: Button, NCFormControl: FormControl, NCHotKeys, NCTooltip } = base;
import './index.less';
let { Header, Body, Footer, Title } = Modal;
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
export default class PopTransfer extends Component {
	static defaultProps = {
		onBlur: () => {},
		onChange: () => {}
	};
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			ncModalType: 'sm',
			keysStr_bak: [], // 取消时恢复用
			targetKeys: this.keysStrToTargetKeys(
				props.keysStr == '' && props.defaultAllKeysStr !== undefined ? props.defaultAllKeysStr : props.keysStr
			),
			valObj: this.keysToValueObj(props.keysStr) // 存放单元格的display和value，display用于显示，value用于保存
		};
		initLang(this, [ '4001components' ], 'scmpub', () => this.setState(this.state));
	}

	componentDidMount() {
		document.getElementById('app').onclick = this.blurEvent;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.keysStr !== this.props.keysStr) {
			this.setState({
				targetKeys: this.keysStrToTargetKeys(nextProps.keysStr)
			});
		}
	}

	componentWillUnmount() {
		document.getElementById('app').onclick = null;
	}

	blurEvent = (e) => {
		if (!e.target.classList.contains('icon-refer') && !e.target.classList.contains('cell-input')) {
			this.props.onBlur(this.state.valObj);
		}
	};

	toggleModal = () => {
		let { showModal } = this.state;
		if (!showModal) {
			this.setState({ keysStr_bak: JSON.parse(JSON.stringify(this.props.keysStr || '')) });
		}
		this.setState({ showModal: !showModal });
		document.body.onclick = null;
	};

	onTargetKeysChange = (targetKeys) => {
		let valObj = this.keysToValueObj(targetKeys);
		this.props.onTargetKeysChange(valObj.value); // 将拼接成字符串的key传出去，用于单元格的数据保存
		this.setState({
			valObj,
			targetKeys: typeof targetKeys === 'string' ? this.keysStrToTargetKeys(targetKeys) : targetKeys
		});
	};

	// 根据 key(id) 从树形嵌套结构中获取某一项
	findItemsByKey = (key, data) => {
		let item = null;
		let process = (tree) => {
			return tree.forEach((ele) => {
				if (ele.key == key) {
					item = ele;
				} else if (ele.children) {
					process(ele.children);
				}
			});
		};
		process(data);
		return item;
	};

	// value字符串转成包含display和value的对象
	keysToValueObj = (keys) => {
		// 传进来的keys可能是逗号分隔的key组成的字符串或者targetkeys数组
		let targetKeys;
		if (typeof keys === 'string') {
			targetKeys = this.keysStrToTargetKeys(keys);
		} else if (keys instanceof Array) {
			targetKeys = keys;
		} else {
			return { display: '', value: '' };
		}

		let valueObj = targetKeys.reduce((prev, cur_key, index) => {
			let curItem = this.findItemsByKey(cur_key, this.props.dataSource);
			if (curItem) {
				return {
					display: index == 0 ? curItem.title : prev.display + ', ' + curItem.title,
					value: index == 0 ? curItem.key : prev.value + ',' + curItem.key
				};
			} else {
				return prev;
			}
		}, '');
		return valueObj ? valueObj : { display: '', value: '' };
	};

	// 逗号分隔的字符串keys转成穿梭组件的targetKeys数组
	keysStrToTargetKeys = (keysStr) => {
		if (keysStr.value) {
			keysStr = keysStr.value;
		}
		keysStr = keysStr || '';
		let targetKeys = keysStr.split(',');
		// 从穿梭组件的数据源中匹配每一个key对应的项，找到说明key有效，找不到说明key无效，就不能放在穿梭的targetkeys中,否则会报错
		targetKeys.forEach((key, index) => {
			let item = this.findItemsByKey(key, this.props.dataSource);
			if (!item) {
				targetKeys.splice(index, 1);
			}
		});
		return targetKeys;
	};

	// 取消按钮的事件
	handleCancelBtn = () => {
		let valObj_bak = this.keysToValueObj(this.state.keysStr_bak);
		this.onTargetKeysChange(this.state.keysStr_bak);
		this.setState({
			showModal: false
		});

		// 适配平台张横的onchange事件
		this.props.onChange(valObj_bak, valObj_bak);

		this.props.onBlur(valObj_bak);
	};

	// 确定按钮的事件
	handleSureBtn = () => {
		this.toggleModal();
		// 适配平台张横的onchange事件
		this.props.onChange(this.state.valObj, this.state.valObj);

		this.props.onBlur(this.state.valObj);
	};
	// 绑定快捷键
	bindHotKeys = () => {
		return (
			<NCHotKeys
				keyMap={{
					f2: 'f2',
					tab: [ 'tab', 'shift+tab' ],
					sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM, // 确定按钮快捷键
					cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL // 取消按钮快捷键
				}}
				handlers={{
					f2: () => {
						let activeEle = document.activeElement;
						let focusFlag = activeEle.classList.contains('cell-input');
						if (focusFlag) {
							activeEle.blur();
							this.setState({
								showModal: true
							});
						}
					},
					tab: () => {
						!this.state.showModal && this.props.onBlur(this.state.valObj);
					},
					sureBtnHandler: this.handleSureBtn,
					cancelBtnHandler: this.handleCancelBtn
				}}
				attach={document.body}
				focused={true}
			/>
		);
	};

	setNcModalType = (type) => {
		this.setState({ ncModalType: type ? 'max' : 'sm' });
	};
	render() {
		let { keysStr, modalTitle, disabled, render, ...others } = this.props;
		const transferProps = {
			...others,
			targetKeys: this.state.targetKeys,
			onTargetKeysChange: this.onTargetKeysChange,
			lazy: { container: 'modal' } // 解决穿梭在模态框中初始不显示内容的bug
		};
		return (
			<div className="refer-wrapper clearfix">
				{this.bindHotKeys()}
				<div className="cell-wrapper refer clearfix refer-input-common" ref="cellWrapper">
					<FormControl
						autoFocus
						disabled={disabled}
						className="cell-input"
						value={this.state.valObj.display}
					/>
					<span
						// className="iconfont icon-canzhaozuixin cell-icon"
						className="icon-refer"
						style={{ cursor: 'pointer' }}
						onClick={disabled ? null : this.toggleModal}
					/>
				</div>
				<Modal
					className="simpleModal transfer-modal"
					show={this.state.showModal}
					backdrop={'static'}
					onHide={this.toggleModal}
					ref={(NCModal) => (this.NCModal = NCModal)}
					fieldid={this.props.fieldid}
					type={this.state.ncModalType}
				>
					<Header
						closeButton
						closeButtonClick={this.handleCancelBtn}
						showMaxButton={true}
						maxButtonClick={this.setNcModalType}
					>
						<Title>{modalTitle}</Title>
						{/* <i
							className="iconfont icon-guanbi dnd-cancel"
							style={{ cursor: 'pointer' }}
							onClick={this.handleCancelBtn}
						/> */}
					</Header>
					<Body>
						<Transfer className="nc-theme-transfer-list-body-bgc" {...transferProps} />
					</Body>
					<Footer>
						<NCTooltip
							placement="top"
							inverse
							overlay={`${getLangByResId(this, '4001COMPONENTS-000000')} (${NCHotKeys.USUAL_KEYS
								.NC_MODAL_CONFIRM}) `}
							trigger={[ 'hover', 'focus' ]}
							className="model-helper-overlay"
						>
							<Button
								fieldid="transferInTablSure_btn"
								onClick={this.handleSureBtn}
								className="button-primary"
							>
								{getLangByResId(this, '4001COMPONENTS-000000') /* 国际化处理： 确定*/}(<u>Y</u>)
							</Button>
						</NCTooltip>
						<NCTooltip
							placement="top"
							inverse
							overlay={`${getLangByResId(this, '4001COMPONENTS-000001')}  (${NCHotKeys.USUAL_KEYS
								.NC_MODAL_CALCEL}) `}
							trigger={[ 'hover', 'focus' ]}
							className="model-helper-overlay"
						>
							<Button fieldid="transferInTablCancel_btn" onClick={this.handleCancelBtn}>
								{getLangByResId(this, '4001COMPONENTS-000001') /* 国际化处理： 取消*/}(<u>N</u>)
							</Button>
						</NCTooltip>
					</Footer>
				</Modal>
			</div>
		);
	}
}
