import React from 'react';
import "./index.less"
window["$nccPlatform"] = window["nc-lightapp-front"];
let { base, createPage, ajax } = $nccPlatform;
import UnitFormulaBox from "../PluginUnitFormula/unitFormula";



class ConditionsReference extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    show = () => {
        if(this.props.updateThis){this.props.updateThis(this)}
        let that = this;
        let contentConfig = [];
        let text = "";
        if(this.props.ConditionsReferenceText){
            text = this.props.ConditionsReferenceText;
        }
        contentConfig[0] = {
            key: "key1",
            content: text,//如果有值  在切换或者初始化进入以后会渲染该值
        };
        that.props.unitFormula.showModel({
            mid: "conditions_reference",
            contentConfig: contentConfig,
            getParms: () => { },
            beSureBtnClick: (data) => {
                console.log($appRoot.state.json['public_lang-000005'], data, "set_calculation_index_table_meta",);/* 国际化处理： 点击确定回调*/
                // let twoTableState = this.state.twoTableState;
                // twoTableState[index] = data;
                // this.setState({twoTableState});
                // that.props.editTable.setValByKeyAndIndex(id, index, attrCode, { value: data, display: data });
                // that.props.unitFormula.closeModel(unitFormulaId);
            },
            // beCancelUnitFormulaClick:()=>{

            // },
            // ...config
            ...this.props
        },
            {}
        );
    }
    componentDidMount() {
        this.show();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isShow !== this.props.isShow) {
            if (nextProps.isShow) {
                this.show();
            }
        }
    }
    initComponent = () => {

    }

    render() {
        console.log($appRoot.state.json['public_lang-000036'], this);/* 国际化处理： 关键字条件参数*/
        return <div></div>;

    }

}
export default (ConditionsReference = createPage({})(UnitFormulaBox(ConditionsReference, {
    mid: "conditions_reference",
    // title: $appRoot.state.json['public_lang-000037']/* 国际化处理： 条件参数*/
    title: '条件参数'/* 国际化处理： 条件参数*/
})));
