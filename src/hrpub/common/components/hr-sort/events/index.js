/**
 * Created by wanghongxiang on 2019/2/21.
 */

export const sortBtns = (type, state) => {
    let data = state.sortTableData || [];
    let temp = JSON.parse(JSON.stringify(data));
    let before = data.slice(0, state.index);
    let after = data.slice(state.index + 1, data.length);
    let curData = data[state.index];
    let len = data.length;
    let selectedRow = state.selectedRow
    switch (type) {
        case 'add':
            let currentMeta = state.meta || state.metaSource[0]['key']
            if (!currentMeta) {
                return;
            }
            for (let i = 0; i < len; i++) {
                if (data[i].key === currentMeta) {
                    return;
                }
            }
            //fnayi
            let sortFlag = typeof (state.sortType) === 'object' ? true : state.sortType
            // let sortname = sortFlag === true? this.props.json['i6013-000237']: this.props.json['i6013-000238']/* 国际化处理： 升序,降序*/
            let sortname = sortFlag === true ? state.json['hrpub-000081'] : state.json['hrpub-000082']/* 国际化处理： 升序,降序*/
            let a = {
                key: currentMeta,
                name: transName(currentMeta, state.metaSource),
                sort: sortname
            }
            data.push(a)
            let current = formatSelectData(state.sortTableData, {
                'key': 'field_code', 'name': 'field_name', 'sort': 'ascend_flag'
            }, false, state.json)
            selectedRow = new Array(data.length)
            state.index = data.length - 1;
            for (let i = 0, j = selectedRow.length; i < j; i++) {
                if (i === state.index) {
                    selectedRow[i] = true
                } else {
                    selectedRow[i] = false
                }
            }
            return Object.assign({}, state, {
                sortTableData: data,
                sortList: current,
                selectedRow: selectedRow,
                index: data.length - 1
            });
        case 'del':
            data.splice(state.index, 1);
            selectedRow = new Array(data.length)
            state.index = state.index - 1;
            for (let i = 0, j = selectedRow.length; i < j; i++) {
                if (i === state.index) {
                    selectedRow[i] = true
                } else {
                    selectedRow[i] = false
                }
            }
            return Object.assign({},
                state,
                {
                    sortTableData: data,
                    selectedRow: state.selectedRow.splice(state.index, 1),
                    index: data.length - 1
                });
        case 'up':
            if (state.index === -1 || state.index === undefined) {
                return;
            }
            if (data.length > 0 && state.index != 0) {
                selectedRow = new Array(data.length)
                state.index = state.index - 1
                for (let i = 0, j = selectedRow.length; i < j; i++) {
                    if (i === state.index) {
                        selectedRow[i] = true
                    } else {
                        selectedRow[i] = false
                    }
                }
                let lastBeforeItem = before[before.length - 1];
                before.splice(before.length - 1, 1);
                temp = [...before, curData, lastBeforeItem, ...after];
            }
            return Object.assign({}, state, {
                sortTableData: temp,
                index: state.index,
                selectedRow: selectedRow
            });
        case 'down':
            if (state.index === -1 || state.index === undefined) {
                return;
            }
            if (data.length > 0 && state.index != data.length - 1) {
                selectedRow = new Array(data.length)
                state.index = state.index + 1
                for (let i = 0, j = selectedRow.length; i < j; i++) {
                    if (i === state.index) {
                        selectedRow[i] = true
                    } else {
                        selectedRow[i] = false
                    }
                }
                let firstAfterItem = after[0];
                after.splice(0, 1);
                temp = [...before, firstAfterItem, curData, ...after];
            }
            return Object.assign({}, state, {
                sortTableData: temp,
                index: state.index,
                selectedRow: selectedRow
            });
        case 'clear':
            return Object.assign({}, state, {
                sortTableData: [],
                sortconList: []
            });
        default:
            return state;
    }
}
//transName 根据key获得name值
export const transName = (key, origin) => {
    let data = origin;
    let value;
    data.map(item => {
        if (item.key === key) {
            value = item.value;
        }
    })
    return value;
}
/**
 * 处理对象对应关系
 * @param origin
 * @param obj
 */
export const formatSelectData = (origin, obj = {field_code: 'key', field_name: 'value'}, flag = true, json) => {
    let result = []
    if (!Array.isArray(origin)) {
        return
    }
    for (let i = 0, j = origin.length; i < j; i++) {
        let tem = {}
        for (let m in obj) {
            if (!flag) {
                if (m === 'sort') {
                    // tem[obj[m]] = origin[i][m] == this.props.json['i6013-000237'] ? true : false/* 国际化处理： 升序*/
                    tem[obj[m]] = origin[i][m] == json['hrpub-000081'] ? true : false/* 国际化处理： 升序*/
                } else {
                    tem[obj[m]] = origin[i][m]
                }
            } else {
                if (obj[m] === 'sort') {
                    // tem[obj[m]] = origin[i][m] == true ? this.props.json['i6013-000237'] : this.props.json['i6013-000238']/* 国际化处理： 升序,降序*/
                    tem[obj[m]] = origin[i][m] == true ? json['hrpub-000081'] || '' : json['hrpub-000082'] || '' /* 国际化处理： 升序,降序*/
                } else {
                    tem[obj[m]] = origin[i][m]
                }
            }

        }
        result.push(tem)
    }
    return result
}
export const metaChange = (meta) => {
    return {meta}
}
export const sortTypeChange = (meta) => {
    return {sortType: meta}
}
export const rowClick = (record, index, indent, state) => {
    let selectedRow = new Array(state.sortTableData.length);
    selectedRow[index] = true;
    state.index = index;
    return {selectedRow}
}
export const rowDoubleClick = (record, index, indent, state, json) => {
    state.sortTableData[index].sort = state.sortTableData[index].sort === json['hrpub-000081'] ? json['hrpub-000082'] : json['hrpub-000081'];
    let selectedRow = new Array(state.sortTableData.length);
    selectedRow[index] = true;
    state.index = index;
    return {selectedRow}
}
export const confirmBtn = ({sortTableData, json}) => {
    let current = formatSelectData(sortTableData, {
        'key': 'field_code', 'name': 'field_name', 'sort': 'ascend_flag'
    }, false, json)
    return current
}
export const saveBtn = ({sortTableData, json}) => {
    let current = formatSelectData(sortTableData, {
        'key': 'field_code', 'name': 'field_name', 'sort': 'ascend_flag'
    }, false, json)
    return current
}