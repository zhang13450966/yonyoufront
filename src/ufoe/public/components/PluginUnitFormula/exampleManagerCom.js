import React, { Component } from "react";
import examMeta from "./exampleManager";
import ReactDOM from 'react-dom';
import { createPage, base, ajax, actions } from "nc-lightapp-front";
import { CONSTANT } from "./constant";
import "./index.less";
import ExampleFuncDesc from "./exampleFuncDesc";

// 列表选中数据
let listCheckData = [];
// 树节点补充信息对照关系
let treeNodesData = new Map();
// 列表选中数据
let listCheckValues = []; 
// 选中节点的函数集合
let checkNodeFuncs = [];
// 所有函数集合
let funcCodeArr = [];
// 树节点屏蔽条件
let screenTermArr = ['审核条件'];
class ExampleManager extends Component{
    constructor(props) {
        super(props);
        this.state = {
            buttonState:[], // 按钮状态
            treeNodeMap:new Map(), // 一级树节点统计key:名称,value:code
            formState:false ,// 表单显示/隐藏状态
            checkTreeNodeAndIsLeaf:[],// 选中节点PK及是否是叶子几点(true:0,false,1)
            rowsData:[],// 列表数据
            treeNodeData:{},// 传递树节点补充信息
            clickBtnType:{},// 按钮类型
            isCheck:true, // 是否开始校验
        }
        window.t = this.props; //todo
    }

    /** 初始化树节点功能 */
    componentDidMount(){
        this.state.buttonState = [false,true,true,false,true,true];
        let treeDatas = [];// 定义树节点数据集
        checkNodeFuncs = [];
        let [count, oneCount, twoCount] = [0,0,0];// 定义初始参数
        treeDatas = this.recursionEMStateArr($appRoot.UnitFormula.state.dataSource,treeDatas,count,oneCount,twoCount);
        // console.log(treeDatas);
        // this.newTree = this.props.syncTree.createTreeData(treeData);
        this.props.syncTree.setSyncTreeData('ExampleManagerTree',  treeDatas); // 填充树的数据
        this.checkNodeAndSearchTable();
    }

    /** 指定树节点，刷新列表数据 */
    checkNodeAndSearchTable = () => {
        let nodePk = $appRoot.UnitFormula.state.defaultSelectedKeys;
        let nodeParentPk = '';
        if ($appRoot.UnitFormula.state.subMenuSelectedKeys.length > 1) {
            // var name = $appRoot.UnitFormula.state.subMenuKey;
            // var arr = name.split('-');
            // nodeParentPk = arr[0];
            nodeParentPk = $appRoot.UnitFormula.state.subMenuKey;
        } else {
            nodeParentPk = $appRoot.UnitFormula.state.subMenuSelectedKeys[0];
        }
        let treeNodeCode = this.state.treeNodeMap.get(nodeParentPk);
        this.state.checkTreeNodeAndIsLeaf = [];
        this.state.checkTreeNodeAndIsLeaf.push(nodePk);// 设置节点函数
        this.state.checkTreeNodeAndIsLeaf.push('true');// 设置是叶子节点,true:是,false,否
        this.state.checkTreeNodeAndIsLeaf.push(treeNodeCode +'-'+nodePk);// 设置节点refKey
        this.props.syncTree.openNodeByPk('ExampleManagerTree', treeNodeCode ); // 打开指定节点
        this.props.syncTree.setNodeSelected('ExampleManagerTree', treeNodeCode +'-'+nodePk);// 选中指定节点  
        this.state.treeNodeData = treeNodesData.get(treeNodeCode +'-'+nodePk);// 设置指定节点补充信息（函数说明）  
        this.tableDataFill();
    }

