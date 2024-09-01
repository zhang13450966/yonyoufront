export default function (tempType,regExp) {
    /** 列表模板加载 */
    if (tempType == 'tableTemp') {
        return {
            exampleManagerTable: {
                items: [
                    // {
                    //     itemtype: "label",
                    //     visible: true,
                    //     label: $appRoot.state.json['public_lang-000263'],/* 国际化处理： 示例序号*/
                    //     attrcode: "demo_seq",
                    //     width: "120px",
                    // },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000264'],/* 国际化处理： 示例名称*/
                        attrcode: "demo_name",
                        width: "120px",
                    },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000265'],/* 国际化处理： 示例内容*/
                        attrcode: "demo_content",
                        width: "240px",
                    },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000266'],/* 国际化处理： 默认*/
                        attrcode: "default_demo",
                        width: "80px",
                    },
                ],
                moduletype: "table",
            },
        }
    }
    /** 表单模板加载 */
    if (tempType == 'formTemp') {
        return {
            exampleForm:{
                moduletype:'form',
                items: [
                    {
                        attrcode: 'demo_name',
                        label: $appRoot.state.json['public_lang-000283'],/* 国际化处理： 示例名称*/
                        itemtype: 'input',
                        col: 2, 
                        rightspace:2,
                        required: true,
                        visible: true,
                        maxlength: 20,
                    }
                    , {
                        attrcode: 'default_demo',
                        label: $appRoot.state.json['public_lang-000285'],/* 国际化处理： 默认示例*/
                        itemtype: 'checkbox_switch',
                        options: [
                            {
                                display: $appRoot.state.json['public_lang-000285'],/* 国际化处理： 默认示例*/
                                value: false
                            }
                        ],
                        col: 2,
                        visible: true,
                    }, 
                    {
                        attrcode: 'demo_content',
                        label: $appRoot.state.json['public_lang-000284'],/* 国际化处理： 示例内容*/
                        itemtype: 'textarea',
                        col: 4,
                        required: true,
                        visible: true,
                        reg:regExp,
                        maxlength: 500,
                    }
                ],
                status : 'edit'
            }
        }
               
    }
    /** 函数说明模板加载 */
    if (tempType == 'funcTemp') {
        return {
            exampleFuncTable: {
                items: [
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000264'],/* 国际化处理： 参数名称*/
                        attrcode: "func_name",
                        width: "120px",
                    },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000265'],/* 国际化处理： 参数描述*/
                        attrcode: "func_desc",
                        width: "320px"
                    }
                ],
                moduletype: "table",
            }
        }
    }
     /** （使用）列表模板加载 */
     if (tempType == 'useTableTemp') {
        return {
            demoTable: {
                items: [
                    // {
                    //     itemtype: "label",
                    //     visible: true,
                    //     label: $appRoot.state.json['public_lang-000263'],/* 国际化处理： 示例序号*/
                    //     attrcode: "demo_seq",
                    //     width: "20%",
                    // },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000264'],/* 国际化处理： 示例名称*/
                        attrcode: "demo_name",
                        // width: "20%",
                        width: 100,
                    },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000265'],/* 国际化处理： 示例内容*/
                        attrcode: "demo_content",
                        // width: "20%",
                        // width: 100,
                    },
                    {
                        itemtype: "label",
                        visible: true,
                        label: $appRoot.state.json['public_lang-000266'],/* 国际化处理： 默认*/
                        attrcode: "default_demo",
                        // width: "20%",
                        width: 100,
                    },
                    {
                        label: $appRoot.state.json['public_lang-000273'], /* 国际化处理： 操作*/
                        visible: true,
                        attrcode: 'opr',
                        itemtype: 'customer',
                        disabled: false,
                        fixed: 'right',
                        // width: "180px"
                        width: 120,
                    }
                ],
                moduletype: "table",
            },
        }
    }
}


