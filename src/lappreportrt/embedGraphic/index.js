import React from 'react';
import ReactDOM from 'react-dom';
import Utils from "@public/utils";
import { getRelatedAppData } from './ajaxMethods';
import { base, getMultiLang } from 'nc-lightapp-front';
import WrapGraphicReport from './WrapGraphicReport';
import SchemeItem from './SchemeItem';
import classnames from 'classnames';
import './index.less';
import PropTypes from 'prop-types';
import { getFilterParamArr, handleCardUpdateLogic, handleBillUpdateLogic } from './methods';
import emptyImage from './empty.png';
import {BillType, ComponentSource} from './const'
const { NCDropdown, NCLoading } = base;
const { langCheck } = Utils;

class EmbedGraphic extends React.Component {
	constructor(props) {
		super(props);
		// 三种分析参数类型
		this.constantArr = [];
		this.fieldArr = [];
		this.conditionArr = [];
		this.currentCardFormData = null; // 当前卡片页面的表单数据
		this.state = {
			searchParams: {}, // 查询参数
			analysisParams: {}, // 分析型参数，这个是前端构造
			schemeParams: {}, // 分析型参数，这个跟analysisParams的区别是，前端传schemeParams给后端处理构造，和analysisParams功能一样
			pkcode: [], // 表格中勾选的pk字符串
			schemeList: [], // 查询方案列表
			currentSchemeObj: {}, // 当前查询方案
			isMax: false, // 是否最大化
			isLoadGraphic: false, // 是否加载嵌入式分析组件，默认不加载，点击查询或者更新的时候才会加载
			showHelp: false, // 帮助提示
			isShowShade: false, // 遮罩是否显示
			showLoading: false, // 是否显示loading
			refreshKey: Date.now()
		};
    }

    componentWillMount() {
        let callback = json => {
            window.embedGraphicMultiLang = json;
        };
        getMultiLang({
            moduleId: 100305,
            currentLocale: "zh-CN",
            domainName: "lappreportrt",
            callback,
        });
    }

	componentDidMount() {
        const { billType, headId, searchId, appcode, pagecode, _this, componentSource } = this.props;
        // 这个组件在设计器用的时候，不要走业务逻辑
        if ( componentSource === ComponentSource['designer'] ) {
            return
        }
		// 获取查询方案
		getRelatedAppData(appcode, pagecode).then((result) => {
			if (result.length > 0) {
				let currentSchemeObj = result.find((item) => item.default_scheme) || result[0]; // 找到默认方案，没有的话取第一个
				let { pk_storyboard, mdid, apppage, analysismodel: { associated_object } } = currentSchemeObj;
				getFilterParamArr.call(this, associated_object);
				this.setState({
					schemeList: result,
					currentSchemeObj,
					schemeParams: {
						pk_storyboard,
						associated_object,
						mdid,
						pk_apppage: apppage
					}
				});
				if (billType === BillType['card']) {
					_this.props.form.addEventListener(headId, 'setAllFormValue', this.handleCardChange);
				} else {
					_this.props.search.addEventListener(searchId, 'clickSearchBtn', this.handleSearchChange);
				}
			}
		});
	}

	// 切换查询方案
	handleSelectChange = (value) => {
		const { billType, searchId, _this } = this.props;
		let queryInfo
		// 列表页面才会有查询区，进行查询区必填项的校验
		if (billType === BillType['grid'] && searchId) {
			queryInfo = _this.props.search.getQueryInfo(searchId)
			if (!queryInfo.querycondition) {
				return
			}
		}
		let result = this.state.schemeList.find((item) => item.analysis_id === value);
		let { pk_storyboard, mdid, apppage, analysismodel: { associated_object, loading } } = result;
		getFilterParamArr.call(this, associated_object);
		this.setState(
			{
				currentSchemeObj: result,
				schemeParams: {
					pk_storyboard,
					associated_object,
					mdid,
					pk_apppage: apppage
				},
				isLoadGraphic: false,
				isShowShade: false,
				showLoading: loading === 'Y'// 只有勾选了查询时加载， 和查询必填项都填了，切换方案才会显示loading
			},
			() => {
				if (loading === 'Y') {
					if (billType === BillType['card'] ) {
						this.handleCardChange();
					} else {
						handleBillUpdateLogic.call(this, 'search', queryInfo);
					}
				}
			}
		);
	};

	// 响应单据页面查询区变化监听事件
	handleSearchChange = (items, type, queryInfo, searchInfo) => {
		let { analysismodel } = this.state.currentSchemeObj;
		if (!analysismodel || analysismodel.loading == 'N') {
			return;
		}
		handleBillUpdateLogic.call(this, 'search', searchInfo);
	};

	// 响应卡片页面主表设值事件监听
	handleCardChange = (data) => {
		if (data) {
			this.currentCardFormData = data;
		}
		let { analysismodel } = this.state.currentSchemeObj;
		if (!analysismodel || analysismodel.loading == 'N') {
			return;
		}
		handleCardUpdateLogic.call(this, 'search', this.currentCardFormData);
	};

	// 更新数据
	handleUpdate = () => {
		if (this.props.billType === BillType['card']) {
			handleCardUpdateLogic.call(this, 'manualUpdate', this.currentCardFormData);
		} else {
			handleBillUpdateLogic.call(this, 'manualUpdate');
		}
	};

	// 最大最小化
	handleMax = () => {
		const { dragId, _this } = this.props;
		_this.props.dragWidthCom.maxSideBox(dragId, !this.state.isMax);
		this.setState({
			isMax: !this.state.isMax
		});
	};

