import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { base } from 'nc-lightapp-front';
import './index.less'
import { toNumber } from 'lodash';
const { NCTree, NCFormControl} = base
const propTypes = {
    editType: PropTypes.boolean,
    treeData: PropTypes.array,
    config: PropTypes.object,
    event: PropTypes.object,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    expandedKeys: PropTypes.array,
    showSearch: PropTypes.boolean
};
const defaultProps = {
    config: {
        root:{
            title: '部门',
            key: 'null'
        },
        defaultExpandAll: true,
        checkable:false,
        showLine:true,
        datas: [],
        selectedKeys:  ['0-0'],
        openIcon: <i className="icon iconfont icon-shu_zk"></i>,
        closeIcon: <i className="icon iconfont icon-shushouqi"></i>,
        selectedNode: '0-0',
        showRoot:true,
        // placeholder:'search',
        iconClassArr:['icon iconfont icon-biangengjilu','icon iconfont icon-zengjia add-icon','icon iconfont icon-shanchu delete-icon']
    },
    showSearch: false,
    onExpand: () => {},
    onCheck: () => {},
    expandedKeys: ['0-0'],
    checkedKeys: [],
    disableCheckboxArr:[],
    event: {
        editRender: (a, b, c)=>{
        },
        addRender: (a, b, c)=>{
        },
        delRender: (a, b, c)=>{
        }
    }
};
class Hrtree extends Component {
    constructor(props) {
        super(props)
        this.renderTreeTitle = this.renderTreeTitle.bind(this)
        this.events = Object.assign(defaultProps.event,this.props.event)
        this.editRender = this.events.editRender.bind(this)
        this.addRender = this.events.addRender.bind(this)
        this.delRender = this.events.delRender.bind(this)
        this.addIconBox = this.addIconBox.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onExpand = this.onExpand.bind(this)
        this.onCheck = this.onCheck.bind(this)
        this.config = Object.assign(defaultProps.config,this.props.config)
    }
    state = {
        showTree: true,
        searchValue: null,
        defaultExpandAll: true,
        expandedKeys: ['0-0'],
        treeOriginData: [],
        checkedKeys: [],
        disableCheckbox: false,
        disableCheckboxAll: [],
        placeholder:'search',
        timer : null,
        replaceChecked:false,
    }
    componentDidMount() {
        this.setState({
            treeOriginData: this.props.treeData,
            expandedKeys: this.props.expandedKeys,
            checkedKeys: this.props.checkedKeys,
            disableCheckbox: this.props.disableCheckbox,
            disableCheckboxArr: this.props.disableCheckboxArr,
            placeholder:this.props.placeholder,
            replaceChecked:this.props.replaceChecked,
        })
    }

