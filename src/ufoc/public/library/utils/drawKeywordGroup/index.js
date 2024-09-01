import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';

// import './Base.less';

const { NCSelect } = base;
const NCOption = NCSelect.NCOption;
/*
 * @Author: zhy
 * @Description: 参数说明如下
 * 1.searchAreaId:区域id,
 * 2.val：合并方案, 
 * 3.chooseMore：组织参照单选多选, 
 * 4.areaType：form search区域类型,
 * 5.formOtherQuery: form区域需要返现关键词需要传的参数及会计期间参照的参数
 * 6.data:关键字组合对象
 * 7.objs:凭证明细返回的userjson  给关键字组合赋值
 * @Date: 2021-07-29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-29 10:44:00
 */
// 查询关键字组合 search区域筛选完合并方案参照后调用
export async function getKeyWordGroups(searchAreaId, val, chooseMore, areaType, formOtherQuery, defaultIncludeChildren) {
    let queryCondition = {
        pk_hbscheme: val.refpk
    }
    formOtherQuery.pk_hbscheme = val.refpk;
    let res = await $nccUtil.promiseAjax('/nccloud/ufoc/keyword/keyWordRefCreateBase.do', queryCondition);  //发送ajax查询关键字组合
    const { data } = res
    return await doKeywordGroup(searchAreaId, data, chooseMore, areaType, formOtherQuery, defaultIncludeChildren) // 关键字组合渲染
}
// 渲染参照或者字符串
export async function doKeywordGroup(searchAreaId, data, chooseMore, areaType, objs, defaultIncludeChildren = false) {
    let mapList = new Map() // 给参照储存成{'corp':{value:'12',display:'12'}}格式 方便赋值
    let metaAddList = [];
    let snapAddList = [];
    // 画参照
    let pk_periodkey = '';
    let filterItemCodes = [];
    let { notRenderKeyWordCodes = [] } = objs;//控制指定的关键字不进行渲染，数组中存的是关键字的code
    data.keyWordRefInfo.forEach((item, idx) => { //关键字
        if (notRenderKeyWordCodes.includes(item.code)) {
            return;
        }
        let metaObj = {
            attrcode: item.code,
            isdrag: false,
            isfixedcondition: false,
            isnotmeta: true,
            label: item.name,
            placeholder: item.name,
            refcode: item.refPath,
            refname: item.name,
            refpk: item.code,
            required: true,
            visible: item.isVisible,
            isdynamic: true,
            onlyOne: true
        };
        let snapObj = {
            attrcode: item.code,
            initialvalue: { display: '', value: '' },
            isExtend: false,
            isconverttimezones: undefined,
            isfixedcondition: false,
            label: item.name,
            refpk: item.code,
            remove: false,
            visible: item.isVisible,
            required: true, // 是否必填
            isnotmeta: true,
            isdynamic: true,
            onlyOne: true
        };
        if (item.type == '1') { //字符
            metaObj.itemtype = "input";
            metaObj.queryOperateType = "=@>@>=@<@<=@like@";
            snapObj.itemtype = "input";
            snapObj.operationSign = "=@>@>=@<@<=@like@";

        } else if (item.type == '2' || item.type == '4') { //2参照  4会计期间（参照格式）
            metaObj.itemtype = "refer";
            metaObj.queryOperateType = "=@";
            snapObj.itemtype = "refer";
            snapObj.operationSign = "=@";

        } else if (item.type == '3') { //自然期间（日历格式）
            // 自然期间需要先清一下，要不之前渲染过会计期间会导致再改成自然期间组件改不过来
            $appRoot.props.renderItem(areaType, searchAreaId, item.code, null);
            metaObj.itemtype = "datepicker";
            metaObj.queryOperateType = "=@>@>=@<@<=@like@";
            snapObj.itemtype = "datepicker";
            snapObj.operationSign = "=@>@>=@<@<=@like@";
        }
        if (item.code == "date") {
            pk_periodkey = item.pk_keyword
        }
        metaAddList.push(_.cloneDeep(metaObj));
        snapAddList.push(_.cloneDeep(snapObj));
        mapList.set(item.code, item.m_strKeyVal);
        filterItemCodes.push(item.code);
    })
    let list = Array.from(mapList);
    let meta = $appRoot.props.meta.getMeta();
    // 切换合并方案时重置模板固定条件
    meta[searchAreaId].items = meta[searchAreaId].items.filter((item, index) => {
        if (item.isdynamic !== true) {
            return true;
        }
        filterItemCodes.push(item.attrcode);
        return false;
    });
    let insertIndex = -1;
    if (objs.insertIndex) {
        insertIndex = objs.insertIndex;
    } else {
        meta[searchAreaId].items.forEach((item, index) => {
            insertIndex = insertIndex == -1 && item.isnextrow ? index : insertIndex;
        });
        insertIndex = insertIndex == -1 ? meta[searchAreaId].items.length : insertIndex;
    }
    meta[searchAreaId].items.splice(insertIndex, 0, ...metaAddList);
    // 在模板中渲染此次更新 才算完全渲染完成
    await $appRoot.props.meta.setMeta(meta);

    if (areaType == 'search') {
        // 高级查询渲染
        let searchSnap = _.cloneDeep($appRoot.props.search.getSearchSnap(searchAreaId));
        if (searchSnap.length == 1 && searchSnap[0].attrcode == 'root') {
            // 高级的高级查询
            searchSnap[0].children = searchSnap[0].children.filter((item) => {
                return filterItemCodes.indexOf(item.attrcode) == -1;
            });
            let searchInsertIndex = 0;
            if (objs.insertIndex) {
                searchInsertIndex = objs.insertIndex;
            } else {
                searchSnap[0].children.map((item, index) => {
                    searchInsertIndex = item.isfixedcondition ? index + 1 : searchInsertIndex;
                });
            }
            searchSnap[0].children.splice(searchInsertIndex, 0, ...snapAddList);
        } else {
            // 普通的高级查询
            searchSnap = searchSnap.filter((item) => {
                return filterItemCodes.indexOf(item.attrcode) == -1;
            });
            let searchInsertIndex = 0;
            if (objs.insertIndex) {
                searchInsertIndex = objs.insertIndex;
            } else {
                searchSnap.map((item, index) => {
                    searchInsertIndex = item.isfixedcondition ? index + 1 : searchInsertIndex;
                });
            }
            searchSnap.splice(searchInsertIndex, 0, ...snapAddList);
        }
        $appRoot.props.search.setSearchSnap(searchAreaId, searchSnap);
    }
    metaAddList.forEach((metaObj) => {
        let attrcode = metaObj.attrcode;
        if (attrcode == 'corp') { // 单位参照
            let para = {
                queryCondition: {
                    pk_rcs: objs.pk_repmanastru,
                    chooseMore: chooseMore,
                    pk_periodkey: pk_periodkey,
                    pk_hbscheme: objs.pk_hbscheme,
                    defaultIncludeChildren: defaultIncludeChildren
                }
            }
            if (areaType == 'search') {
                if (objs.userjson && JSON.parse(objs.userjson).keyMap["date"] && JSON.parse(objs.userjson).keyMap["date"].display) {
                    para.queryCondition.period = JSON.parse(objs.userjson).keyMap["date"].display;
                } else {
                    let dateVal = mapList.get("date");
                    if (dateVal && dateVal.display) {
                        para.queryCondition.period = dateVal.display;
                    }
                }
            } else if (areaType == 'form') {
                if (objs.userjson) {
                    para.queryCondition.period = JSON.parse(objs.userjson).keyMap["date"].display;
                } else {
                    let dateVal = mapList.get("date");
                    if (dateVal && dateVal.display) {
                        para.queryCondition.period = dateVal.display;
                    }
                }
            }
            if (objs.filterType) {
                para.queryCondition.filterType = objs.filterType;
            }
            $appRoot.props.renderItem(areaType, searchAreaId, attrcode, <$nccRefer.RcsMemberVersionTreeRef {...para} />);
        }
        if (metaObj.itemtype != 'datepicker' && (attrcode == 'date' || attrcode == 'date_begin' || attrcode == 'date_end')) { //会计期间参照
            let para = {
                queryCondition: {
                    pk_keygroup: objs.pk_keygroup || objs,
                    pk_accperiodscheme: objs.pk_accperiodscheme || ''
                }
            }
            $appRoot.props.renderItem(areaType, searchAreaId, attrcode, <$nccRefer.AccPeriodUFOERef {...para} />) // 会计期间
        }
        // 渲染完成赋默认值
        if (areaType == 'search') {
            if (objs.userjson) {
                $appRoot.props.search.setSearchValByField(searchAreaId, attrcode, JSON.parse(objs.userjson).keyMap[attrcode]);
            } else {
                $appRoot.props.search.setSearchValByField(searchAreaId, attrcode, mapList.get(attrcode));
            }
        } else if (areaType == 'form') {
            if (objs.userjson) {
                $appRoot.props.form.setFormItemsValue(searchAreaId, { [attrcode]: JSON.parse(objs.userjson).keyMap[attrcode] });
            } else {
                $appRoot.props.form.setFormItemsValue(searchAreaId, { [attrcode]: mapList.get(attrcode) });
            }
        }
    });

    return { list, data }
}