	// 显示帮助弹框
	updateHelpBox = (flag) => {
		this.setState({
			showHelp: flag
		});
	};

	createSchemeListDOM = () => {
		const { schemeList, currentSchemeObj } = this.state;
		let noDefault = schemeList.every((item) => !item.default_scheme);
		if (noDefault) {
			schemeList.forEach((item, index) => {
				item.default_scheme = index === 0;
			});
		}
		return (
			<ul className="scheme-container menu_items nc-theme-area-bgc nc-theme-area-split-bc">
				{schemeList.map((item) => (
					<SchemeItem
						schemeList={schemeList}
						itemData={item}
						updateList={(val) => this.setState({ schemeList: val })}
						handleSelectChange={this.handleSelectChange}
						currentSchemeObj={currentSchemeObj}
					/>
				))}
			</ul>
		);
	};

	handleVisibleChange = (visible) => {
		this.setState({
			isShowShade: visible
		})
	}

	getElement = () => {
		return document.querySelector('.embed-graphic-box');
	}

	handleIframeLoaded = (showLoading) => {
		this.setState({
			showLoading
		})
	}

	render() {
		const { _this, componentSource  } = this.props;
		const {
			refreshKey,
			analysisParams,
			currentSchemeObj,
			schemeList,
			schemeParams,
			searchParams,
			pkcode,
			isMax,
			showHelp,
			isLoadGraphic,
			isShowShade,
			showLoading
        } = this.state;
        // 多语：请用如下方式调用
		return !_this && componentSource !== ComponentSource['designer'] ? (
            <h1>{ langCheck('embedGraphicMultiLang', '100305-000001') }：createEmbedGraphic.call(this, params)</h1>
		) : (
			<div className="embed-graphic-box">
				<div className="head-container nc-theme-area-split-bc">
					<div className="left-area">
						{schemeList.length > 1 ? (
							<NCDropdown
								trigger={[ 'click' ]}
								overlay={this.createSchemeListDOM()}
								animation="slide-up"
								overlayClassName="scheme-drop-more drop-more"
								onVisibleChange={this.handleVisibleChange}
							>
								<div className="scheme-current-name">
									<span>
										{currentSchemeObj.shcemename}
									</span>
									<i className="iconfont icon-hangcaozuoxiala1" />
								</div>
							</NCDropdown>
						) : (
							<span>{schemeList[0] && schemeList[0].shcemename}</span>
						)}
					</div>
					<div className="right-area">
						<div>
							<span className="update-area">
                                    <span className="update-box" onClick={this.handleUpdate}>
                                        {/* 多语：更新数据 */}
                                    { langCheck('embedGraphicMultiLang', '100305-000002') }
								</span>
                                    <span className="help-box nc-theme-area-bgc">
                                        {/* 多语：点击查询自动更新数据，勾选行需要手动更新数据 */}
                                        {showHelp && <span className="content  nc-theme-xrow-bgc">{ langCheck('embedGraphicMultiLang', '100305-000003')}</span>}
									<i
										class="iconfont icon-bangzhutishi"
										onMouseEnter={this.updateHelpBox.bind(this, true)}
										onMouseLeave={this.updateHelpBox.bind(this, false)}
									/>
								</span>
							</span>
							<span className="max-box" onClick={this.handleMax}>
								<i class={classnames('iconfont', isMax ? 'icon-zuixiaohua' : 'icon-zuidahua')} />
							</span>
						</div>
					</div>
				</div>
				<div className="content-container">
					{isLoadGraphic ? (
						<WrapGraphicReport
							refreshKey={refreshKey}
							schemeParams={schemeParams}
							searchParams={searchParams}
							analysisParams={analysisParams}
							pkcode={pkcode}
							iframeLoaded={this.handleIframeLoaded}
						/>
					) : (
						<div className="no-data-box">
                            <img src={emptyImage} className="nc-theme-derived-img-opacity"/>
                            {/* 多语： 暂无数据 */}
                            <span className="no-data nc-theme-common-font-c">{ langCheck('embedGraphicMultiLang', '100305-000004') }</span>
						</div>
					)}
					<div className={classnames('shade-box', { show: isShowShade })} />
				</div>
				<NCLoading
					size="md"
					showBackDrop={true}
					container={this.getElement}
					show={showLoading}
				/>
			</div>
		);
	}
}

EmbedGraphic.propTypes = {
	billType: PropTypes.string, // 单当应用的类型，单据or卡片
	dragId: PropTypes.string, // 拖拽组件区域id
	appcode: PropTypes.string, // 应用code
	pagecode: PropTypes.string, // 页面code
	searchId: PropTypes.string, // 查询区区域id
	pkname: PropTypes.string, // 单据表格唯一字段名
	headId: PropTypes.string, // 单据表格区域id or 卡片主表区域id
	bodyId: PropTypes.array // 卡片子表区域id
};

EmbedGraphic.defaultProps = {
	billType: BillType['grid']
};

if (NODE_ENV !== "development") {
    // eslint-disable-next-line no-undef
    console.log(
        `%c lappreportrt was built from ${BRANCH} at: ${LAPPREPORTRT_VERSION} `,
        "background:#222;color:#bada55"
    );
}
export default function createEmbedGraphic(config) {
	if (typeof config !== 'object') {
		return '配置对象必须是对象类型';
	}
	return <EmbedGraphic {...config} _this={this} />;
}
