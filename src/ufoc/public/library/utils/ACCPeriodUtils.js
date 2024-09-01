/*
 * @Description: 会计期间相关工具类
 * @Autor: hgq
 * @Date: 2021-12-02 20:11:15
 */
export const _ACCPeriodUtils={
     /**
     * @name: 获取会计期间display对应的pk
     * @param {*} pk_keygroup 关键字组合pk
     * @param {*} timeStr 时间字符串
     */
    getACCTimePK:async function (pk_keygroup,timeStr){
        if(timeStr.length!=7){
            throw new Error("time is not checked")
        }
        let treepara={
            "pageInfo":{
                "pageSize":"50",
                "pageIndex":-1
            },
            "pid":"",
            "keyword":"",
            "queryCondition":{
                "isShowUnit":false,
                "refpath":"ufoe/refer/inner/AccPeriodUFOERef/index",
                "pk_keygroup":pk_keygroup
            }
        }
        let res = await $nccUtil.promiseAjax("/nccloud/ufoe/refer/accPeriodUFOETreeRef.do", treepara);
        if(res.success){
            let rows=_.get(res,'data.rows')
            let filterPids=[]
            rows.forEach(it => {
                filterPids.push(_.get(it,'refpk'))
            });
            let gridpara={
                "pageInfo":{
                    "pageSize":"50",
                    "pageIndex":0
                },
                "keyword":timeStr,
                "pid":"",
                "queryCondition":{
                    "isShowUnit":false,
                    "refpath":"ufoe/refer/inner/AccPeriodUFOERef/index",
                    "pk_keygroup":pk_keygroup
                },
                "refRelyCondition":{
            
                },
                "filterPids":filterPids,
                "defineItems":[
            
                ]
            }
            let gridres = await $nccUtil.promiseAjax("/nccloud/ufoe/refer/accPeriodUFOEGridRef.do", gridpara);
            if(gridres.success){
                return _.get(gridres,'data.rows[0].refpk')
            }
        }

    },
    /**
     * @name: 获取自然期间的endDate
     * @param {*} pk_keygroup 关键字组合pk
     * @param {*} timeStr 时间字符串
     */
    getEndDate:async function(pk_keygroup,timeStr){
        let para={
            pk_keygroup:pk_keygroup,
            date:timeStr
        }
        let endDate=await $nccUtil.promiseAjax("/nccloud/ufoc/keyword/KeyWordTimeEndDate.do", para);
        if(endDate.success){
            return _.get(endDate,'data')
        }
    },
    /**
     * 格式化日期
     * @param dateVal {{display:string, value:{firstvalue:string}}}
     * @returns {string}
     */
    parseDate (dateVal) {
        const { display, value: { firstvalue } } = dateVal
        const displayDate = new Date(display);
        const valueDate = new Date(firstvalue);
        const formatDate = dateObj => {
            const year = dateObj.getFullYear().toString()
            let month = (dateObj.getMonth()+1).toString()
            let day = dateObj.getDate().toString()
            if (month.length < 2) {
                month = `0${month}`
            }
            if (day.length < 2) {
                day = `0${day}`
            }
            return `${year}-${month}-${day}`
        }
        //如果是会计期间，display一定合法，value一定不合法；如果是会计期间，display可能合法，value值一定合法
        if (valueDate.toLocaleString() !== 'Invalid Date') {
            //优先取value值转日期，这种情况只能是自然日期，且日期格式一定是‘2022-06-31 00:00:00，需要截掉时间部分’
            return formatDate(valueDate)
        } else {
            //如果value值的日期格式非法，则使用display值转日期，这种情况一定是会计期间，且格式有可能是 ‘2022’、‘2022-06’，直接返回
            return display
        }
    }
}