    componentWillReceiveProps(nextprops) {
        console.log(nextprops,'nextprops')
        let nexttreeData = JSON.stringify(nextprops.treeData);
        let thistreeData = JSON.stringify(this.props.treeData);
        if(nexttreeData !== thistreeData){
            this.setState({
                showTree: true,
                treeOriginData: nextprops.treeData,
                expandedKeys: this.props.expandedKeys,
                checkedKeys: nextprops.checkedKeys,
                disableCheckboxArr:nextprops.disableCheckboxArr,
                disableCheckbox: nextprops.disableCheckbox,
                replaceChecked:nextprops.replaceChecked
            })
        }else{
            this.setState({
                checkedKeys: nextprops.checkedKeys,
                disableCheckbox: nextprops.disableCheckbox,
                disableCheckboxArr:nextprops.disableCheckboxArr,
                replaceChecked:nextprops.replaceChecked
            })
        }
    }
    addIconBox (data){
        if (data && data instanceof Array && data.length > 0) {
            data.forEach((item) => {
                item.iconBox = {
                    addIcon: true,
                    delIcon: true,
                    editIcon: true
                };
                if (Array.isArray(item.children)) {
                    this.addIconBox(item.children);
                }
            });
        }
        return data
    }
    renderTreeTitle(item, editType) {
        let editIcon, titleInfo, addIcon, delIcon, iconBox, beforeName, afterName;
        //编辑图标
        let flag = item.flag ? item.flag : true;
        let addField = true;

        editType = this.config.editType;

        if (editType) {
            if (item.iconBox) {
                
                if (item.iconBox.editIcon && item.code && item.code != 'system') {
                    let icon = this.config.iconClassArr[0] ? 
                        this.config.iconClassArr[0] : '';

                    editIcon = (
                        <i
                            field={addField ? 'editIcon' : null}
                            fieldname={addField ? '编辑' : null}
                            className={icon}
                            onClick={(e) => this.editRender.call(this, item, e, 'editIcon')}
                        />
                    );
                }
                if (item.iconBox.addIcon) {
                    let icon = this.config.iconClassArr[1] 
                        && (flag == 2 || flag === true)? this.config.iconClassArr[1] : '';

                    addIcon = (
                        <i
                            field={addField ? 'addIcon' : null}
                            fieldname={addField ? '新增' : null}
                            className={icon}
                            onClick={(e) => this.addRender.call(this, item, e, 'addIcon')}
                        />
                    );
                }
                if (item.iconBox.delIcon && item.code && item.code != 'system') {
                    let icon = this.config.iconClassArr[2]?this.config.iconClassArr[2]:'';
                    delIcon = (
                        <i
                            field={addField ? 'delIcon' : null}
                            fieldname={addField ? '删除' : null}
                            className={icon}
                            onClick={(e) => this.delRender.call(this, item, e, 'delIcon')}
                        />
                    );
                }
            } else {
                console.warn('请设置iconBox属性，{editIcon, addIcon, delIcon}');
            }
        }
        iconBox = (
            <span className="NC_iconBox">
                {editIcon} {addIcon} {delIcon}
            </span>
        );
        // let iconClass = (<i  style={{marginRight: '5px'}} class="tree-dian"></i>)
        // if (Array.isArray(item.children)&& item.children.length > 0) {
        //     iconClass = (<i style={{marginRight: '5px'}} class="icon iconfont icon-wenjianjia tree-wenjian"></i>)
        // }
        titleInfo = <span className={"title-middle " + item.className}>{item.refname || item.title}</span>;
        item.hasOwnProperty('beforeName') && (beforeName = item.beforeName);
        item.hasOwnProperty('afterName') && (afterName = item.afterName);

        return (
            <div className="syncTreeCom">
                <div className="title-con">
                    {beforeName}
                    {titleInfo}
                    {afterName}
                    {editType? iconBox : null}
                </div>
            </div>
        );
    };
    getParentKey(title, tree){
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.title === title)) {
                    parentKey = node.key || node.children[i].key;
                } 
            }
        }
        return parentKey;
    };
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: true,
        });
    }
    onChange(value) {
        value = value.trim()
        this.setState({
            searchValue: value
        });
        if(value.length === 0) {
            this.numberType(value)
            return
        }
        try {
            if(Number(value) === 0) {
                return
            }
        } catch (error) {   
        }
        let timer = this.state.timer
        if(isNaN(value-0) === false) {
            if(timer) {
                clearTimeout(timer)
            } 
            timer = setTimeout(()=>{
                this.numberType(value)
            },1500)
            this.setState({
                timer
            })
           
        } else {
            this.numberType(value)
        }
        
    }
    // debounceHandle = () => {
        
    //     return (value)=>{
            
           
    //     }
    // }
    numberType = (value) => {
        let expandedKeys = [];
        let currentSelectKeys = [];
        let uniqueExpandedKeys = [];
        let data = null
        if (value) {
            
            data = this.getExpandData(this.props.treeData,value)
            data.forEach((item)=>{
                if(item.children.length>0){
                    item.children.forEach((child)=>{
                        currentSelectKeys.push(child.key)
                        uniqueExpandedKeys.push(child.key)
                    })
                }else{
                    currentSelectKeys.push(item.key)
                    uniqueExpandedKeys.push(item.key)
                }
            })
        } else {
            data = JSON.parse(JSON.stringify(this.props.treeData))
            currentSelectKeys = ['root']
            uniqueExpandedKeys = ['0-0'] 
        }
        //如果树上的多选框是被禁用的，筛选出的数据默认不勾
        if(this.state.disableCheckbox){
            currentSelectKeys = []
        }
        if(this.state.replaceChecked){
            this.onCheck(currentSelectKeys)
        }   
        this.setState({
            // checkedKeys: [],
            expandedKeys: uniqueExpandedKeys,
            autoExpandParent: true, 
            treeOriginData: data
        });
    }

    getExpandData =(treeData,value,data=[])=>{
        let _this = this
        if(treeData.length>0){
            let dataIitem = null
            let children = []
            treeData.forEach((item)=>{
                if(item.children.length>0){
                   _this.getExpandData(item.children,value,data)
                }else{
                   if(item.refname.indexOf(value)>-1){   
                        data.push(item)  
                    }   
                }
            })
        }
        return data
    }



    onCheck(key,y) {
        let selectkey = y.node._reactInternalFiber.key
        selectkey = selectkey.slice(selectkey.indexOf('$')+1)
        let selectkeyNode = y.node._reactInternalFiber.pendingProps
        let checkedKeysToo = this.state.checkedKeys
        if(key.indexOf('0-0')>-1||key.length==0) {
            key.splice(key.indexOf('0-0'),1)
        }
        if(selectkeyNode.pos === '0-0') {
            if(y.checked) {
                checkedKeysToo = [...new Set(checkedKeysToo.concat(key))]
            } else {
                if(selectkeyNode.children.some((item)=>{
                    return item.props.children&&item.props.children.length>0
                })) {
                    checkedKeysToo = []
                } else {
                    selectkeyNode.children.forEach((item)=>{
                        if(checkedKeysToo.indexOf(item.key)>-1) {
                            checkedKeysToo.splice(checkedKeysToo.indexOf(item.key),1)
                        }
                        
                    })
                }
                
            }
            
        } else {
            if(selectkeyNode.children&&selectkeyNode.children.length>0) {
                if(y.checked) {
                    selectkeyNode.children.forEach((item)=>{
                        checkedKeysToo.push(item.key)
                    })
                    checkedKeysToo.push(selectkey)
                    checkedKeysToo = [...new Set(checkedKeysToo)]
                } else {
                    selectkeyNode.children.forEach((item)=>{
                        if(checkedKeysToo.indexOf(item.key)>-1) {
                            checkedKeysToo.splice(checkedKeysToo.indexOf(item.key),1)
                        }
                       
                    })
                    if(checkedKeysToo.indexOf(selectkey)>-1) {
                        checkedKeysToo.splice(checkedKeysToo.indexOf(selectkey),1)
                    }
                    
                }
                
            } else {
                if(y.checked == false) {
                    checkedKeysToo.splice(checkedKeysToo.indexOf(selectkey),1)
                    if(checkedKeysToo.indexOf(selectkeyNode.pid)>-1) {
                        checkedKeysToo.splice(checkedKeysToo.indexOf(selectkeyNode.pid),1)
                    }
                    
                } else {
                    checkedKeysToo.push(selectkey)
                }
            }
        }
            
        this.setState({
            checkedKeys: key
        },() => {
            this.props.onCheck(key)
        })
    }

    render () {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <NCTree.NCTreeNode
                        title={this.renderTreeTitle(item)}
                        key={item.key}
                        pid = {item.pid}
                        code = {item.code}
                        innercode = {item.innercode}
                        disableCheckbox= {this.state.disableCheckbox||Array.isArray(this.state.disableCheckboxArr)&&this.state.disableCheckboxArr.indexOf(item.key)>=0?true:false}
                    >
                        {loop(item.children)}
                    </NCTree.NCTreeNode>
                );
            }
            return (
                <NCTree.NCTreeNode 
                    title={this.renderTreeTitle(item)} 
                    key={item.key}
                    pid = {item.pid}
                    code = {item.code}
                    innercode = {item.innercode}
                    isLeaf={true}
                    disabled={item.key === '0-0-0'} 
                    disableCheckbox= {this.state.disableCheckbox||Array.isArray(this.state.disableCheckboxArr)&&this.state.disableCheckboxArr.indexOf(item.key)>=0?true:false}
                />
            );
        });
        let data  = this.addIconBox(this.state.treeOriginData)
       
        const treeNodes = loop(data);

        let tree = this.config.showRoot ?
            (
                <NCTree.NCTreeNode
                    className="sn-first-title"
                    title={this.renderTreeTitle(this.props.config.root)}
                    disableCheckbox= {this.state.disableCheckbox}
                    
                >
                    {treeNodes}
                </NCTree.NCTreeNode>
            ) : (treeNodes);

        return(
            <div id ="sn-hr-tree" className="sn-hr-tree">
                <div style={{display: this.props.showSearch? '': 'none'}}>
                    <NCFormControl
                        // style={{ width: '95%'}}
                        placeholder={this.state.placeholder}
                        value = {this.state.searchValue}
                        onChange={this.onChange}
                        type = 'search'
                        onSearch = {this.onChange}
                    />
                </div>
                {this.state.showTree?<NCTree
                    {...Object.assign(defaultProps.config,this.props.config)}
                    expandedKeys = {this.state.expandedKeys}
                    defaultExpandedKeys = {this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    checkedKeys={this.state.checkedKeys}
                    onExpand = {this.onExpand}
                    onCheck={this.onCheck}
                >
                    {tree}
                </NCTree>:<div></div>}
            </div>
        )
    }
}
Hrtree.propTypes = propTypes;
Hrtree.defaultProps = defaultProps;
export default Hrtree;
