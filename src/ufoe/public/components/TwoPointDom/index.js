import React, { Component } from 'react';
import './index.less';
export default class TwoPointDom extends Component {
	static defaultProps = {
		LeftDom: () => {},
		RightDom: () => {},
		PopWidth: 200
	};
	constructor(props) {
		super(props);
		this.mouseDown = false;
		this.state = {
			isShow: true
		};
	}

	bindLeftDOM = (dom) => {
		this.divDom = dom;
	};

	componentDidMount() {
		if (this.divDom) {
			this.clientWid = this.divDom.clientWidth;
		}
		this.onMouseDown.call(this);
	}

	onMouseDown() {
		document.addEventListener('mousemove', (e) => {
			if (this.mouseDown && this.divDom) {
				let offsetwidth = document.getElementById("dragWidthCom_left").getBoundingClientRect().left
				let wid = this.clientWid + (e.clientX - this.beginX - offsetwidth);
				if (wid >= this.box.clientWidth - 20 || wid <= 50) {
					this.divDom.style.width = this.divDom.clientWidth + 'px';
				} else {
					this.divDom.style.width = wid + 'px';
				}
			}
		});

		document.addEventListener('mouseup', () => {
			if (this.mouseDown) {
				this.mouseDown = false;
				if (this.divDom) {
					this.clientWid = this.divDom.clientWidth;
				}
				this.maskRightDom && (this.maskRightDom.style.display = 'none');
				this.maskLeftDom && (this.maskLeftDom.style.display = 'none');
				
				typeof this.props.onDragStop === 'function' && this.props.onDragStop(this.divDom.style.width);
				typeof this.props.onAfter === 'function' && this.props.onAfter();
			}
		});

		this.spanDom.addEventListener('mousedown', (e) => {
			this.beginX = this.clientWid;
			this.mouseDown = true;
			// 加个遮罩 应对  iframe的情况
			this.maskRightDom && (this.maskRightDom.style.display = 'block');
			this.maskLeftDom && (this.maskLeftDom.style.display = 'block');
		});
	}
	/**
	 * @method 箭头点击事件
 	 */
	 ClickArrow = () => {
		 this.setState(
			 {
				 isShow: !this.state.isShow
			 },
			 () => {
				 if (this.props.onAfter && this.props.onAfter instanceof Function) {
					 this.props.onAfter();
				 }
			 }
		 );
	};
	render() {
		let lefWid = this.props.defLeftWid || this.props.PopWidth || '200px';
		if(!lefWid.toString().endsWith('px')){
			lefWid = `${lefWid}px`;
		}
		return (
			<div
				className="dragWidthCom epmp"
				ref={(box) => {
					this.box = box;
				}}
			>
				<div
					id="dragWidthCom_left"
					className="dragWidthCom_left"
					style={{ width: lefWid}}
					style={{ width: this.state.isShow ? `${lefWid}` : '0px' }}
					ref={this.bindLeftDOM}
				>
					<div
						className="dragWidthCom_mask"
						ref={(mask) => {
							this.maskLeftDom = mask;
						}}
					/>
					{/* 收缩箭头 */}
					<div
						className={`button iconfont ${this.state.isShow ? 'icon-jiantouzuo' : 'icon-jiantouyou'}`}
						onClick={this.ClickArrow}
					/>					
					{this.props.leftDom || this.props.LeftDom}
				</div>
				<div
					ref={(span) => {
						this.spanDom = span;
					}}
					className="dragWidthCom_line"
				>
					<div className="dragWidthCom_lines" />
				</div>
				<div className="dragWidthCom_right" id="scroll_container">
					<div
						className="dragWidthCom_mask"
						ref={(mask) => {
							this.maskRightDom = mask;
						}}
					/>
					{this.props.rightDom || this.props.RightDom}
				</div>
			</div>
		);
	}
}
