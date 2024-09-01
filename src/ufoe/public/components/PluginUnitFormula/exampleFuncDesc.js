/*
 * @Description: 
 * @Autor: hgq
 * @Date: 2021-08-31 14:39:57
 */
import React, { Component } from "react";
import examMeta from "./exampleManager";
import ReactDOM from 'react-dom';
import { createPage, base, ajax, actions } from "nc-lightapp-front";
import { CONSTANT } from "./constant";
import "./index.less";

class exampleFuncDesc extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rowsData:[],// 列表数据
            value:'测试',
        } 
    }
    /** 初始化功能 */
    componentDidMount = async () => {
        //加载模板,添加到meta中
        const {paramList} = this.props.treeNodeData;
        let res = await this.encapsulFormat(paramList);
        this.state.rowsData = res;
        const data = {
            rows: this.state.rowsData
        }
        this.props.use.editTable("exampleFuncTable");
        this.props.meta.addMeta(examMeta('funcTemp'));
        this.props.editTable.setTableData("exampleFuncTable", data);
    }

    /** 封装列表数据格式 */
    encapsulFormat = (paramList) => {
        let rows = [];
        paramList.forEach((it,index,ars) => {
            let values = {};
            let data = {};
            if (index%2 ==0) {
                let func_name = {};
                func_name.value = ars[index];
                let func_desc = {};
                if (ars[index + 1]) {
                    func_desc.value = ars[index + 1];
                } else {
                    func_desc.value = '';
                }
                values.func_name = func_name;
                values.func_desc = func_desc;
                data.values = values;
                rows.push(data);
            }
        })
        return rows;
    }


    render(){ 
        const { createEditTable } = this.props.editTable;
        const { DragWidthCom } = this.props;
        const {NCFormControl}=base;
        const {simpDesc} = this.props.treeNodeData;
        const key = 'exampleFuncDesc';
        
        const funcFunction = $appRoot.state.json['public_lang-000288']/* 国际化处理： 函数功能*/
        const paramInfo = $appRoot.state.json['public_lang-000289']/* 国际化处理： 参数描述*/
        return (
            <div className='flex-container'  style={{height:'100%'}}>
                <div className="example-manager-wrapper flex-container">
                    <div>
                        <span>{funcFunction}：</span>
                        <span>{simpDesc}</span>
                    </div>
                    {/* <div>
                        <NCFormControl
                        fieldid={simpDesc}
                            className="demo-input"
                            value={simpDesc}
                            size="sm"
                            fieldid={key}
                        />
                    </div> */}
                    <div className='flex-container'>
                        <div>
                            <span>{paramInfo}：</span>
                        </div>
                        <div className="nc-singleTable-table-area flex-container">
                            {createEditTable('exampleFuncTable', {
                                crossPageSelect: false,
                                alloweFilter: false,
                                multipleRowCell:true,
                                // height:300,
                                inModal: true,
                                adaptionHeight: true,
                                cancelCustomRightMenu: true, // 屏蔽最右侧列表设置按钮
                                addBlankCol: false
                            })}
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
export default exampleFuncDesc;