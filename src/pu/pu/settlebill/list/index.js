import React, { Component } from 'react';
import { createPage, base, ajax, high, cacheTools } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { URL, PAGECODE, BUTTON, FIELD, COMMON } from '../constance';
import { searchBtnClick, pageInfoClick, btnClick } from './btnClicks';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import { createPageIcon } from 'nc-lightapp-front';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCDiv } = base;
class SettleBillList extends Component {
	constructor(props) {
		super(props);
		this.tableID = PAGECODE.tableId;
		props.use.search('settlebill_query');
		props.use.table(this.tableID);
		this.pagecode = PAGECODE.pagecode;
		this.searchdata;
		this.state = {
			searchVal: null,
			pk: '',
			billID: '',
			billNo: '',
			showTrack: false,
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false //控制弹框
		}; //查询条件缓冲
		// initTemplate.call(this, props);
		initLang(this, [ '4004settlebill' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		// this.toggleShow();
		let pks = cacheTools.get('linkQueryByPuSettlement');
		if (pks && pks.pks) {
			let ids = pks.pks;
			ajax({
				url: '/nccloud/pu/settlebill/querybypks.do',
				data: ids,
				success: (res) => {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg //参数一：返回的公式对象
						);
					}
					let { success } = res;
					if (success) {
						if (res.data && res.data.settlebill_list) {
							let rowsData = res.data.settlebill_list;
							this.props.table.setAllTableData(PAGECODE.tableId, rowsData);
						} else {
							showWarningInfo(null, getLangByResId(this, '4004SETTLEBILL-000012'));
							this.props.table.setAllTableData(PAGECODE.tableId, { rows: [] });
						}
						let butArray = [
							BUTTON.cancelToIA,
							BUTTON.del,
							BUTTON.file,
							BUTTON.linkQuery,
							BUTTON.print,
							BUTTON.sendToIA,
							BUTTON.review,
							BUTTON.output
						];
						this.props.button.setButtonDisabled(butArray, true);
						this.props.button.setButtonDisabled([ BUTTON.refreash ], false);
					}
					cacheTools.remove('linkQueryByPuSettlement');
				}
			});
		}
	}

	//切换页面状态时按钮显示隐藏的问题
	toggleShow = () => {
		this.onSelect();
	};

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(PAGECODE.searchId, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let orgvalue = pk_org.value.firstvalue;
			let arr = orgvalue.split(',').map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(FIELD.pk_org, arr);
		}
	};

	onAfterEvent(field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(this.props, val, PAGECODE.searchId, [
				FIELD.pk_supplier,
				FIELD.pk_material,
				'po_settlebill_b.pk_srcmaterial.pk_marbasclass',
				'po_settlebill_b.pk_material.pk_marbasclass'
			]);
		}
	}

	render() {
		const { table, socket, search, ncmodal } = this.props;
		const { createSimpleTable } = table;
		const { NCCreateSearch } = search;
		const { createModal } = ncmodal;
		let { createButtonApp } = this.props.button;
		let { showUploader, target } = this.state;
		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: PAGECODE.tableId,
					billpkname: 'pk_settlebill',
					billtype: '27'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createPageIcon()}
						<h2 className="title-search-detail">{getLangByResId(this, '4004SETTLEBILL-000006')}</h2>
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: 'list_head',
							buttonLimit: 5,
							onButtonClick: btnClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk}
							type="27"
						/>
						{showUploader && (
							<NCUploader
								billId={this.state.billID}
								billNo={this.state.billNo}
								target={target}
								placement={''}
								onHide={this.onHideUploader}
							/>
						)}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch('settlebill_query', {
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this),
						defaultConditionsNum: 5,
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent
					})}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableID, {
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: this.onSelect.bind(this),
						onSelectedAll: this.onSelect.bind(this),
						dataSource: COMMON.settlebillCacheKey,
						pkname: 'pk_settlebill',
						componentInitFinished: this.onSelect.bind(this)
					})}
				</div>
				{createModal(BUTTON.del)}
			</div>
		);
	}

	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	doubleClick = (record, index) => {
		let pk_settlebill = record.pk_settlebill.value;
		this.props.pushTo(URL.gotoCard, { status: 'browse', id: pk_settlebill, pagecode: PAGECODE.cardcode });
	};

	onSelect = () => {
		let butArray = [
			BUTTON.cancelToIA,
			BUTTON.del,
			BUTTON.file,
			BUTTON.linkQuery,
			BUTTON.print,
			BUTTON.sendToIA,
			BUTTON.review,
			BUTTON.output,
			BUTTON.refreash
		];
		let rows = this.props.table.getCheckedRows(PAGECODE.tableId);
		if (rows && rows.length > 0) {
			this.props.button.setButtonDisabled(butArray, false);
			if (rows.length == 1) {
				let btoia = rows[0].data.values.btoia.value;
				if (btoia) {
					this.props.button.setButtonDisabled(BUTTON.sendToIA, true);
				} else {
					this.props.button.setButtonDisabled(BUTTON.cancelToIA, true);
				}
			}
		} else {
			this.props.button.setButtonDisabled(butArray, true);
		}
		if (getDefData(COMMON.settlebillCacheKey, 'settlebillsearchdata')) {
			this.props.button.setButtonDisabled(BUTTON.refreash, false);
		}
	};
}

SettleBillList = createPage({})(SettleBillList);

export default SettleBillList;
