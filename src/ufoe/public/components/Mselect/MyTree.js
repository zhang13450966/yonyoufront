import React, {Component} from 'react';
// import data2 from './treeData';
// import {CONFIGS, URLS} from '../../const/index'

class MyTree extends Component {
    constructor(props) {
        super(props);
        this.data = [];  //树的数据
    }

    componentDidMount() {
        this.props.syncTree.setSyncTreeData(this.props.mselectTreeId, []);
    }

    render() {
        let {config = {}} = this.props
        return <div className="tree-area">
            {
                this.props.syncTree.createSyncTree({
                    treeId: this.props.mselectTreeId, // 组件id
                    needEdit:false,
                    // needSearch: true, //是否需要查询框，默认为true,显示。false: 不显示
                    // needEdit: true, //是否需要编辑节点功能，默认为true,可编辑；false：不可编辑
                    // onSelectEve: this.onSelectEve,   //选择节点回调方法
                    showModal: false, //是否使用弹出式编辑
                    // checkable: true,
                    // clickEditIconEve: (info) => treeButtonClick.clickEditIconEve.call(this, 'edit', info), //编辑点击 回调
                    // clickAddIconEve: (info) => treeButtonClick.clickAddIconEve.call(this, 'add', info), //新增点击 回调
                    // clickDelIconEve: (info) => treeButtonClick.clickDelIconEve.call(this, 'delete', info), // 删除点击 回调
                    searchType:"filtration",
                    ...config
                })
            }
        </div>

    }


}

export default MyTree;
