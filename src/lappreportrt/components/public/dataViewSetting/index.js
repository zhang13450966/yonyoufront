import React, { Component } from "react";
import ReactDOM from "react-dom";
import { base, toast } from "nc-lightapp-front";
import DataViewModal from "../dataViewModal";
import { operateDataView } from "../dataViewModal/ajaxMethod.js";
import ViewIngTipsModal from "./components/viewIngTipsModal";
import ViewIngModal from "./components/viewIngModal";
import { SEARCHID } from "@components/ReportTable/config";
import Utils from "@public/utils";
import { DATE_VIEW_REFER_CONFIG } from "../dataViewModal/constants";

const { langCheck } = Utils;
import "./index.less";

const { NCDropdown, NCMenu, NCButton, NCTooltip } = base;
const { Item } = NCMenu;

class DataViewSetting extends Component {
    constructor(props) {
        super(props);
        this.style = {};
        this.state = {
            viewDataIngVisibile: false, // 预览视图中visible
            viewDataIngTipsVisibile: false, // 预览视图做新增等操作等tips viesible
            needClearCacheFlag: false, // 是否需要清除缓存的flag
            continueSetDataViewFlag: false, // 触发继续的falg
            viewDataIngSaveFlag: false, // 预览视图中的保存触发flag
            viewDataIngSaveAsFlag: false, // 预览视图中的另存触发flag
            dataViewMenuArr: [],
            currentSelectDataViewIndex: 0, // 对勾的index
            curSelectModelIndex: 0, // 做视图编辑的时候的index
            curDataViewHoverIndex: -1, // 鼠标移动到某一行 显示tips的index
            dataViewIconFlag: false,
            saveAsType: 1, // 1是另存新视图 2是重命名
            entranceType: "add", // 进入视图数据弹窗的入口 有三种 add:下拉底部视图设置(相当于新建),  edit: 下拉项右肩视图设置(相当于编辑), refer: 查询区参照进入

            selectCacheIndex: -1, // 值为-1的时候 不显示对勾 其他则显示,
            dataViewDropDownVisible: false, //
            cacheSearchInfo: {},
            isHover: false,
            isViewingAndSave: false, // 预览中的保存
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataViewSourceData !== nextProps.dataViewSourceData) {
            this.setState({ dataViewMenuArr: nextProps.dataViewSourceData });
        }
        if (
            this.props.currentSelectDataViewIndex !==
            nextProps.currentSelectDataViewIndex
        ) {
            this.setState({
                currentSelectDataViewIndex:
                    nextProps.currentSelectDataViewIndex,
                selectCacheIndex: nextProps.currentSelectDataViewIndex,
            });
        }
    }

    componentDidMount() {
        this.props.onRef(this);
        this.setState({
            dataViewMenuArr: this.props.dataViewSourceData,
            currentSelectDataViewIndex: this.props.currentSelectDataViewIndex,
            selectCacheIndex: this.props.currentSelectDataViewIndex,
        });
    }