/*  zhy
* 公共方法
* pk_rcs: 体系pk
* chooseMore:参照单选/多选  
* area: 区域id,
* obj 如下：
* busidate: 已选会计期间的值,
* list: 会计期间的pk,
* company: 已选单位的值,
* pk_hbscheme: 合并方案pk,
* pk_svid: 体系版本pk,
* getListKeymap: 已选单位的数组字符串形式，
* status: 在list页面自动生成后 处理页面的单位参照 不必过滤直接赋值
 */
// 单位参照渲染方法
export async function reManastrusFun(pk_rcs, chooseMore, area, obj, areaType, filterType, defaultIncludeChildren = false) {
    // 获取参数
    let pk_periodkey = ''
    obj.list.map(item => {
        if (item.code == 'date') {
            pk_periodkey = item.pk_keyword
        }
    })
    // 渲染单位参照
    let para = {
        queryCondition: {
            pk_rcs: pk_rcs,
            chooseMore: chooseMore,
            pk_periodkey: pk_periodkey,
            pk_hbscheme: obj.pk_hbscheme,
            period: obj.busidate,
            // 是否默认勾选【包含下级】
            defaultIncludeChildren: defaultIncludeChildren
        }
    }
    if (filterType) {
        para.queryCondition.filterType = filterType
    }

    //如果meta中corp有queryCondition属性，则同时更新corp的queryCondition
    const meta = $appRoot.props.meta.getMeta();
    for(const item of (meta[area].items || [])){
        if(item.attrcode ===  'corp' && item.queryCondition){
            item.queryCondition = para.queryCondition;
            $appRoot.props.meta.setMeta(meta);
            break;
        }
    }

    $appRoot.props.renderItem(areaType, area, 'corp', <$nccRefer.RcsMemberVersionTreeRef {...para} />);
    let rtn = {};
    // 是否选择了单位 重置单位参照数据 status区别是否需要过滤筛选
    if (!obj.status || obj.status == null) {
        if (obj.company !== '') {
            let params = {
                pk_periodkey: pk_periodkey,
                pk_hbscheme: obj.pk_hbscheme,
                pk_svid: obj.pk_svid,
                period: obj.busidate,
                pk_orgs: obj.getListKeymap
            }
            if (obj.isSelectLeaf || obj.isSelectLeaf === false) {
                params.isSelectLeaf = obj.isSelectLeaf
            }
            let res = await $nccUtil.promiseAjax('/nccloud/ufoc/reportcombinestru/checkRcsVersionChange.do', params);
            const { data } = res
            if (data.ischange == true) {
                areaType == 'form' ? $appRoot.props.form.setFormItemsValue(area, { 'corp': data.pk_orgs }) : $appRoot.props.search.setSearchValByField(area, 'corp', data.pk_orgs);
                rtn.pk_org = data.pk_orgs ? data.pk_orgs.pk_org : '';
                rtn.pk_svid = data.pk_orgs ? data.pk_orgs.pk_svid : null;
            } else {
                //针对对账做特殊处理如果有问题请联系----永远 20220511
                if(data['dzDataQuery']){
                    areaType == 'form' ? $appRoot.props.form.setFormItemsValue(area, { 'corp': data.pk_orgs }) : $appRoot.props.search.setSearchValByField(area, 'corp', data.pk_orgs);
                }
                rtn.pk_org = obj.getListKeymap;
                rtn.pk_svid = obj.pk_svid;
            }
        }
    } else {
        rtn.pk_org = obj.getListKeymap;
        rtn.pk_svid = obj.pk_svid;
    }
    return rtn;
}