    /**
     * 处理树结构数据
     */
    recursionEMStateArr = (options,node,pid,oneCount,twoCount) => {
        let treeData = [];
        let count = 0;
        const {treeNodeMap} = this.state;
        const iconBox = {
            delIcon:false, //false:隐藏； true:显示; 默认都为true显示
            editIcon:false,
            addIcon:false
        };
        // let node = {};// 节点信息
        if (options.length > 0) {
            if (node.length == 0) {
                let arr = [$appRoot.state.json['public_lang-000280']/* 国际化处理： 函数分类*/,'root','false'];
                node = this.setEMTreeNodesData(arr);
                node.iconBox = iconBox;
                node['children'] = []; 
            }
            
            options.forEach(it => {
            let nodeArr = [];// 存储基础字段值
            let nodeChild = {};// 存储子节点基础字段值
            if (it.tabName) {
                if (screenTermArr.includes(it.tabName)) {
                    return;
                }
                nodeArr.push(it.tabName);
                nodeArr.push(it.tabCode + 't');
                nodeArr.push('false');
                nodeArr.push('root');
                nodeChild = this.setEMTreeNodesData(nodeArr);// 一个children节点{}
                // nodeChild['children'] = this.recursionEMStateArr(it.funcTypes,treeData,count,it.tabCode);
                nodeChild.iconBox = iconBox;
                nodeChild['children'] = [];
                node['children'].push(nodeChild);
                if (it.funcTypes.length > 0) {
                    oneCount++;
                    this.recursionEMStateArr(it.funcTypes,node,it.tabCode,oneCount,twoCount);
                } 
                
            } else {
                if (it.funcCode) { //判断是否是叶子节点
                    // nodeArr.push(it.funcName);
                    let funcCode = it.funcCode;
                    if (it.funcCodeCn) {
                        funcCode = it.funcCodeCn;
                    }
                    nodeArr.push(funcCode);
                    nodeArr.push(pid + '-' + funcCode);
                    nodeArr.push('true');
                    nodeArr.push(pid);
                    nodeChild = this.setEMTreeNodesData(nodeArr);// 一个children节点{}
                    /** 填充其他信息 */
                    let nodeData = {};
                    nodeData.funcFormat = it.funcFormat;
                    nodeData.paramList = it.paramList;
                    nodeData.simpDesc = it.simpDesc;
                    nodeData.funcCode = funcCode;
                    treeNodesData.set(pid + '-' + funcCode,nodeData);
                    if (!funcCodeArr.includes(funcCode)) {
                        funcCodeArr.push(funcCode);
                    }
                    nodeChild.nodeData = nodeData;
                    nodeChild.iconBox = iconBox;
                    node.children[oneCount-1].children[twoCount-1].children.push(nodeChild);
                } else {
                    nodeArr.push(it.funcTypeName);
                    let treeId = '';
                    if (count > 9) {
                        treeId = pid + '-' + count;
                    } else {
                        treeId = pid + '-0' + count;
                    }
                    nodeArr.push(treeId);
                    treeNodeMap.set(it.funcTypeName,treeId);
                    nodeArr.push('false');
                    nodeArr.push(pid);
                    nodeChild = this.setEMTreeNodesData(nodeArr);
                    nodeChild.iconBox = iconBox;
                    nodeChild['children'] = [];
                    node.children[oneCount-1].children.push(nodeChild);
                    if (it.funcs.length > 0) {
                        twoCount++;
                        this.recursionEMStateArr(it.funcs,node,treeId,oneCount,twoCount);
                        count++;
                    }
                    
                }
            }
                
            })
            treeData.push(node);
        } else {
            let arr = [$appRoot.state.json['public_lang-000280']/* 国际化处理： 函数分类*/,'root','false'];
            node = this.setEMTreeNodesData(arr);
            count++;
            node['children'] = [];
            node.iconBox = iconBox;
            treeData.push(node);
            return treeData;
        }
        return treeData;
    }

    /**
     * 填充树节点属性数据
     */
    setEMTreeNodesData = (data) => {
        let node = {};
        let arr = ["refname","refpk","isleaf","pid"];
        data.forEach((it,index,ars) => {
            if (!(ars[index] == null)) {
                node[arr[index]] = it;
            }
        })
        return node;
    }