    changeDataView = index => {
        // this.setState({
        //   dataViewDropDownVisible: false,
        // });

        if (!this.props.search.getAllSearchData(SEARCHID, true)) {
            return;
        } // 查询区校验必填项 如果为false说明有未填写的必填项

        this.setDropDownDataViewVisibile(false);
        this.setState({ isHover: false });

        if (this.state.viewDataIngVisibile) {
            // 处于数据视图预览中状态，不能进行操作
            this.setState({ viewDataIngTipsVisibile: true });
            return;
        }

        this.props.setIsAddNewDataView(false); // 新加的数据视图 对勾要打在这上面

        const curDisplayName = this.state.dataViewMenuArr[index].name;
        const curCode = this.state.dataViewMenuArr[index].code;

        this.props.search.setSearchValByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            {
                display: curDisplayName,
                value: curCode,
            },
            // 'super'
        );
        this.setState({ currentSelectDataViewIndex: index });
        this.props.setCurSelectDataViewIndex(index);
        this.props.fetchTableData(this.state.dataViewMenuArr[index]);
    };

    renameDataView = (item, index) => {
        if (this.state.viewDataIngVisibile) {
            // 处于数据视图预览中状态，不能进行操作
            this.setState({ viewDataIngTipsVisibile: true });
            return;
        }
        this.setState({
            saveAsType: 2,
            renameData: item,
        });
        this.setDropDownDataViewVisibile(false);
        this.setState({ isHover: false });
    };

    setDefaultDataView = (item, index) => {
        // if (this.state.viewDataIngVisibile) { // 处于数据视图预览中状态，不能进行操作 设为默认视图可以操作
        //   this.setState({ viewDataIngTipsVisibile: true });
        //   return
        // }

        this.props.search.setTemlateByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            "initialvalue",
            {
                display: item.name,
                value: item.code,
            },
        );

        const params = {
            default_code: item.code,
            reportpk: item.reportpk,
        };

        operateDataView(params).then(res => {
            if (res === "success") {
                toast({
                    content: langCheck(
                        "reportMultiLang",
                        "dataView-100301-000255",
                    ),
                    color: "success",
                }); //'操作成功'
                this.props.getAllViewData();
                this.setState({ isHover: false });
            }
        });
    };

    deleteDataView = (item, index) => {
        if (this.state.viewDataIngVisibile) {
            // 处于数据视图预览中状态，不能进行操作
            this.setState({ viewDataIngTipsVisibile: true });
            return;
        }
        this.setState({ isHover: false });
        const { currentSelectDataViewIndex } = this.state;
        const params = {
            delete_code: item.code,
            reportpk: item.reportpk,
        };
        let needInitDefault = false;
        let noneCurrnt = false;
        // if (index === this.state.dataViewMenuArr.length - 1) { // 删除的是最后一个 默认
        //   needInitDefault = true
        // }

        if (index === currentSelectDataViewIndex) {
            // 删除的是当前视图 对勾消失
            noneCurrnt = true;
            this.props.search.setTemlateByField(
                SEARCHID,
                DATE_VIEW_REFER_CONFIG.attrcode,
                "initialvalue",
                {
                    display: this.state.dataViewMenuArr[0].name,
                    value: this.state.dataViewMenuArr[0].code,
                },
            );
            this.props.search.setSearchValByField(
                SEARCHID,
                DATE_VIEW_REFER_CONFIG.attrcode,
                {
                    display: "",
                    value: "",
                },
            );
        }

        operateDataView(params).then(res => {
            if (res === "success") {
                toast({
                    content: langCheck(
                        "reportMultiLang",
                        "dataView-100301-000255",
                    ),
                    color: "success",
                }); //'操作成功'
                if (index < currentSelectDataViewIndex) {
                    this.setState({
                        currentSelectDataViewIndex:
                            currentSelectDataViewIndex - 1,
                        selectCacheIndex: currentSelectDataViewIndex - 1, // 显示对勾
                    });
                }
                this.props.getAllViewData(needInitDefault, noneCurrnt);
                this.setDropDownDataViewVisibile(false);
                this.setState({ isHover: false });
            }
        });
    };

    viewAndSearch = data => {
        // 预览
        this.props.setDataViewCacheData(data);
        this.setState({
            dataViewVisible: false,
            viewDataIngVisibile: true,
            selectCacheIndex: -1, // 对勾消失 当前视图不属于 任何已有视图
        });

        if (!this.props.search.getAllSearchData(SEARCHID, true)) {
            return;
        } // 查询区校验必填项 如果为false说明有未填写的必填项

        this.props.fetchTableData(data, false, true);
        this.props.search.setSearchValByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            {
                display: "",
                value: "",
            },
            // 'super'
        );
    };

    resetSaveAs = () => {
        // 重置另存为弹窗内的信息
        this.setState({
            saveAsType: 1,
            renameData: {},
        });
    };

    onCancleViewIngModal = () => {
        // 预览弹窗中的取消
        const { dataViewMenuArr, currentSelectDataViewIndex } = this.state;
        this.resetCacheFlag();
        this.props.setDataViewCacheData({});
        this.setState({ selectCacheIndex: currentSelectDataViewIndex, // 显示对勾
        });
        this.props.fetchTableData(dataViewMenuArr[currentSelectDataViewIndex]); // 重新查询视图预览上一次的状态
        this.props.search.setSearchValByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            this.state.cacheSearchInfo,
            // 'super'
        );
    };

    resetCacheFlag = () => {
        // 重置状态数据
        this.setState({
            viewDataIngSaveFlag: false,
            needClearCacheFlag: true,
            viewDataIngVisibile: false,
            continueSetDataViewFlag: false,
            viewDataIngSaveAsFlag: false,
        });
    };

    saveCurrentOperate = () => {
        this.setState({
            viewDataIngSaveFlag: true,
            viewDataIngVisibile: false, // 关预览中弹窗
            selectCacheIndex: this.state.currentSelectDataViewIndex, // 显示对勾
        });
        this.props.setDataViewCacheData({});
        this.props.search.setSearchValByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            this.state.cacheSearchInfo,
            // 'super'
        );
    };

    saveAsCurrentOperate = () => {
        this.setState({
            viewDataIngSaveAsFlag: true,
            viewDataIngVisibile: false, // 关预览中弹窗，
            selectCacheIndex: this.state.currentSelectDataViewIndex, // 显示对勾
            isViewingAndSave: true, // 预览中的保存
        });
        this.dataViewModalChild.saveAsNewDataView();
    };

    continueSetDataView = () => {
        // 继续设置
        this.setState({
            dataViewVisible: true, // 打开操作弹窗
            continueSetDataViewFlag: true,
            viewDataIngVisibile: false, // 关预览中弹窗
            selectCacheIndex: this.state.currentSelectDataViewIndex, // 显示对勾
        });
        this.props.setDataViewCacheData({});
        this.props.search.setSearchValByField(
            SEARCHID,
            DATE_VIEW_REFER_CONFIG.attrcode,
            this.state.cacheSearchInfo,
            // 'super'
        );
    };

    openDataView = (entranceType, index) => {
        const { viewDataIngVisibile, dataViewMenuArr, selectCacheIndex } =
            this.state;
        // this.setState({
        //   dataViewDropDownVisible: false,
        // });
        this.setState({ isHover: false });
        this.setDropDownDataViewVisibile(false);

        const allArea = [
            ...dataViewMenuArr[0].crossareacontentsets,
            ...dataViewMenuArr[0].areacontentsets,
        ];

        if (allArea.length === 0) {
            toast({
                content: langCheck("reportMultiLang", "dataView-100301-000264"),
                color: "info",
            }); //'表格无扩展区'
            return;
        }

        if (viewDataIngVisibile) {
            // 处于数据视图预览中状态
            this.setState({ viewDataIngTipsVisibile: true });
            return;
        }

        const defaultIndex = dataViewMenuArr.findIndex(
            item => item.isdefault === true,
        ); // 没有对勾的时候 用默认视图
        const resIndex = index === -1 ? defaultIndex : index;

        const resSelectCacheIndex =
            selectCacheIndex === -1 ? resIndex : selectCacheIndex;
        this.setState({
            cacheSearchInfo: {
                display: dataViewMenuArr[resSelectCacheIndex].name,
                value: dataViewMenuArr[resSelectCacheIndex].code,
            },
        });

        this.setState({
            curSelectModelIndex: resIndex,
            needClearCacheFlag: false, // 重置数据,
            continueSetDataViewFlag: false,
            dataViewVisible: true,
            entranceType,
        });
    };

    setViewDataIngTipsVisibile = value => {
        this.setState({ viewDataIngTipsVisibile: value });
    };

    setViewDataIngVisibile = value => {
        this.setState({ viewDataIngVisibile: value });
    };

    setDropDownDataViewVisibile = value => {
        this.setState({
            dataViewIconFlag: value,
            dataViewDropDownVisible: value,
        });
    };

    setIsViewingAndSave = value => {
        this.setState({ isViewingAndSave: value });
    };

    onDataViewModalRef = ref => {
        this.dataViewModalChild = ref;
    };

    render() {
        const {
            dataViewVisible,
            dataViewMenuArr,
            currentSelectDataViewIndex,
            curSelectModelIndex, // 右肩设置的index
            curDataViewHoverIndex,
            entranceType,
            viewDataIngVisibile,
            needClearCacheFlag,
            viewDataIngSaveFlag,
            viewDataIngSaveAsFlag,
            continueSetDataViewFlag,
            viewDataIngTipsVisibile,
            selectCacheIndex,
            isHover,
        } = this.state;
        const dataViewMenu = (
            <React.Fragment>
                <NCMenu
                    className="data-view-box"
                    style={{ padding: "8px 0 4px" }}
                >
                    {Array.isArray(dataViewMenuArr) &&
                        dataViewMenuArr.length > 0 &&
                        dataViewMenuArr.map((item, index) => {
                            return (
                                <Item
                                    key={item.name}
                                    style={{ position: "relative" }}
                                    onClick={() => {
                                        this.changeDataView(index);
                                    }}
                                    onMouseEnter={() => {
                                        this.setState({ curDataViewHoverIndex: index });
                                    }}
                                    className="menu-item"
                                >
                                    <div className="data-view-item-container">
                                        <div className="data-view-cur-icon">
                                            {currentSelectDataViewIndex ===
                                                index &&
                                                selectCacheIndex !== -1 && (
                                                <i
                                                    style={{ fontSize: 12 }}
                                                    className="iconfont icon-liucheng1"
                                                />
                                            )}
                                        </div>

                                        <div
                                            className="data-view-left-box nc-theme-menu-item"
                                            title={item[`name${item.multlanguage}`] || item.name}
                                        >
                                            {item[`name${item.multlanguage}`] || item.name}
                                        </div>
                                        <div
                                            style={{
                                                position: "relative",
                                                left: 4,
                                            }}
                                        >
                                            {item.isdefault && (
                                                <NCTooltip
                                                    inverse
                                                    placement="right"
                                                    rootClose
                                                    delay={500}
                                                    overlay={
                                                        <div>
                                                            {langCheck(
                                                                "reportMultiLang",
                                                                "dataView-100301-000269",
                                                            )}
                                                        </div>
                                                    }
                                                >
                                                    <i
                                                        style={{ fontSize: 12 }}
                                                        className="iconfont icon-moren"
                                                    />
                                                </NCTooltip>
                                            )}
                                        </div>
                                        {curDataViewHoverIndex === index && (
                                            <div
                                                className="data-view-right-box"
                                                onMouseEnter={e => {
                                                    let position =
                                                        e.target &&
                                                        e.target.getBoundingClientRect();
                                                    if (position) {
                                                        const domToRightDistance =
                                                            document.body
                                                                .clientWidth -
                                                            position.left;
                                                        if (
                                                            domToRightDistance <
                                                            70
                                                        ) {
                                                            this.style.left =
                                                                Math.round(
                                                                    position.left,
                                                                ) -
                                                                domToRightDistance -
                                                                18 +
                                                                "px";
                                                        } else {
                                                            this.style.left =
                                                                Math.round(
                                                                    position.left,
                                                                ) + "px";
                                                        }

                                                        this.style.top =
                                                            Math.round(
                                                                position.bottom -
                                                                    10,
                                                            ) + "px";
                                                    }
                                                    this.setState({ isHover: true });
                                                    this.style.display =
                                                        "block";
                                                }}
                                                onMouseLeave={e => {
                                                    this.setState({ isHover: false });
                                                    this.style.display = "none";
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <i
                                                    style={{ fontSize: 12 }}
                                                    className="iconfont icon-gengduo3"
                                                />
                                                {isHover &&
                                                    ReactDOM.createPortal(
                                                        <div
                                                            style={this.style}
                                                            className="data-view-tip-container u-dropdown-menu nc-theme-area-bgc"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            {/* 视图设置 */}
                                                            {index !== 0 && (
                                                                <div
                                                                    className="tip-item nc-theme-menu-item"
                                                                    onClick={() => {
                                                                        this.openDataView(
                                                                            "edit",
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    {langCheck(
                                                                        "reportMultiLang",
                                                                        "dataView-100301-000238",
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* 重命名 */}
                                                            {index !== 0 && (
                                                                <div
                                                                    className="tip-item nc-theme-menu-item"
                                                                    onClick={() => {
                                                                        this.renameDataView(
                                                                            item,
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    {langCheck(
                                                                        "reportMultiLang",
                                                                        "dataView-100301-000239",
                                                                    )}
                                                                </div>
                                                            )}
                                                            {item.isdefault ? (
                                                                <div
                                                                    className="tip-item nc-theme-menu-item"
                                                                    style={{ color: "#ccc" }}
                                                                >
                                                                    {langCheck(
                                                                        "reportMultiLang",
                                                                        "dataView-100301-000240",
                                                                    )}
                                                                </div> // 当前默认
                                                            ) : (
                                                                <div
                                                                    className="tip-item nc-theme-menu-item"
                                                                    onClick={() => {
                                                                        this.setDefaultDataView(
                                                                            item,
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    {langCheck(
                                                                        "reportMultiLang",
                                                                        "dataView-100301-000241",
                                                                    )}
                                                                </div> // 设为默认视图
                                                            )}
                                                            {index !== 0 && (
                                                                <div
                                                                    className="tip-item nc-theme-menu-item"
                                                                    onClick={() => {
                                                                        this.deleteDataView(
                                                                            item,
                                                                            index,
                                                                        );
                                                                    }}
                                                                >
                                                                    {langCheck(
                                                                        "reportMultiLang",
                                                                        "100301-000157",
                                                                    )}
                                                                </div>
                                                            )}
                                                            {/* 删除 */}
                                                        </div>,
                                                        document.body,
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </Item>
                            );
                        })}
                </NCMenu>

                <div
                    className="data-view-white create-data-view nc-theme-menu u-dropdown-menu"
                    onClick={() => {
                        this.openDataView("add", currentSelectDataViewIndex);
                    }}
                >
                    {/* 新增视图 */}
                    {langCheck("reportMultiLang", "dataView-100301-000242")}
                </div>
            </React.Fragment>
        );
        return (
            <div className="btn-box data-view-container" style={{ height: 26 }}>
                <NCDropdown
                    fieldid="dataView"
                    trigger={["click"]}
                    placement='bottomRight'
                    overlay={dataViewMenu}
                    animation="slide-up"
                    style={{ boxShadow: "0 1px 5px #a5adba" }}
                    visible={this.state.dataViewDropDownVisible}
                    onVisibleChange={value => {
                        if (value) {
                            this.setState({
                                dataViewIconFlag: value,
                                dataViewDropDownVisible: value,
                            });
                        }
                    }}
                    className="dropdown-component"
                >
                    <NCButton fieldid="detail" is_arrow={true} className="btn">
                        {/* 数据视图 */}
                        {langCheck("reportMultiLang", "dataView-100301-000243")}
                        <i
                            style={{ marginLeft: 5 }}
                            className={`arrow icon iconfont ${
                                this.state["dataViewIconFlag"]
                                    ? "icon-hangcaozuoxiangshang1"
                                    : "icon-hangcaozuoxiala1"
                            }`}
                        />
                    </NCButton>
                </NCDropdown>

                <DataViewModal
                    visible={dataViewVisible}
                    onRef={this.onDataViewModalRef}
                    onCancel={() => {
                        this.setState({ dataViewVisible: false });
                    }}
                    reportId={this.props.reportId}
                    onOk={data => {
                        this.viewAndSearch(data);
                    }}
                    curViewData={dataViewMenuArr[curSelectModelIndex]}
                    allData={dataViewMenuArr}
                    entranceType={entranceType}
                    getAllViewData={this.props.getAllViewData}
                    saveAsType={this.state.saveAsType}
                    renameData={this.state.renameData}
                    resetSaveAs={this.resetSaveAs}
                    resetCacheFlag={this.resetCacheFlag}
                    needClearCacheFlag={needClearCacheFlag}
                    viewDataIngSaveFlag={viewDataIngSaveFlag}
                    viewDataIngSaveAsFlag={viewDataIngSaveAsFlag}
                    continueSetDataViewFlag={continueSetDataViewFlag}
                    viewDataIngVisibile={viewDataIngVisibile}
                    relationAreaPkList={this.props.relationAreaPkList}
                    currentSelectDataViewIndex={
                        this.state.currentSelectDataViewIndex
                    }
                    setIsAddNewDataView={this.props.setIsAddNewDataView}
                    setDataViewCacheData={this.props.setDataViewCacheData}
                    fetchTableData={this.props.fetchTableData}
                    {...this}
                />

                <ViewIngModal
                    dataViewMenuArr={dataViewMenuArr}
                    curSelectModelIndex={curSelectModelIndex}
                    entranceType={entranceType}
                    viewDataIngVisibile={viewDataIngVisibile}
                    saveCurrentOperate={this.saveCurrentOperate}
                    saveAsCurrentOperate={this.saveAsCurrentOperate}
                    onCancleViewIngModal={this.onCancleViewIngModal}
                    continueSetDataView={this.continueSetDataView}
                    setViewDataIngVisibile={this.setViewDataIngVisibile}
                    setViewDataIngTipsVisibile={this.setViewDataIngTipsVisibile}
                />

                <ViewIngTipsModal
                    viewDataIngTipsVisibile={viewDataIngTipsVisibile}
                    setViewDataIngTipsVisibile={this.setViewDataIngTipsVisibile}
                />
            </div>
        );
    }
}

export default DataViewSetting;