/*  zhy
* 公共方法
* area: 区域
* areaItem:某一个  
 */
// 清空合并方案参照 清空对应关键字组合和关联查询条件的内容置空
export function clearHbSchemeFuns(area, areaItem, areaType) {
    let meta = $appRoot.props.meta.getMeta();
    let filterItemCodes = [];
    // 切换合并方案时重置模板固定条件
    meta[area].items = meta[area].items.filter((item) => {
        if (item.isdynamic !== true) {
            return true;
        }
        filterItemCodes.push(item.attrcode);
        return false;
    })
    $appRoot.props.meta.setMeta(meta);
    if (areaType == 'form') {
        $appRoot.props.form.setFormItemsValue(area, { [areaItem]: {} })
    } else {
        // 高级查询清除关键字
        // let searchSnap = $appRoot.props.search.getSearchSnap(area);
        let searchSnap = _.cloneDeep($appRoot.props.search.getSearchSnap(area));
        if (searchSnap.length == 1 && searchSnap[0].attrcode == 'root') {
            // 高级的高级查询
            searchSnap[0].children = searchSnap[0].children.filter((item) => {
                return filterItemCodes.indexOf(item.attrcode) == -1;
            });
        } else {
            // 普通的高级查询
            searchSnap = searchSnap.filter((item) => {
                return filterItemCodes.indexOf(item.attrcode) == -1;
            });
        }
        $appRoot.props.search.setSearchSnap(area, searchSnap);

        //$appRoot.props.search.setDisabledByField(area, areaItem, true); //影响模板渲染  暂时注掉 后续影响其他问题再协调解决 sunadi
        $appRoot.props.search.setSearchValByField(area, areaItem, {});
    }
}

