/**
 *
 * Created by shenzaifang on 2019-08-29
 */
export function getBillinfo(pagecodeValues, domTemplate, defaultConfig) {
    let arr = [];
    let data = domTemplate;
    for (let key in pagecodeValues) {
        if (data.hasOwnProperty(key)) {
            dealTemplate(data[key], pagecodeValues[key], defaultConfig)
        }
    }
    return arr;

    function dealTemplate(template, pagecode, defaultConfig = {}) {
        for (let key in template) {
            let data = template[key];
            if (typeof data === "object") {
                if (data.hasOwnProperty('moduletype')) {
                    let moduletype = data.moduletype;
                    if (moduletype === 'form') {
                        let bodycode = isMainForm(template, data.code);
                        if (bodycode) {
                            // 拥有子集
                            setForm(data, pagecode, bodycode)
                        } else {
                            let isSub = isSubForm(template, data.code);
                            if (!isSub) {
                                setForm(data, pagecode)
                            }
                        }

                    } else if (moduletype === 'table') {
                        if (JSON.stringify(defaultConfig) !== '{}') {
                            // 关联到表格后适配
                            let bodycode = isMainTable(template, data.code);
                            if (bodycode) {
                                // 多页签主表关联无法获取headcode，需要在页面配置后手动传入
                                const { headcode } = defaultConfig;
                                setCardTable(pagecode, headcode, bodycode);
                            } else {
                                let isSub = isSubForm(template, data.code) || isSubTable(template, data.code);
                                if (!isSub) {
                                    setTable(data, pagecode)
                                }
                            }
                        } else {
                            let isSub = isSubForm(template, data.code);
                            if (!isSub) {
                                setTable(data, pagecode)
                            }
                        }
                    }
                }
            }
        }
    }

    function isMainForm(template, code) {
        let ret;
        let formrelation = template.formrelation;
        if(!formrelation) return ret;
        if (formrelation.hasOwnProperty(code)) {
            let formArr = formrelation[code];
            if(formArr.length>0){
                ret = formArr;
            }
        }
        return ret
    }

    function isMainTable(template, code) {
        let ret;
        let containerrelation = template.containerrelation;
        if(!containerrelation) return ret;
        if (containerrelation.hasOwnProperty(code)) {
            let tableArr = containerrelation[code];
            if(tableArr.length>0){
                ret = tableArr.flat();
            }
        }
        return ret
    }

    /**
     * 是否是子集
     * @param template
     * @param code
     * @returns {*}
     */
    function isSubForm(template, code) {
        let ret;
        let formrelation = template.formrelation;
        if(!formrelation) return ret;
        for (let key in formrelation) {
            let arr = formrelation[key];
            if (Array.isArray(arr)) {
                ret = arr.includes(code);
            }
        }
        return ret
    }

    function isSubTable(template, code) {
        let ret;
        let containerrelation = template.containerrelation;
        if(!containerrelation) return ret;
        for (let key in containerrelation) {
            let tableArr = containerrelation[key].flat();
            if (Array.isArray(tableArr)) {
                ret = tableArr.includes(code);
            }
        }
        return ret
    }

    function setForm(data, pagecode, bodycode = []) {
        let temp = {
            pagecode,
            headcode: data.code,
        };
        if (bodycode.length>1) {
            // 拥有子集
            temp.billtype = 'extcard';
            temp.bodycode = bodycode
        } else if (bodycode.length===1) {
            // 拥有子集
            temp.billtype = 'card';
            temp.bodycode = bodycode[0]
        }else {
            // 单个表单
            temp.billtype = 'form';
        }
        arr.push(temp)
    }

    function setTable(data, pagecode) {
        let temp = {
            billtype: 'grid',
            pagecode,
            bodycode: data.code
        };
        arr.push(temp)
    }

    function setCardTable(pagecode, headcode, bodycode = []) {
        if (bodycode.length) {
            let temp = {
                pagecode,
                headcode,
            };
            if (bodycode.length > 1) {
                temp.billtype = 'extcard';
                temp.bodycode = bodycode;
            } else {
                temp.billtype = 'card';
                temp.bodycode = bodycode[0]
            }
            arr.push(temp)
        }
    }
}
