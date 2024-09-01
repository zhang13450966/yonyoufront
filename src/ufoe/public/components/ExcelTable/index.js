import React, { useRef, Component } from "react";

window.$appRoot = window.$appRoot ? window.$appRoot : {state:{json:{}}}

import "./meConfig"
import MeTable from "../../../pages/dataCenter/core/gridEngine/grid";
import mockData from "./mockData.json";
import { exportMethod, internalMethod, configMethod } from "./method";
import "./index.less";
export default function ExcelTable(WrappedComponent) {
    return class Son extends React.Component {
        constructor(props) {
            super(props);
            this.props = props;
            this.state = {
                data: {

                },
                mockButt: true,
                //强制刷新方法
                isRefresh: false,
            }
            this.hot = {};
            // 标记  该标记用作render使用
            this.sign = {};
            this.renderSign = true;
            this.hotDom = null;
            window.mockThat = this;//调试所用 
            // 此处 可根据外部传入参数 将部分不使用的api 移除 可做优化使用 初步原则 只能优化 导出方法
            // 统一绑定 方法的this
            let exportMethodSym = exportMethod[Symbol.iterator]();
            let nextMethodSym = exportMethodSym.next();
            this.exportMethod = {};
            while (!nextMethodSym.done) {

                this.exportMethod[nextMethodSym.value[0]] = nextMethodSym.value[1].bind(this);
                nextMethodSym = exportMethodSym.next();

            }
            // 内部方法
            let internalMethodSym = internalMethod[Symbol.iterator]();
            let nextInternalMethod = internalMethodSym.next();
            this.internalMethod = {};
            while (!nextInternalMethod.done) {

                this.internalMethod[nextInternalMethod.value[0]] = nextInternalMethod.value[1].bind(this);
                nextInternalMethod = internalMethodSym.next();

            }

            // 配置方法
            let configMethodSym = configMethod[Symbol.iterator]();
            let nextconfigMethod = configMethodSym.next();
            this.configMethod = {};
            while (!nextconfigMethod.done) {

                this.configMethod[nextconfigMethod.value[0]] = nextconfigMethod.value[1].bind(this);
                nextconfigMethod = configMethodSym.next();

            }
            this.widths = {};
            // 全局级防抖
            this.timeOut = null;
            this.initSelect = {};
            window.excetTableWindow = this;
            $appRoot.excetTableWindow = this
        }

        componentWillMount() {
            if(_.isEmpty($appRoot.state.json)){
                // 初始化调用getPlatformLang方法获取多语
                let callback = (json, bool, LangData) => {
                    $appRoot.state.json = json;
                }
                $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang' , callback }) // moduleId为所需加载json文件夹名称前缀
            }
        }

        // 设置表格数据
        setExcelTableData = (id = "mockId", data, config = {}) => {
            let sdata = this.state.data;
            sdata[id] = data;
            this.initSelect = config.initSelect;
            this.initCallbackFn = config.callback;
            this.setState({ data: sdata }, () => {
                if (_.isEmpty(this.hot)) {
                    this.initCallback = true;
                } else {
                    setTimeout(() => {
                        if (config.callback) config.callback();
                    }, 0)
                }

            });
        }

        // 创建电子表格  会校验 data是否存在  如果不存在  那就不再渲染
        createExcelTable = (id = "mockId", config = {}) => {
            let data = this.state.data[id];
            if (!data || !data.m_cellsModel) {
                return null;
            }
            this.hotDom = <MeTable
                ref={hotDom => this.hotDom = hotDom}
                gridData={data.m_cellsModel.m_cells}
                cellsDataMap={data.m_cellsModel}
                // manualColumnResize = {true}
                hot={(hot) => {
                    this.hot = hot;
                    let that = this;
                    if (this.initCallback) {
                        this.initCallback = false;
                        if (this.initCallbackFn) {
                            this.initCallbackFn();
                        }
                    }
                }}
                customProps={{
                    manualRowResize:true,

                    manualColumnResize:true,
                    afterRowResize:(...ars)=>{
                        return true;
                    },
                    afterColumnResize:(...ars)=>{
                        return true;
                    },
                    afterSelectionEnd: _.debounce(
                        () => {
                            if (config.afterSelectionEnd) {
                                config.afterSelectionEnd()
                            }
                        },
                        10),
                    contextMenu: null,
                    afterDestroy: (...ars) => {
                    },
                    afterRenderer: (TD, row, col, prop, value, cellProperties) => {
                        if (this.sign[id] && this.sign[id].has(row + "--" + col)) {
                            TD.style.backgroundColor = this.sign[id].get(row + "--" + col).color;
                        }
                    }
                }}
            ></MeTable>
            return this.hotDom
        }
        // 创建模拟功能按钮  项目上线以后需要 注释其使用
        createVirButton = () => {
            return null;
        }
        render() {
            console.log($appRoot.state.json['public_lang-000039'], myNewData())/* 国际化处理： 时间节点3*/
            let excelTable = {
                setExcelTableData: this.setExcelTableData,
                createExcelTable: this.createExcelTable,
                ...this.exportMethod
            }
            console.log($appRoot.state.json['public_lang-000040'], this);/* 国际化处理： 电子表格高阶组件*/
            return <div style={{ height: "100%" }} className="excelTable_box">
                <WrappedComponent excelTable={excelTable}   {...this.props} />
                {this.createVirButton()}
            </div>


        }
    }
}