/** renyih
 * 公共方法 关键字自然期间根据类型跳转到当前时间期间的最后一天
 * @param {*} searchAreaId 区ID
 * @param {*} areaType 区域类型 search、form
 * @param {*} dateStr 日期字符串
 * @param {*} objs {keyWordRefInfo: 关键字渲染信息, pk_keygroup: 关键字组合pk}
 * @returns 处理后的日期字符串
 */
export async function getNaturalTimeTypeLastDate(searchAreaId, areaType, dateStr, objs = {}) {
    if (!dateStr || !objs.keyWordRefInfo || !objs.pk_keygroup) {
        return dateStr;
    }
    const dateKwInfo = objs.keyWordRefInfo.find(({ code }) => code === 'date');
    const periodCode = _.get(dateKwInfo, 'periodCode');
    if (
        dateKwInfo &&
        ['year', 'halfyear', 'quarter', 'month', 'tendays', 'week'].includes(
            periodCode
        )
    ) {
        let param = {
            pk_keygroup: objs.pk_keygroup,
            date: dateStr
        }
        let res = await $nccUtil.promiseAjax('/nccloud/ufoc/keyword/KeyWordTimeEndDate.do', param);
        if (res.success) {
            dateStr = res.data;
            if (areaType == 'search') {
                await $appRoot.props.search.setSearchValByField(searchAreaId, 'date', { value: dateStr, display: dateStr });
            } else {
                await $appRoot.props.form.setFormItemsValue(searchAreaId, { 'date': { value: dateStr, display: dateStr } });
            }
        }
    }
    return dateStr;
}

