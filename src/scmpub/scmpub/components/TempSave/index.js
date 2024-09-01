/*
 * @Author: wangceb
 * @PageInfo: 暂存提供的服务
 * @Date: 2019-03-19 15:10:00
 * @Last Modified by: hufei
 * @Last Modified time: 2022-06-10 15:30:39
 */
import save_btnClicks from './btnClicks/save_btnClicks';
import operate_buttonClick from './btnClicks/operate_buttonClick';
import { base } from 'nc-lightapp-front';
import React, { Component } from 'react';
import initTemplet from './init/initTemplet';
import { initLang, getLangByResId } from '../../pub/tool/multiLangUtil';
import './index.less';
const { NCModal, NCTable, NCTooltip } = base;
const ACTIONS = { SAVE: save_btnClicks };

class TempDataList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tempDataList: {},
			summary: []
		};
		this.columns = [];
		this.isCheck = false;
		this.init();
		initTemplet.call(this, this.props, true);
	}

	init = () => {
		initLang(this, [ '4001tempsave' ], 'scmpub', this.initColumns);
	};

	initColumns = () => {
		this.columns = [
			{
				title: <span fieldid="tempsaveindex_table">{getLangByResId(this, '4001TEMPSAVE-000000')}</span>, // 序号
				dataIndex: 'index',
				key: 'index',
				width: '5%',
				render: (text, record, index) => {
					return <span fieldid="tempsaveindex_table">{index + 1}</span>;
				}
			},
			{
				title: <span fieldid="tempsavetitle_table">{getLangByResId(this, '4001TEMPSAVE-000001')}</span>, // 标题
				dataIndex: 'title',
				key: 'title',
				width: '85%',
				render: (text, record) => {
					let { title } = record;

					let dom = (
						<div className="row-data">
							{/* 摘要第一行数据，渲染表头数据 */}
							<div className="summaryLineOne">
								{title.summaryH && <span>{title.summaryH.join(',')}</span>}
							</div>
							{/* 摘要第二行数据渲染，遍历表体数组，将有值的对象渲染 */}
							{title.summaryB && (
								<div className="summaryLineTwo">
									{title.summaryB.length != 0 &&
										title.summaryB.map((item) => <span>[{item.join(',')}]</span>)}
								</div>
							)}
							{/* 摘要第三行数据，时间戳 */}
							<div className="date">{title.createDate}</div>
						</div>
					);
					return (
						<NCTooltip placement="top" fieldid="tempsavetitle_table" className="tempsave_tip" overlay={dom}>
							{dom}
						</NCTooltip>
					);
				}
			},
			{
				title: <span fieldid="tempsavebutton_table">{getLangByResId(this, '4001TEMPSAVE-000002')}</span>, // 操作
				dataIndex: 'opr',
				key: 'opr',
				// fixed: 'right',
				width: '10%',
				render: (text, record, index) => {
					return (
						<div fieldid="tempsavebutton_table">
							{/* 打开 */}
							<a onClick={operate_buttonClick.bind(this, this.props, 'Open', text, record, index)}>
								{getLangByResId(this, '4001TEMPSAVE-000004')}
							</a>
							{'  '}
							{/* 删除 */}
							<a onClick={operate_buttonClick.bind(this, this.props, 'Delete', text, record, index)}>
								{getLangByResId(this, '4001TEMPSAVE-000005')}
							</a>
						</div>
					);
				}
			}
		];
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.display) {
			if (this.isCheck) {
				//保证一次查询不会走多遍
				this.isCheck = false;
				return;
			}
			initTemplet.call(this, this.props, false);
		}
	}

	// 界面组装
	render() {
		return (
			<div>
				<NCModal
					size="xlg"
					show={this.props.display}
					onHide={this.props.close}
					backdropClosable={false}
					className="tempdatalistmodal"
				>
					<NCModal.Header closeButton>
						{/* 草稿列表 */}
						<NCModal.Title>{getLangByResId(this, '4001TEMPSAVE-000003')}</NCModal.Title>
					</NCModal.Header>

					<NCModal.Body className>
						{this.columns && (
							<NCTable
								inModal={true}
								columns={this.columns}
								data={this.state.summary}
								addBlankCol={false}
								bodyStyle={{ height: 453 }}
								scroll={{ y: 453 }}
								className="tempsave_butn"
								bordered
							/>
						)}
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}

export { ACTIONS, TempDataList };
