/*
 * 子表左右表格组件
 * @Author: yangls7 
 * @Date: 2020-02-13 19:53:15 
 * @Last Modified by: zhaoqiangq
 * @Last Modified time: 2022-04-18 17:06:22
 */
import React, { Component } from 'react';
import './index.less';
export default class LeftRight extends Component {
	constructor(props) {
		super(props);
		const { LeftTableConfig, RightTableConfig, MiddleTableConfig } = this.props;
		if (LeftTableConfig) this.props.parentProps.use.cardTable(LeftTableConfig.area);
		if (RightTableConfig) this.props.parentProps.use.cardTable(RightTableConfig.area);
		if (MiddleTableConfig) this.props.parentProps.use.cardTable(MiddleTableConfig.area);
		this.defaultTableConfig = {
			//表格默认配置
			adaptionHeight: true,
			hideSwitch: () => {
				return false;
			}
		};
	}
	/**
	 * 根据列表和按钮的配置创建一个表格区域
	 * @param {*} tableConfig 
	 * @param {*} buttonCOnfig 
	 */
	createTable(tableConfig, buttonConfig) {
		const { cardTable, button } = this.props.parentProps;
		return (
			tableConfig &&
			cardTable.createCardTable(tableConfig.area, {
				tableHead: () => {
					return (
						buttonConfig && <div className="definition-icons">{button.createButtonApp(buttonConfig)}</div>
					);
				},
				...this.defaultTableConfig,
				...tableConfig
			})
		);
	}
	render() {
		const {
			LeftButtonConfig,
			LeftTableConfig,
			RightButtonConfig,
			RightTableConfig,
			MiddleButtonConfig,
			MiddleTableConfig
		} = this.props;
		const { DragWidthCom } = this.props.parentProps;
		const isThree = MiddleButtonConfig || MiddleTableConfig;
		const leftWid = isThree ? '33.3%' : '50%';
		return (
			<div className="leftRightTable flex-container">
				<DragWidthCom
					defLeftWid={leftWid}
					leftMinWid={leftWid}
					leftDom={this.createTable(LeftTableConfig, LeftButtonConfig)}
					rightDom={
						//是否有中间表格
						isThree ? (
							<DragWidthCom
								defLeftWid={'50%'}
								leftMinWid={'50%'}
								leftDom={this.createTable(MiddleTableConfig, MiddleButtonConfig)}
								rightDom={this.createTable(RightTableConfig, RightButtonConfig)}
							/>
						) : (
							this.createTable(RightTableConfig, RightButtonConfig)
						)
					}
				/>
			</div>
		);
	}
}