/*  zhy
* 公共方法 切换查询方案
* platCondition: 平台返回的储存好的查询方案条件值
* areaType:区域类型  
* searchAreaId:区域id
* getCaseConditions:参照所需参数
 */
export async function changeSearchCase(platCondition, areaType, searchAreaId, getCaseConditions) {
    let schemeVal = null
    let period_val = null;
    let keymap = new Map();

    if (!platCondition || !platCondition.conditionobj4web || !platCondition.conditionobj4web.public) {
        //这种情况的大部分场景是方案中没有任何值，只是条件
        let pk_hbschemeValue = null;
        let searchSnap = _.cloneDeep($appRoot.props.search.getSearchSnap(searchAreaId));
        if (searchSnap.length == 1 && searchSnap[0].attrcode == 'root') {
            //如果是高级查询
            searchSnap[0].children.forEach((item) => {
                if (item.attrcode == 'pk_hbscheme') {
                    pk_hbschemeValue = _.get(item, 'initialvalue.value');
                }
            });
        } else {
            if (searchSnap && !searchSnap.item) {
                searchSnap.forEach((item) => {
                    if (item.attrcode == 'pk_hbscheme') {
                        pk_hbschemeValue = _.get(item, 'initialvalue.value');
                    }
                });
            } else if (searchSnap && searchSnap.item) {
                searchSnap.item.forEach((item) => {
                    if (item.attrcode == 'pk_hbscheme') {
                        pk_hbschemeValue = _.get(item, 'initialvalue.value');
                    }
                });
            }
        }
        if (
            !pk_hbschemeValue ||
            pk_hbschemeValue == null ||
            pk_hbschemeValue == ''
        ) {
            $nccPlatform.toast({
                color: 'warning',
                content:
                    $appRoot.state.json[
                        'public_lang-000299'
                    ] /* 国际化处理：您有必输项未填写*/,
            });
            return;
        }
    }

    platCondition.conditionobj4web.public.conditions.forEach(item => {

        if (item.field == "pk_hbscheme") {
            schemeVal = item.value.firstvalue
        }
        if (item.field != "date" && !item.logic) {
            keymap.set(item.field, item.value.firstvalue)
        } else {
            keymap.set(item.field, item.display)
            period_val = item.display
        }

    })
    if (!schemeVal) {
        return;
    }

    // 切换方案查询到的单位，会计期间参照参数
    let querycondition = {
        pk_hbscheme: schemeVal,
        keymap: Object.fromEntries(keymap)
    }
    let querySchemeInfoGet_res = await $nccUtil.promiseAjax('/nccloud/ufoc/queryscheme/querySchemeInfoGet.do', querycondition, getCaseConditions.defaultIncludeChildren);
    let querySchemeInfoGet_data = querySchemeInfoGet_res.data

    let data = {
        keyWordRefInfo: querySchemeInfoGet_data.keyWordRefInfo,
    }
    let objs = {
        pk_hbscheme: querySchemeInfoGet_data.pk_hbscheme,
        pk_keygroup: querySchemeInfoGet_data.pk_keygroup,
        pk_repmanastru: querySchemeInfoGet_data.pk_repmanastru,
        pk_accperiodscheme: querySchemeInfoGet_data.pk_accperiodscheme,
        filterType: getCaseConditions.filterType,
        insertIndex: getCaseConditions.insertIndex,
    }
    let keyMap = {};
    platCondition.conditionobj4web.public.conditions.forEach(item => {
        querySchemeInfoGet_data.keyWordRefInfo.forEach(InfoGet => {
            if (InfoGet.code == item.field) {
                keyMap[InfoGet.code] = { value: item.value.firstvalue, display: item.display };
                if (InfoGet.code == 'date') {
                    keyMap[InfoGet.code] = { value: item.display, display: item.display };
                }
            }
        })
    });
    objs.userjson = JSON.stringify({ keyMap });
    await doKeywordGroup(searchAreaId, data, getCaseConditions.chooseMore, areaType, objs);
    let keyWordRefInfo_map = new Map()
    platCondition.conditionobj4web.public.conditions.forEach(item => {
        // 组装keyWordRefInfo_val
        querySchemeInfoGet_data.keyWordRefInfo.forEach(InfoGet => {
            if (InfoGet.code == item.field) {
                keyWordRefInfo_map.set(InfoGet.code, { value: item.value.firstvalue, display: item.display });
                if (InfoGet.code == 'date') {
                    keyWordRefInfo_map.set(InfoGet.code, { value: item.display, display: item.display });
                }
            }
        })
    })
    querySchemeInfoGet_data.keyWordRefInfo_val = Array.from(keyWordRefInfo_map)
    return querySchemeInfoGet_data
}
/*筛选区域落实标题
* meta:模板信息；
* areaId:区域id;
* name：参照标题 //慎用，方法内部同时渲染多个参照、下拉框等，但是方法只接收一个name参数作为标题，不合理。
* others: 参照参数
*/
export function confirmTitle(meta, areaId, name, para, vouchTypeList, disabled, unUse, isMultiSelectedEnabled) {
    let filterItems = meta[areaId].items // array
    filterItems.forEach(element => {
        element.renderStatus = 'customer';
        const { label } = element
        if (element.attrcode == 'pk_dxrela' || element.attrcode == 'pk_dxrelation') { // 抵销模板类型
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {/* {value.value != '' ? <span className={'ufoc_beforeClass'}>{name} | </span> : null} */}
                        {<span className={!unUse ? 'ufoc_beforeClass filter_use' : 'ufoc_beforeClass filter_unUse'}>{label} | </span>}
                        {/* <span className={'ufoc_beforeClass'}>{name} | </span> */}
                        <$nccRefer.DxRelationHeadGridRef
                            foolValue={value}
                            isMultiSelectedEnabled={isMultiSelectedEnabled}
                            noPlaceholder={true}
                            // className={value.value != '' ? 'ufoc_refer_class' : null}
                            disabled={disabled.pk_dxrela}
                            className={'ufoc_refer_class'}
                            onChange={(e) => {
                                if (e.length > 1) {
                                    let refpks = []; let refnames = []
                                    e.forEach(item => {
                                        refpks.push(item.refpk)
                                        refnames.push(item.refname)
                                    })
                                    onChange(data, { value: refpks.toString(), display: refnames.toString() })
                                } else {
                                    onChange(data, { value: e[0] ? e[0].refpk : e.refpk, display: e[0] ? e[0].refname : e.refname })
                                }

                            }}
                            {...para ? { ...para } : null} />
                    </div>
                )
            }
        }
        if (element.attrcode == 'pk_dxrelation.type' || element.attrcode == 'pk_dxrela.type') {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {/* {(value.value != '' && value.value != '0') ? <span className={'ufoc_beforeClass'}>模板类型 | </span> : null} */}
                        {<span className={!unUse ? 'ufoc_beforeClass filter_use' : 'ufoc_beforeClass filter_unUse'}>{label} | </span>}
                        <NCSelect
                            // placeholder={'请选择模板类型'}
                            // className={(value.value != '' && value.value != '0') != '' ? 'ufoc_select_class' : null}
                            className={'ufoc_select_class'}
                            disabled={disabled.pk_dxrela_type}
                            value={value.value || undefined}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            {vouchTypeList && (vouchTypeList.length > 0) ? vouchTypeList.map(option => <NCOption key={option.value} value={option.value}>{option.display}</NCOption>) : null}
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == "bingoType") {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {/* {(value.value != '' && value.value != '0') ? <span className={'ufoc_beforeClass'}>对账结果 | </span> : null} */}
                        {<span className={!unUse ? 'ufoc_beforeClass filter_use' : 'ufoc_beforeClass filter_unUse'}>{label} | </span>}
                        <NCSelect
                            // className={(value.value != '' && value.value != '0') ? 'ufoc_select_class' : null}
                            className={'ufoc_select_class'}
                            value={value.value || undefined}
                            disabled={disabled.bingoType}
                            //placeholder tinper好像只能识别value是undefined
                            // placeholder={'请选择对账结果'}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'0'} value={'0'}> </NCOption>
                            <NCOption key={'1'} value={'1'}>{$appRoot.state.json['public_lang-000295']}</NCOption>
                            <NCOption key={'2'} value={'2'}>{$appRoot.state.json['public_lang-000296']}</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == "ismeetable") {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {/* {(value.value != '' && value.value != '0') ? <span className={'ufoc_beforeClass'}>对符结果 | </span> : null} */}
                        {<span className={!unUse ? 'ufoc_beforeClass filter_use' : 'ufoc_beforeClass filter_unUse'}>{label} | </span>}
                        <NCSelect
                            // className={(value.value != '' && value.value != '0') ? 'ufoc_select_class' : null}
                            className={'ufoc_select_class'}
                            value={value.value || undefined}
                            // placeholder={'请选择对符结果'}
                            disabled={disabled.ismeetable}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'0'} value={'0'}> </NCOption>
                            <NCOption key={'1'} value={'1'}>{$appRoot.state.json['public_lang-000297']}</NCOption>
                            <NCOption key={'2'} value={'2'}>{$appRoot.state.json['public_lang-000298']}</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == 'commit_state') {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {/* {(value.value != '' && value.value != '0') ? <span className={'ufoc_beforeClass'}>对符结果 | </span> : null} */}
                        {<span className={'ufoc_beforeClass filter_use'}>{label} | </span>}
                        <NCSelect
                            // className={(value.value != '' && value.value != '0') ? 'ufoc_select_class' : null}
                            className={'ufoc_select_class'}
                            value={value.value || undefined}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'21'} value={'21'}>未上报</NCOption>
                            <NCOption key={'22'} value={'22'}>已退回</NCOption>
                            <NCOption key={'23'} value={'23'}>已上报</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == 'flag_hasten') {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {<span className={'ufoc_beforeClass filter_use'}>{label} | </span>}
                        <NCSelect
                            className={'ufoc_select_shot_class'}
                            value={value.value || undefined}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'Y'} value={'Y'}>是</NCOption>
                            <NCOption key={'N'} value={'N'}>否</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == 'flag_request') {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {<span className={'ufoc_beforeClass filter_use'}>{label} | </span>}
                        <NCSelect
                            className={'ufoc_select_class'}
                            value={value.value || undefined}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'Y'} value={'Y'}>是</NCOption>
                            <NCOption key={'N'} value={'N'}>否</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
        if (element.attrcode == 'flag_late') {
            element.render = (onChange, data, value) => {
                return (
                    <div className={'ufoc_refer_beforeClass'}>
                        {<span className={'ufoc_beforeClass filter_use'}>{label} | </span>}
                        <NCSelect
                            className={'ufoc_select_shot_class'}
                            value={value.value || undefined}
                            onSelect={(value, record) => {
                                onChange(data, { value: value, display: record ? record.children : undefined })
                            }}
                        >
                            <NCOption key={'Y'} value={'Y'}>是</NCOption>
                            <NCOption key={'N'} value={'N'}>否</NCOption>
                        </NCSelect>
                    </div>
                )
            }
        }
    });
}