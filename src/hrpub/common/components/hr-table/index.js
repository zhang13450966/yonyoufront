/*
 * @Descripttion: 
 * @version: 
 * @Author: hukai
 * @Date: 2019-12-02 10:45:54
 * @LastEditors: hukai
 * @LastEditTime: 2020-02-25 16:05:19
 */
import {Maybe} from '../../utils/utils'
let pageTimer = {
    table: null
}
/**
 * 自定义total
 * @param  {object} props
 * @param  {string} tableId
 * @param  {object} config
 * @param  {boolean} flag
 */
export const totalTable = (props, tableId, config, flag, totalData) => {
    if(pageTimer['table']){
        clearInterval(pageTimer['table'])
    }
    const {meta, editTable} = props
    const { createEditTable } = editTable
    if (!flag || !totalData) {
        return createEditTable(tableId, config)
    }
    
    let items = Maybe.of(meta.getMeta()[tableId]).getValue(['items'])
    if (!items) throw new Error('请输入正确的tableId')
    let indexScale = getIndexByKey(items)
    function resetTotal () {
        matchTotalTable(indexScale, totalData)
    }
    pageTimer['table'] = setInterval(()=>{matchTotalTable(indexScale, totalData)},50)
    return createEditTable(tableId, config)
}
/**
 * 根据后台返回的总数据与索引重新处理合计行数据
 * @param  {object} indexScale
 * @param  {object} data
 */
const matchTotalTable = (indexScale, data) => {
    let currentTd =  document.querySelector('.u-table-footer tbody') && document.querySelector('.u-table-footer tbody').querySelectorAll('td')
    if (currentTd) {
        for (let i in data) {
            let currentConfig = indexScale[i]
            // if(currentTd[currentConfig['index']].textContent !== Number(data[i]).toFixed(Number(currentConfig['scale']))){
                let total = document.createElement('span')
                total.style.marginRight = '13px'
                if(currentTd[currentConfig['index']]){
                    currentTd[currentConfig['index']].textContent = ''
                    currentTd[currentConfig['index']].style.textAlign = 'right'
                    currentTd[currentConfig['index']].appendChild(total)
                }
                total.textContent = Number(data[i]).toFixed(Number(currentConfig['scale']))
            // }
        }
        clearInterval(pageTimer['table'])
    }
}
/**
 * 根据键值获取键值index和scale
 * @param  {object} items
 */
const getIndexByKey = (items) => {
    let obj = {}
    let finalItems = []
    items.forEach((v)=>{
        if(v.visible){
            finalItems.push(v)
        }
    })
    finalItems.forEach((v,k)=> {
        obj[v.attrcode] = {index: k,scale: v.scale}
    })
    return obj
}