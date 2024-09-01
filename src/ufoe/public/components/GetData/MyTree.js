import React, {Component} from 'react';
// import data2 from './treeData';
// import {CONFIGS, URLS} from '../../const/index'

class MyTree extends Component {
    constructor(props) {
        super(props);
        this.data = [];  //树的数据
    }

    componentDidMount() {
        this.props.syncTree.setSyncTreeData(this.props.getDataTreeId,[]);
    }
    onSelectEve = (...ars)=>{
        console.log($appRoot.state.json['public_lang-000103'],ars);/* 国际化处理： 树节点点击*/
        let pk = ars[0];
        if(!ars[1].isleaf){
            pk = "";
        }
        this.props.slectTreePk&&this.props.slectTreePk(pk,ars);;
    }
    render() {
        // console.lgo("第一步树组件",this.props.id); slectTreePk
        return <div className="tree-area">
            {
                this.props.syncTree.createSyncTree({
                    treeId: this.props.getDataTreeId, // 组件id
                    // needSearch: true, //是否需要查询框，默认为true,显示。false: 不显示
                    // needEdit: true, //是否需要编辑节点功能，默认为true,可编辑；false：不可编辑
                    onSelectEve: this.onSelectEve,   //选择节点回调方法
                    needEdit:false,
                    showModal: false, //是否使用弹出式编辑
                    searchType:"filtration",
                    // checkable: true,
                    // clickEditIconEve: (info) => treeButtonClick.clickEditIconEve.call(this, 'edit', info), //编辑点击 回调
                    // clickAddIconEve: (info) => treeButtonClick.clickAddIconEve.call(this, 'add', info), //新增点击 回调
                    // clickDelIconEve: (info) => treeButtonClick.clickDelIconEve.call(this, 'delete', info), // 删除点击 回调
                })
            }
        </div>

    }


}

export default MyTree;
