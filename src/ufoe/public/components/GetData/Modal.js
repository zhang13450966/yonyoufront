import React, {Component} from 'react';
// import data2 from './treeData';
// import {CONFIGS, URLS} from '../../const/index'

class Mymodal extends Component {
    constructor(props) {
        super(props);
        this.data = [];  //树的数据
    }

    componentDidMount() {

    }
    render() {
        // console.lgo("第一步树组件",this.props.id); slectTreePk
        return this.props.modal.createModal(this.props.getDataModalId,{
            title:this.props.title,
            userControl:true,  
            size:"xlg",
            content:this.props.Content(),
            leftBtnName:$appRoot.state.json['public_lang-000021'], /* 国际化处理： 确定*///左侧按钮名称
            rightBtnName:$appRoot.state.json['public_lang-000022'], /* 国际化处理： 取消*///右侧按钮名称
            hasCloseBtn:false,//控制“X”按钮，显示true，不显示false，默认不显示
            beSureBtnClick:this.props.twoModalBeSureBtnClick, 
         //    cancelBtnClick: this.modelEvent[constantConfig.ADD_TREE_MODE_ID]["cancelBtnClick"].bind(this),
            closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
        })

    }


}

export default Mymodal;