    /**
     *创建示例管理器功能按钮
    *新增 修改 删除 导入 导出 设置默认示例 刷新
    */
    exampleManagerBtn = () => {
        const btnConfig = [
            //操作按钮配置
            { key: "saveBtn", className: "opt-btn exampleFocusBtn", name: $appRoot.state.json['public_lang-000256'], onClick: () => { this.exampleManagerHandle("1", 'saveBtn') } },/* 国际化处理： 新增*/
            { key: "editBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000257'], onClick: () => { this.exampleManagerHandle("2", 'editBtn') } },/* 国际化处理： 修改*/
            { key: "delBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000258'], onClick: () => { this.exampleManagerHandle("3", 'delBtn') } },/* 国际化处理： 删除*/
            { key: "importBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000259'], onClick: () => { this.exampleManagerHandle("4", 'importBtn') } },/* 国际化处理： 导入*/
            { key: "exportBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000260'], onClick: () => { this.exampleManagerHandle("5", 'exportBtn') } },/* 国际化处理： 导出*/
            { key: "defaultBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000261'], onClick: () => { this.exampleManagerHandle("6", 'defaultBtn') } },/* 国际化处理： 设置默认示例*/
            { key: "searchBtn", className: "exampleBtnCustomize", name:<i className='iconfont icon-shuaxin1'/>, onClick: () => { this.exampleManagerHandle("7", 'searchBtn') } },/* 国际化处理： 设置默认示例*/
            { key: "determineBtn", className: "opt-btn exampleFocusBtn", name: $appRoot.state.json['public_lang-000267'], onClick: () => { this.exampleManagerHandle("8", 'determineBtn') } },/* 国际化处理： 确定*/
            { key: "cancelBtn", className: "opt-btn", name: $appRoot.state.json['public_lang-000268'], onClick: () => { this.exampleManagerHandle("9", 'cancelBtn') } },/* 国际化处理： 取消*/
        ];

        return btnConfig;
    }

    // 验证功能按钮 是否可操作
    validateExampleBtns = btnConfig => {
        const { buttonState } = this.state;
        const { formState } = this.state;
        const { NCButton, NCButtonGroup } = base;
        let groupType = (start, end, buttonState) => {
            if(buttonState){
                return btnConfig.map((eve, index) => {
                    const { name, onClick, key, className} = eve;
                    if(index>=start && index<end) {
                        return (
                        <NCButton key={index} onClick={onClick} className={className.replace('exampleFocusBtn','')} fieldid={key} disabled={buttonState[index]}>
                                {name}
                            </NCButton>
                        )
                    }
                })
            }else{
                return btnConfig.map((eve, index) => {
                    const { name, onClick, key, className} = eve;
                    if(index>=start && index<end) {
                        return (
                            <NCButton key={index} onClick={onClick} className={className.replace('exampleFocusBtn','')} fieldid={key}>
                                {name}
                            </NCButton>
                        )
                    }
                })
            }
        };
        if (buttonState && buttonState.length > 0) {
            return (
                <div>
                    <NCButtonGroup>
                        {groupType(0,3,buttonState)}
                    </NCButtonGroup>
                    <NCButtonGroup style={{marginLeft:'6px'}}>
                        {groupType(3,5,buttonState)}
                    </NCButtonGroup>
                    {groupType(5,7,buttonState)}
                </div>
            )
        }else{
            return (
                <div>
                    <NCButtonGroup>
                        {groupType(0,3)}
                    </NCButtonGroup>
                    <NCButtonGroup style={{marginLeft:'6px'}}>
                        {groupType(3,5)}
                    </NCButtonGroup>
                    {groupType(5,7)}
                </div>
            )
        }
        // return btnConfig.map((eve, index) => {
        //     const { name, onClick, key, className} = eve;
        //     if (buttonState && buttonState.length > 0) {
        //         if (buttonState[index]) {
        //             return (
        //                 <NCButton key={index} onClick={onClick} className={className.replace('exampleFocusBtn','')} fieldid={key} disabled>
        //                     {name}
        //                 </NCButton>
        //             );
        //         } else {
        //             if (index < 7) {
        //                 return (
        //                     <NCButton key={index} onClick={onClick} className={className} fieldid={key} >
        //                         {name}
        //                     </NCButton>
        //                 );
        //             } else {
        //                 return (
        //                     <NCButton key={index} onClick={onClick} className={className} fieldid={key} style={{display:"none"}}>
        //                         {name}
        //                     </NCButton>
        //                 );
        //             }
                    
        //         }
        //     } else {
        //         if (index < 7) {
        //             return (
        //                 <NCButton key={index} onClick={onClick} className={className} fieldid={key} >
        //                     {name}
        //                 </NCButton>
        //             );
        //         }
        //     }
            
        // });
    };

    // 验证表单按钮
    validateFormBtns = btnConfig => {
        const { NCButton } = base;
        return btnConfig.map((eve, index) => {
            const { name, onClick, key, className} = eve;
            if (key == 'determineBtn' || key == 'cancelBtn') {
                return (
                    <NCButton key={index} onClick={onClick} className={className} fieldid={key} >
                        {name}
                    </NCButton>
                ); 
            }         
        });
    };

     /**
     * 按钮点击事件
     */
    exampleManagerHandle= (index,keyshowData) => {
        /** 控制表单状态 */
        let formState = false;
        const {form} = this.props;
        const {isCheckNow,getAllFormValue} = form;
        const {clickBtnType} = this.state;
        switch (index) {
            case '1' :
                // console.log('新增')
                formState = true;
                this.setState({
                    formState:formState,
                    clickBtnType:keyshowData,
                    isCheck:false
                })
                break;
            case '2' :
                // console.log('修改')
                formState = true;
                this.setState({
                    formState:formState,
                    clickBtnType:keyshowData,
                    isCheck:false
                })
                break;
            case '3' :
                // console.log('删除')
                this.notificationFun($appRoot.state.json['public_lang-000258']/* 国际化处理： 删除*/,'warning',$appRoot.state.json['public_lang-000279']/* 国际化处理： 确定要删除所选数据吗？*/,keyshowData);
                break;
            case '4' :
                // console.log('导入')
                this.importTableData();
                break;
            case '5' :
                // console.log('导出')
                this.exportTableData();
                break;
            case '6' :
                // console.log('设置默认示例')
                this.editTableData('','defaultBtn')
                break;
            case '7' :
                // console.log('刷新')
                this.searchTableData();
                break;
            case '8' :
                // console.log('保存')
                let meta = this.props.meta.getMeta();
                let func =this.state.checkTreeNodeAndIsLeaf[0];
                if (meta.exampleForm) {
                    const regExp = new RegExp("^"+func+"[\(\(].*","i")
                    meta.exampleForm.items[2]['reg'] = regExp;
                    this.props.meta.setMeta(meta)
                }
                this.state.isCheck = true;
                let state = isCheckNow('exampleForm','danger');
                if (state) {
                    // console.log('校验通过');
                    let formData = getAllFormValue('exampleForm');
                    if (clickBtnType == 'saveBtn') {
                        this.saveTableData(formData);
                    }
                    if (clickBtnType == 'editBtn') {
                        this.editTableData(formData,'determineBtn');
                    }
                }
                // this.onAfterEvent();
                break;
            case '9' :
                // console.log('取消')
                this.notificationFun($appRoot.state.json['public_lang-000268']/* 国际化处理： 取消*/,'warning',$appRoot.state.json['public_lang-000278']/* 国际化处理： 确定要取消吗？*/,keyshowData);
                break;
            default:
                // console.log('刷新')
                break;
        }
    }

    /** 鼠标滑过树节点调用方法 */
    onMouseEnterEve = (key) => {
        let obj = {
            delIcon:false, //false:隐藏； true:显示; 默认都为true显示
            editIcon:false,
            addIcon:false
        };
        this.props.syncTree.hideIcon( 'ExampleManagerTree', key, obj ) // 屏蔽树节点的增删改浮动功能
    }

    /** 点击树节点回调 */
    onSelectEve = (code, data, a, b) => {
        /** 控制列表按钮状态 */        
        this.state.checkTreeNodeAndIsLeaf = []; 
        let treeNode = data.refname;
        let refkey = data.refpk;
        this.state.checkTreeNodeAndIsLeaf.push(treeNode);// 设置节点函数
        this.state.checkTreeNodeAndIsLeaf.push(data.isleaf);// 设置是叶子节点,true:是,false,否
        this.state.checkTreeNodeAndIsLeaf.push(refkey);// 设置节点编码
        checkNodeFuncs = [];
        if (data.children && data.children.length > 0) {
            checkNodeFuncs = this.getCheckNodeFuncs(data.children,checkNodeFuncs);
        } else {
            checkNodeFuncs.push(treeNode);
        }
        this.tableDataFill();
        let buttonStates = this.changeBtnCheck('onSelectEve',data);
        this.setState({
            buttonState:buttonStates
        })
        if (data && data.nodeData) {
            this.state.treeNodeData = data.nodeData;
        }
        listCheckData = [];
    };

    /** 选中节点函数 */
    getCheckNodeFuncs = (options,funcs) => {
        options.forEach((it) => {
            if (it.isleaf.indexOf('true') == -1) {
                this.getCheckNodeFuncs(it.children,funcs);
            } else {
                if (!funcs.includes(it.refname)) {// 去重
                    funcs.push(it.refname);
                }
            }
        })
        return funcs
    }

    /** 列表复选框全选点击 */
    onSelectedAllFn = (props, tableId, isChecked, num,a,b,c) => {
        // // console.log(isChecked)
        if (isChecked) {
            listCheckData = [];
            listCheckValues = [];
            // NCC-152000 点击全选后再操作只剩下一条数据的时候修改默认示例
            let allRows = props.editTable.getAllRows(tableId);
            allRows.forEach((rowData, index) => {
                let tableRow = {};
                let default_demo = {};
                default_demo.value = rowData.values.default_demo.value == $appRoot.state.json['public_lang-000271'] ? true : false;/* 国际化处理： 是*/
                tableRow.index = index;
                tableRow.demo_name =rowData.values.demo_name;
                tableRow.default_demo = default_demo;
                tableRow.demo_content = rowData.values.demo_content;
                tableRow.pk_demo = rowData.values.pk_demo.value;
                listCheckValues.push(tableRow);
            })
            for (let i=0;i<num ;i++) {
                listCheckData.push(i);
            }
        } else {
            listCheckData = [];
            listCheckValues = [];
        }
        let buttonStates = this.changeBtnCheck('onSelectedAllFn',isChecked);
        this.setState({
            buttonState:buttonStates
        })
    }

    /** 列表复选框点击 */
    onSelectedFn = (val, tableId, data, index, selected) => {
        // console.log(data);
        let tableRow = {};
        let default_demo = {};
        default_demo.value = data.values.default_demo.value == $appRoot.state.json['public_lang-000271'] ? true : false;/* 国际化处理： 是*/
        tableRow.index = index;
        tableRow.demo_name =data.values.demo_name;
        tableRow.default_demo = default_demo;
        tableRow.demo_content = data.values.demo_content;
        tableRow.pk_demo = data.values.pk_demo.value;
        // if (data.selected) {
        if (selected) {
            listCheckData.push(index);
            listCheckValues.push(tableRow);
        } else {
            listCheckData = listCheckData.filter((item) => item !== index);
            listCheckValues = listCheckValues.filter((item) => item.index !== index);
        }
        let buttonStates = this.changeBtnCheck('onSelectedFn',selected);
        this.setState({
            buttonState:buttonStates
        })
    }

     /** 行单点击 */
    onRowClick = (props, moduleId, record, index, e) => {
        let checkedRows = props.editTable.getCheckedRows('exampleManagerTable');
        if(checkedRows.length == 0){
            listCheckData = [];
            listCheckValues = [];
        }
    }

    /** 按钮状态调整 */
    changeBtnCheck = (type,info) => {
        let buttonStates = [];
        let [treeNode,isLeaf] = this.state.checkTreeNodeAndIsLeaf;
        let iArr = listCheckData;
        let rArr = this.state.rowsData;
        switch (type) {
            case 'onSelectEve':
                if (info.isleaf.indexOf('true') == -1) { // 非叶子节点
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                } else {
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                }
                break;
            case 'onSelectedFn':
                if (iArr.length > 1 && isLeaf == 'true') {// 叶子节点，复选框选中且存在多个选中
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(true);
                } else if (iArr.length > 1 && isLeaf == 'false') {// 非叶子节点，复选框选中且存在多个选中
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(true);
                }else if (iArr.length == 1 && isLeaf == 'true') {// 叶子节点，复选框选中且只有一个
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                }else if (iArr.length == 1 && isLeaf == 'false') {// 非叶子节点，复选框选中且只有一个
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                }else if (iArr.length < 1 && isLeaf == 'true') {// 叶子节点，复选框没有
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                }else if (iArr.length < 1 && isLeaf == 'false') {// 非叶子节点，复选框没有
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                }
                break;
            case 'onSelectedAllFn' :
                if (!info && isLeaf == 'true') {
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                } else if (!info && isLeaf == 'false') {
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                } else if (iArr.length > 1 && isLeaf == 'true') {// 叶子节点，复选框选中且存在多个选中
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(true);
                } else if (iArr.length > 1 && isLeaf == 'false') {// 非叶子节点，复选框选中且存在多个选中
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(true);
                }
                break;
            case 'editTableData' :
                if (isLeaf == 'true') {// 叶子节点，复选框选中且存在多个选中
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                } else if (isLeaf == 'false') {// 非叶子节点，复选框选中且存在多个选中
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(true);
                    buttonStates.push(true);
                }
                break;
            case 'onRowClick' :
                if (isLeaf == 'true') {// 叶子节点
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                } else if (isLeaf == 'false') {// 非叶子节点
                    buttonStates.push(true);
                    buttonStates.push(true);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                    buttonStates.push(false);
                }
                break;
        }
        return buttonStates;
        
    }

    /** 初始化表功能 */ 
    tableDataFill = async () => {
        let metaEmpty = this.props.meta.getMeta();// 获取列表已存在的模板
        if(!_.isEmpty(metaEmpty)){
            //加载模板,添加到meta中
            // this.props.meta.setMeta(examMeta());
            let [treeNode,isLeaf] = this.state.checkTreeNodeAndIsLeaf;
            let res = await this.getTableDataByTreeNode(treeNode,isLeaf);
            if (res.data && res.data.length != 0) {
                let tableData = this.dataDealDefault(res.data[Object.keys(res.data)[1]].rows);
                this.state.rowsData = tableData;// 设置列表数据;
            }else {
                this.state.rowsData = res.data;
            }
            const data = {
                rows: this.state.rowsData
            }
            // a['exampleManagerTable'] = examMeta();
            // 表功能设置
            // this.props.meta.setMeta(examMeta());
            this.props.use.editTable("exampleManagerTable");
            this.props.meta.addMeta(examMeta('tableTemp'));
            // this.props.meta.setMeta(a);
            this.props.editTable.setTableData("exampleManagerTable", data);
        }
    }

    /** 数据处理 */
    dataDealDefault = (data) => {
        if (data.length) {
            data.forEach((it,index,ars) => {
                if (it.values.default_demo.value) {
                    it.values.default_demo.value = $appRoot.state.json['public_lang-000271'];/* 国际化处理： 是*/
                } else {
                    it.values.default_demo.value = $appRoot.state.json['public_lang-000272'];/* 国际化处理： 否*/
                }
            })
        } else {
            if (data.data.values.default_demo.value == $appRoot.state.json['public_lang-000271']) {/* 国际化处理： 是*/
                data.data.values.default_demo.value = true;
            } else {
                data.data.values.default_demo.value = false;
            }
        }
        return data;
    }

    /** 获取表数据 */
    getTableDataByTreeNode = (treeNode,isLeaf) => {
        if (checkNodeFuncs.length > 0) {
            treeNode = checkNodeFuncs;
        } else {
            checkNodeFuncs.push(treeNode);
            treeNode = checkNodeFuncs;
        }
        return new Promise(resolve => {
            let url =CONSTANT.getEMTreeData;
            ajax({
                url: url,
                data: { "func_name": treeNode,"isleaf": isLeaf},
                success: res => {
                    resolve(res);
                },
            });
        })
    }

    /** 保存表数据 */
    saveTableData = (formData) => {
        const {treeNodeData} = this.state;
        const [treeNode,isLeaf,refKey] = this.state.checkTreeNodeAndIsLeaf;
        const {rowsData} = this.state;
        return new Promise(resolve => {
            let url =CONSTANT.addEMTableData;
            let formInfo = {};
            formInfo.demo_content = formData.rows[0].values.demo_content.value;
            formInfo.demo_name = formData.rows[0].values.demo_name.value;
            if (formData.rows[0].values.default_demo.value == undefined) {
                formData.rows[0].values.default_demo.value = false;
            }
            formInfo.default_demo = formData.rows[0].values.default_demo.value;
            formInfo.func_name = treeNodeData.funcCode;
            formInfo.demo_seq = rowsData.length + 1;
            if (!rowsData.length) {
                formInfo.demo_seq = 1;
            }
            ajax({
                url: url,
                data: {"formInfo":formInfo},
                success: res => {
                    if (res.success) {
                        this.messageHintFun('success',$appRoot.state.json['public_lang-000275']/* 国际化处理： 保存成功*/);
                        this.tableDataFill();
                        listCheckData = [];
                        listCheckValues = [];
                        let buttonStates = this.changeBtnCheck('onSelectedFn',false);
                        this.setState({
                            formState:false,
                            buttonState:buttonStates
                        })
                    }
                },
            });
        })
    }

    /** 编辑表数据 */
    editTableData = (formData,type) => {
        let formInfo = {};
        if (type == 'determineBtn') {
            formInfo.demo_content = formData.rows[0].values.demo_content.value;
            formInfo.demo_name = formData.rows[0].values.demo_name.value;
            formInfo.default_demo = formData.rows[0].values.default_demo.value;
            formInfo.treePk = formData.rows[0].values.pk_demo.value;
        } else {
            formInfo.demo_content = listCheckValues[0].demo_content.value;
            formInfo.demo_name = listCheckValues[0].demo_name.value;
            formInfo.default_demo = true;
            formInfo.treePk = listCheckValues[0].pk_demo;
        }
        return new Promise(resolve => {
            let url =CONSTANT.editEMTableData;
            ajax({
                url: url,
                data: {"formInfo":formInfo},
                success: res => {
                    if (res.success) {
                        this.messageHintFun('success',$appRoot.state.json['public_lang-000276']/* 国际化处理： 编辑成功*/);
                        this.tableDataFill();
                        listCheckData = [];
                        listCheckValues = [];
                        let buttonStates = this.changeBtnCheck('editTableData',false);
                        this.setState({
                            formState:false,
                            buttonState:buttonStates
                        })
                    }
                },
            });
        })
    }

    /** 删除表数据 */
    delTableData = (formData) => {
        let checkData = this.props.editTable.getCheckedRows('exampleManagerTable');
        let [treeNodes,isLeaf] = this.state.checkTreeNodeAndIsLeaf;
        return new Promise(resolve => {
            let pk_demo = {};
            let pks = '';
            let treeNode = '';
            if (checkData.length > 0) {
                checkData.forEach((it) => {
                    pks += it.data.values.pk_demo.value + ',';
                    if (treeNode.indexOf(it.data.values.func_name.value) == -1) {
                        treeNode += it.data.values.func_name.value + ',';
                    }
                })
                pk_demo = pks.substring(0,pks.length - 1);
                treeNode = treeNode.substring(0,treeNode.length - 1);
            }
            let url =CONSTANT.delEMTableData;
            ajax({
                url: url,
                data: { "pk_demo": pk_demo,"isleaf": isLeaf,"treeNode":treeNode},
                success: res => {
                    this.messageHintFun('success',$appRoot.state.json['public_lang-000277']/* 国际化处理： 删除成功*/);
                    this.tableDataFill();
                    listCheckData = [];
                    listCheckValues = [];
                    let buttonStates = this.changeBtnCheck('editTableData',false);
                    this.setState({
                        buttonState:buttonStates
                    })
                },
            });
        })
    }

    /** 导入表数据 */
    importTableData = (formData) => {
        document.getElementById("btn_file").click();
    }
    /** 导入表数据处理 */
    filePathChange = (data) =>{
        var acceptType = 'txt';
        var selectedFile = data.target.value;
        var fileType = selectedFile.substring(selectedFile.indexOf('.') + 1, selectedFile.length);　　// 截取后缀名
        var location = acceptType.indexOf(fileType);
        if (location > -1) {
            let file = data.target.files[0];
            var reader=new FileReader;
            const that = this;
            reader.readAsText(file,'UTF-8');
            reader.onload=function(evt){
                let fileData = evt.target.result;
                return new Promise(resolve => {
                    let url =CONSTANT.importEMTableData;
                    ajax({
                        url: url,
                        data: { "fileData": fileData},
                        success: res => {
                            that.messageHintFun('success',res.data);
                            document.getElementById('btn_file').value = "";
                            listCheckData = [];
                            listCheckValues = [];
                            checkNodeFuncs = funcCodeArr;
                            that.state.checkTreeNodeAndIsLeaf = [];
                            that.state.checkTreeNodeAndIsLeaf.push('root');// 设置节点函数
                            that.state.checkTreeNodeAndIsLeaf.push('false');// 设置是叶子节点,true:0,false,1
                            that.state.checkTreeNodeAndIsLeaf.push('root');// 设置节点refKey
                            that.tableDataFill();
                            that.props.syncTree.openNodeByPk('ExampleManagerTree', 'root' ); // 打开指定节点
                            that.props.syncTree.setNodeSelected('ExampleManagerTree', 'root');// 选中指定节点   
                            let buttonStates = that.changeBtnCheck('editTableData',false);
                            that.setState({
                                buttonState:buttonStates
                            })
                        },
                    });
                })
            }
        } else {
            this.messageHintFun('warning','请选择'+acceptType+'格式文件');
            return;
        }
    }

    /** 导出表数据 */
    exportTableData = () => {
        const element = document.createElement("a");
        let checkData = this.props.editTable.getCheckedRows('exampleManagerTable');
        // let debug = "world"+"\n"+"sdf";
        let content = "";
        if (checkData.length > 0) {
            checkData.forEach((it) => {
                content += it.data.values.demo_name.value +';'+ it.data.values.demo_content.value + ";\n"
            })
        }
        // application/json
        const file =  new Blob([content],{type : 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "函数示例导出文件.txt"; 
        document.body.appendChild(element);
        element.click();
    }

    /** 刷新表数据 */
    searchTableData = () => {
        this.tableDataFill();
        listCheckData = [];
        listCheckValues = [];
        let buttonStates = this.changeBtnCheck('editTableData',false);
        this.messageHintFun('success',$appRoot.state.json['public_lang-000290']/* 国际化处理： 刷新成功*/);
        this.setState({
            buttonState:buttonStates
        })
    }

    /** 表单提交回调 */
    checkForm = (callBack) => {
        alert(callBack)
    }


    /** 表单初始化 */
    initForm = () => {
        let metaEmpty = this.props.meta.getMeta();// 获取列表已存在的模板
        if(!_.isEmpty(metaEmpty)){
            //加载模板,添加到meta中
            // 表功能设置
            this.props.meta.setMeta(examMeta('formTemp'));
            this.props.use.form("exampleForm");
        }
    }
    /** 表单切换 */
    switchForm = (clickBtnType) => {
        if (clickBtnType && clickBtnType == 'editBtn') {// 编辑，查询数据，回显内容
            let checkData = this.dataDealDefault(this.props.editTable.getCheckedRows('exampleManagerTable')[0]);
            let rows = [];
            let row = {};
            row.values = checkData.data.values;
            rows.push(row);
            let data = {};
            data.rows = rows;
            this.props.form.EmptyAllFormValue('exampleForm');
            this.props.form.setAllFormValue({'exampleForm': data});
        } else if (clickBtnType && clickBtnType == 'saveBtn') {
            this.props.form.EmptyAllFormValue('exampleForm');
        }
    }
    sortNumber = (a, b) =>{
        return a - b
    }
    /** 函数说明 */
    funcDesc = () => { 
        const { modal } = this.props;
        let { show } = modal;
        let {treeNodeData} = this.state;
        this.setState({ treeNodeData: treeNodeData,isCheck: true }, () => {
           show('functionDesc');
        });
    }

    /** 信息提示 */
    notificationFun= (title,info,message,btnType) => {
        $nccPlatform.promptBox({
            title: title,
            color: info,
            content: message,
            noFooter: false,
            closeByClickBackDrop:true,
            beSureBtnClick: () => {
                if (btnType && btnType == 'cancelBtn') {
                    let formState = false;
                    this.setState({
                        formState:formState
                    })
                }
                if (btnType && btnType == 'delBtn') {
                    // console.log('删除数据');
                    this.delTableData('');
                }
            },
            cancelBtnClick: () => {

            }
        });
    }
    /** 消息提示 */
    messageHintFun= (info,message) => {
        $nccPlatform.toast({
            color: info,
            content: message,
        });
    }
    /** 表单校验 */
    onAfterEvent =(props, moduleId, key, value,oldValue) => {
        // console.log(value);
        const {treeNodeData} = this.state;
        if (key && key == 'demo_content' && treeNodeData) {
            const regExp = new RegExp("^"+treeNodeData.funcCode+"[\(\(].*","i");
            if (!regExp.test(value.value)) {
                this.messageHintFun('danger','示例内容必须要以[ 函数编码( ]开头！');
            }
        }
    }
    render(){ 
        if (!this.props.meta.getMeta().exampleForm) {
            this.initForm();
        }
        const {clickBtnType} = this.state;
        const { formState } = this.state;
        const { isCheck } = this.state;
        if (!isCheck) {
            if (formState) {
                this.switchForm(clickBtnType);
                this.state.isCheck = true;
            }
        }
        const { createEditTable } = this.props.editTable;
        const { DragWidthCom } = this.props;
        const { createSyncTree } = this.props.syncTree;
        const {form} = this.props;
        const {createForm} = form;
        let { createModal, show } = this.props.ncmodal;
        const {treeNodeData} = this.state;
        let funcCodeRes = '';
        let funcFormatRes = '';
        if (!treeNodeData) {
            funcCodeRes = '';
            funcFormatRes = '';
        } else {
            funcCodeRes = treeNodeData.funcCode;
            funcFormatRes = treeNodeData.funcFormat;
        }
        const funcCaption = $appRoot.state.json['public_lang-000286']/* 国际化处理： 函数说明*/
        const funcCheckInfo = $appRoot.state.json['public_lang-000287']/* 国际化处理： 示例内容必须要以[函数编码(]开头！*/
        const funcNameInfo= $appRoot.state.json['public_lang-000281']/* 国际化处理： 函数名称*/
        const funcFormat = $appRoot.state.json['public_lang-000282']/* 国际化处理： 函数格式*/
        return (
            <div className='flex-container' style={{height: '100%'}}>
                <div  className="example-manager-wrapper exampleManagerCom flex-container" style={{display: formState ? "block" : "none", height: '100%'}}>
                    <div className="search-area search-list Headline">
                        <input type="file" id="btn_file" accept=".txt" style={{display:"none"}} onChange={(e)=>this.filePathChange(e)} />
                        <div className="opration exampleBtnsFormCustomize">
                            <div className="opration-guide normal-opration">{this.validateFormBtns(this.exampleManagerBtn())}</div>                      
                        </div>
                    </div>
                    {/* <div className="forcla" style={{height: '500px'}}> */}
                    <div className="forcla">
                        <div>
                            <div className="exampleFunc">
                                <div className="exampleFuncItem">
                                    <span className="">{funcNameInfo}</span>
                                </div>
                                <div className="exampleFuncValu">
                                    <span className="">{funcCodeRes}</span>
                                </div>
                            </div>
                            <div className="exampleFunc funcFormart">
                                <div className="exampleFuncItem">
                                    <span className="">{funcFormat}</span>
                                </div>
                                <div className="exampleFuncValu">
                                    <span className=""  title = {funcFormatRes}>{funcFormatRes}</span>
                                </div>
                                <span className="exampleFuncValuSpan" onClick={this.funcDesc}>【{funcCaption}】</span>
                            </div>
                        </div>
                        {
                            createForm('exampleForm', {
                                fieldid: "exampleForm",
                                onBeforeEvent:this.onBeforeEvent,
                                isNoStandard:false,
                                // onAfterEvent:this.onAfterEvent
                            })
                        }
                        <div className = 'exampleFuncNot'>
                            <span>{funcCheckInfo}</span>
                        </div>
                    </div>
                </div>
                <div className="example-manager-wrapper ufoe-example-manager flex-container"  style={{display: !formState ? "block" : "none", height: '100%'}}>
                    <div className="search-area search-list Headline exampleBtnsRowCustomize">
                        <div className="opration">
                            <div className="opration-guide normal-opration">{this.validateExampleBtns(this.exampleManagerBtn())}</div>                      
                        </div>
                    </div>
                    {/* <div className="tree-table" style={{minHeight: '500px'}}> */}
                    <div className="tree-table flex-container">
                            <DragWidthCom
                                defLeftWid='20%'  // 默认左侧区域宽度，px/百分百
                                leftMinWid='300px'
                                leftDom={
                                    <div className="tree-area flex-container">
                                        {createSyncTree({
                                            treeId: 'ExampleManagerTree',
                                            needSearch: false, //是否需要搜索框
                                            onSelectEve: this.onSelectEve,//树节点选中事件
                                            // onMouseEnterEve: this.onMouseEnterEve,//树节点鼠标滑过事件

                                        })}
                                    </div>
                                }
                                rightDom={
                                    <div className="nc-singleTable-table-area flex-container">
                                        {createEditTable('exampleManagerTable', {
                                            crossPageSelect: false,
                                            showIndex: true,
                                            showCheck: true,
                                            alloweFilter: false,
                                            adaptionHeight: true,
                                            onSelected: this.onSelectedFn,     // 左侧选择列单个选择框回调
                                            onSelectedAll: this.onSelectedAllFn, // 左侧全选复选框回调
                                            onRowClick: this.onRowClick,  // 行单击回调
                                            cancelCustomRightMenu: true,
                                            showWidthAndHeightConfig: true,
                                            addBlankCol: false
                                        })}
                                    </div>
                                }     //右侧区域dom
                            />
                            {
                                createModal("functionDesc", {
                                    title: $appRoot.state.json['public_lang-000269'],/* 国际化处理： 函数说明*/
                                    className: "functionDesc",
                                    // content: this.generatorFunctionExampleManager(),
                                    content: <ExampleFuncDesc  {...this.props}{...this.state}/>,
                                    zIndex: 500,
                                    noFooter: true,
                                    closeByClickBackDrop:false,
                                })
                            }
                        </div>
                </div>
            </div>
            
        );
    }
}
export default ExampleManager;