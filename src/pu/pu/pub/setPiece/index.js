/*
 * @Author: jiangfw
 * @PageInfo: 成套件
 * @Date: 2018-06-28 09:15:54
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:42:05
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal } = base;
import { initTemplate } from './init';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { AREA } from './constance/constance';
import './index.less';

class SetPiece extends Component {
	constructor(props) {
		super(props);
		props.use.table(AREA.headSetPiece);
		props.use.table(AREA.bodySetPiece);
		initLang(this, [ '4004setpiece' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.showModal && nextProps.setPieceData) {
			this.showSetPiece(nextProps.setPieceData);
		} else {
			nextProps.showModal = false;
		}
	}

	//展示数据
	showSetPiece(setPieceData) {
		this.props.table.setAllTableData(AREA.headSetPiece, setPieceData[0].head.headSetPiece);
		this.props.table.setAllTableData(AREA.bodySetPiece, setPieceData[0].body.bodySetPiece);
	}

	render() {
		const { createSimpleTable } = this.props.table;
		return (
			<div>
				<NCModal
					size="lg"
					show={this.props.showModal}
					onHide={this.props.onClose}
					dialogClassName="setPiece-modal"
					fieldid="pupub_setprice"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004SETPIECE-000001') /* 国际化处理： 成套件信息*/}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div className="top-table">{createSimpleTable(AREA.headSetPiece)}</div>
						<div className="bottom-table flex-container">
							{createSimpleTable(AREA.bodySetPiece, { showIndex: true })}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (SetPiece = createPage({})(SetPiece));
