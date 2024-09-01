import { Component } from "react";
import Ref from "./refer";
import { high } from "nc-lightapp-front";
const {
    Refer: { MultiLangWrapper },
} = high;
import Utils from "@public/utils";
const { langCheck } = Utils;

class RadioChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { refname: langCheck("reportMultiLang", "100301-000083"), refpk: "root" } /* 国际化处理： 用户组*/,
        };
    }

    rRadioOnChange = (radioValue) => {
        let _this = this;
        let values = {};
        if (radioValue == "pk_usergroup") {
            values = {
                refname: langCheck("reportMultiLang", "100301-000083"),
                refpk: "root",
            }; /* 国际化处理： 用户组*/
        } else if (radioValue == "pk_dept") {
            values = {
                refname: langCheck("reportMultiLang", "100301-000084"),
                refpk: "root",
            }; /* 国际化处理： 部门*/
        } else {
            values = {
                refname: langCheck("reportMultiLang", "100301-000085"),
                refpk: "root",
            }; /* 国际化处理： 所属组织*/
        }
        _this.setState(
            {
                value: values,
            },
            () => {
                _this.render();
            }
        );
    };

    render() {
        let _this = this;
        return (
            <Ref
                {..._this.props}
                rootNode={_this.state.value}
                rRadioOnChange={_this.rRadioOnChange}
            />
        );
    }
}

RadioChange = MultiLangWrapper(RadioChange);

export default function (props = {}) {
    var conf = {
        multiLang: {
            domainName: "lappreportrt",
            currentLocale: "zh-CN",
            moduleId: "100301",
        },
        queryTreeUrl: "/nccloud/riart/ref/userRefTreeAction.do",
        queryGridUrl: "/nccloud/riart/ref/userRefTableAction.do",
        rootNode: {
            refname: ["100301-000086"],
            refpk: "root",
        } /* 国际化处理： 用户*/,
        columnConfig: [
            {
                name: [
                    ["100301-000087"],
                    ["100301-000088"],
                    ["100301-000089"],
                    ["100301-000085"],
                ] /* 国际化处理： 编码,名称,所属用户组,所属组织*/,
                code: ["refcode", "refname", "groupname", "name"],
            },
        ],
        queryCondition: {
            roleRefClassType: "pk_usergroup",
            group_pk: "firstGroup",
        },
        treeConfig: {
            name: [["100301-000087"], ["100301-000088"]],
            code: ["refcode", "refname"],
        } /* 国际化处理： 编码,名称*/,
        isMultiSelectedEnabled: true,
        showClassification: false,
        refType: "gridTree",
        refName: ["100301-000090"] /* 国际化处理： 用户参照*/,
        unitProps: {
            rootNode: {
                refname: ["100301-000091"],
                refpk: "root",
            } /* 国际化处理： 集团*/,
            refName: ["100301-000091"] /* 国际化处理： 集团*/,
            refCode: "pk_group",
            queryTreeUrl: "/nccloud/riart/ref/groupRefTreeAction.do",
            refType: "tree",
            pageSize: 50,
            isCacheable: true,
            placeholder: ["100301-000091"] /* 国际化处理： 集团*/,
            treeConfig: {
                name: [["100301-000087"], ["100301-000088"]],
                code: ["refcode", "refname"],
            } /* 国际化处理： 编码,名称*/,
        },
        isShowUnit: false,
        placeholder: ["100301-000090"] /* 国际化处理： 用户参照*/,
    };

    return <RadioChange {...conf} {...props} />;

    // return <Ref {...Object.assign(conf, props)} />
}
