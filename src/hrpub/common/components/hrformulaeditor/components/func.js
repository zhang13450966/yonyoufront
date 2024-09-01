/**
 * Created by wanghongxiang on 2018/10/19.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
const {
    NCTree
} = base;
const TreeNode = NCTree.NCTreeNode;
import ModalUtil from '../utils'
const staticURL = {
    common: '/nccloud/formula/web/formulatype.do'
}
const Mock = require('./mock.js')
// const propTypes = {
//     formulaData: PropTypes.array
// };
// const defaultProps = {
//     formulaData: [],
// };
class Func extends Component {
    static contextTypes = {
        ctx: PropTypes.object,
        classType: PropTypes.any
    }

    constructor(props) {
        super(props);
        // this.state = {
        //     childrenList: null
        // }
        // this.getCommon = this.getCommon.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)
        this.onSelect = this.onSelect.bind(this)
    }

    componentDidMount() {
        // this.getCommon()
    }


    // 获取公共函数
    // getCommon() {
    //     let _this = this
    //     ajax({
    //         url: staticURL.common,
    //         data: {},
    //         success: res => {
    //             if (res.success) {
    //                 let result = []
    //
    //                 let formulaData = _this.context.formulaData
    //                 if (formulaData.length > 0) {
    //                     result.push(formulaData, res.data)
    //                 } else {
    //                     result.push(res.data)
    //                 }
    //                 _this.setState({
    //                     childrenList : result
    //                 })
    //             }
    //         }
    //     })
    // }

    // 处理树子节点
    getListChild(data) {
        const loop = data => data.map(item => {
            if (item.itemList && item.itemList.length > 0) {
                return (
                    <TreeNode key={item.typeId } title={item.typeName}>
                        {loop(item.itemList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode
                        key={item.typeId || window.crypto.getRandomValues(new Uint8Array(16))}
                        title={item.displayName}
                        hintMsg={item.hintMsg}
                        inputSig={item.inputSig}
                        treeData = {item}
                    />
                )
            }
        })
        return loop(data)
    }

    // 双击事件
    onDoubleClick(checkedKeys, e) {
        let props = e.node.props
        let type = props.treeData && props.treeData.iDataType   // 用于判断是否弹框
        let classType = props.treeData && props.treeData.returnType
        if (this.context.classType && this.context.classType == '0'){
            if (classType!= '0') {
                // toast({color: 'warning', content: '公式返回类型为：字符型与项目数据类型不一致，请修改'})
                toast({color: 'warning', content: this.context.ctx.state.json['hrpub-000171']})
                // return
            }
        }
        // 处理模态框
        let flag = type && ModalUtil.handleDataByType(type, this.context.ctx,props.treeData, '')
        if (flag && !!props) {
            this.context.ctx.handleState({
                inputSig: props.inputSig,
                formulaText: props.hintMsg ? this.context.ctx.state.json['hrpub-000039']+'：' + props.hintMsg : '',
                switchDefined: props.inputSig.indexOf('(') + 1
            })
        }

    }
    // 单击事件
    onSelect(selectedKeys, e) {
        let props = e.selectedNodes[0].props;
        if(!!props){
            this.context.ctx.handleState({
                formulaText: props.hintMsg ? this.context.ctx.state.json['hrpub-000039']+'：' + props.hintMsg : ''
            })
        }
    }
    render() {
        const childrenList = this.context.ctx.state.childrenList.dsList
        const child = childrenList ? this.getListChild(childrenList): []
        return (
            <div>
                <NCTree
                    openIcon={<i className="icon iconfont icon-shu_zk"></i>}
                    closeIcon={<i className="icon iconfont icon-shushouqi"></i>}
                    onSelect={this.onSelect}
                    onDoubleClick={this.onDoubleClick}
                >
                    {child}
                </NCTree>
            </div>
        );
    }
}
// Func.propTypes = propTypes;
// Func.defaultProps = defaultProps;
export default Func;

