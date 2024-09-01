const PID = 'model';
import { toast } from "nc-lightapp-front";
import Utils from "@public/utils";
const { langCheck } = Utils;
/*
* @desc 判断是不是从0开始的连续数组
* */
function isSerialNumberStartWithZero(ids, list) {
  const newIds = ids.map(item => item.id);
  let index = -1;

  for (let i = 0; i < list.length; i++) {
    let id = list[i]['id'];

    if (newIds.includes(id)) {
      //如果不是重0开始连续的选择的就返回false 上移可用
      if (index + 1 !== i) {
        return false
      }

      index += 1
    }
  }

  return true
}


/*
* @desc 判断是不是从最后开始的连续数组
* */
function isSerialNumberStartWithLast(ids, list) {
  let index = list.length - 1;
  const newIds = ids.map(item => item.id);

  for (let i = index; i > -1; i--) {
    let id = list[i]['id'];

    if (newIds.includes(id)) {
      if (index !== i) {
        return false
      }

      --index;
    }
  }

  return true
}

export function judgeMoveToPBtnDisable(deletePool, list) {
  let values = Object.values(deletePool);
  const listHasData = list && Array.isArray(list) && list.length > 0;
  if (values.length === 0) return true;

  //如果选择了一项且是第一项上移btn不可用
  if (values.length === 1 && listHasData && values[0].id === list[0].id) return true;

  let result = isSerialNumberStartWithZero(values, list);

  return result;
}

export function judgeMoveToBottomBtnDisable(deletePool, list) {
  let values = Object.values(deletePool);
  const listHasData = list && Array.isArray(list) && list.length > 0;

  if (values.length === 0) return true;

  //如果选择了一项且是最后一项下移btn不可用
  if (values.length === 1 && listHasData && values[0].id === list[list.length - 1].id) return true;

  let result = isSerialNumberStartWithLast(values, list);

  return result;
}

function judgeSeriesNumber(list, checkedFieldsPool) {
  let startIndex;
  let isSeries;
  let sequence = [];

  list.forEach((item, index) => {
    if (checkedFieldsPool[item.id]) {
      sequence[index] = item
    }
  });

  for (var i = 0; i < sequence.length; i++) {
    if (!!sequence[i]) {
      if (startIndex === undefined) {
        startIndex = i;
      } else {
        startIndex += 1;
        if (startIndex === i) {
          isSeries = true
        } else {
          isSeries = false;
          break;
        }
      }
    }
  }
  return isSeries
}



//移动行号
export function changeFloor(list, currentFloor, targetFloor) {
  var temp = list[targetFloor];

  list[targetFloor] = list[currentFloor];
  list[currentFloor] = temp
}


export function goDownstairs(list, checkedFieldsPool, sequence) {
  let reversedList = goUpstairs(list.reverse(), checkedFieldsPool);
  return reversedList.reverse();
}

export function goUpstairs(list, checkedFieldsPool, sequence) {
  let tempList = [...list];
  let isSeriesNumber = judgeSeriesNumber(list, checkedFieldsPool);
  if (Object.keys(checkedFieldsPool).length === 1 || isSeriesNumber) {
    tempList.forEach((item, index) => {
      if (checkedFieldsPool[item.id] && index !== 0) {
        let targetFloorUnChecked = checkedFieldsPool[tempList[index - 1].id] === undefined;
        targetFloorUnChecked && changeFloor(tempList, index, index - 1)
      }
    });
  } else {
    let insertIndex = undefined;
    let pool = [];
    for (var i = 0; i < tempList.length; i++) {
      if (checkedFieldsPool[tempList[i].id]) {
        if (insertIndex === undefined) {
          insertIndex = i - 1;
          if (insertIndex < 0) {
            insertIndex = 0;
            continue;
          }
          let targetFloorUnChecked = checkedFieldsPool[tempList[insertIndex].id] === undefined;
          targetFloorUnChecked && changeFloor(tempList, i, insertIndex)
        } else {
          pool.push(tempList[i]);
          tempList.splice(i, 1);
          --i;
        }
      }
    }
    tempList.splice(insertIndex + 1, 0, ...pool)
  }

  return tempList
}


export function buildModelItem(item, obj = {}) {
  const meta = {
    AnaRepFieldInfo: {
      name: item.name,
      authorityFld: item.authorityFld,
      fieldClazz: item.field && item.field.fieldClazz,
      anaRepField: {
        m_fieldType: 0,
        m_fieldIsPicture: 0,
        m_field: item.field,
        m_dsPK: item.pk_def, //语义模型的pk_def
        dimInfo: {
          fldId: item.field && item.field.m_fldname,
          dataType: item.field && item.field.dataType,
          isFix: false,
          isFilter: false,
          isToZero: false,
          m_valueAttr: {},
          orderType: 0,
          extended: false,
        },
        isFilter: false,
      },
      ...obj,
    },
  };
  return meta;
}


export function treeToList(data, list = []) {
  // data 树结构数据
  if (Array.isArray(data)) {
    data.forEach((e) => {
      // 获取除 children 外的其他属性，并且放进list数组
      let { children, ...others } = e;
      list.push({ ...others });
      if (Array.isArray(e.children)) {
        treeToList(e.children, list);
      }
    });
    // 返回list集合
    return list;
  } else {
    return false;
  }
}

export function filterTree(value, treeData) {
  const list = treeToList(treeData);

  // 过滤出带有关键字的节点
  const filterNodes = list.filter((v, i) => {
    let name;
    const beforeName = v.beforeName ? v.beforeName : '';
    const afterName = v.afterName ? v.afterName : '';
    const refn = v.refname ? v.refname : '';
    name = refn;

    // 如果beforeName afterName 是字符串参与搜索

    if (typeof beforeName === 'string') {
      name = beforeName + name;
    }

    if (typeof afterName === 'string') {
      name = name + afterName;
    }

    return name.includes(value);
  });

  //........ 筛选出所有相关节点
  const nodesMap = new Map();

  const findAllParents = (child) => {
    // 递归优化处理，已经走过的路径不再做递归操作
    if (nodesMap.has(child.refpk)) return;
    // 存入路径相关的树节点
    nodesMap.set(child.refpk, child);

    list.map((node, i) => {
      // 如果当前节点child 有父节点  把当且节点父节点放进nodesMap集合
      if (child.pid === node.refpk) {
        findAllParents(node);
      } else {
        // 出口
        return true;
      }
    });
  };

  // 递归函数入口
  filterNodes.map((node) => {
    // 每一个含有搜索关键字的节点都会成为递归函数的入口
    findAllParents(node);
  });

  // Map结构转换为map结构
  const finalLists = [];

  for (let node of nodesMap.values()) finalLists.push(node);

  return createTreeData(finalLists);
}

/*
 *   生成树 需要的数据结构
 *   @ data: 数组
 * */
export function createTreeData(data) {
  if (!Array.isArray(data)) {
    console.warn('createTreeData方法，参数应该为数组');
    return false;
  }

  // 创建Map集合
  let group = new Map();
  data.forEach((e) => {
    // 如果没有pid的节点标记为 __root__ 祖节点
    e.pid = e.pid || PID;
    // 把相同pid的节点放在一起 结构：以pid为键 以相同pid节点组成的数组为值
    group.get(e.pid) ? group.get(e.pid).push(e) : group.set(e.pid, [e]);
  });

  function makeDOM(pid) {
    // 如果map 里面 pid 有值，就给每个节点追加children属性
    if (group.get(pid)) {
      // 返回的是map生成的数组,数组成员是e
      return group.get(pid).map((e) => {
        e.children = makeDOM(e.refpk);
        return e;
      });
    } else {
      return null;
    }
  }

  let res = [];
  group.forEach(function (value, key, group) { // 多级也需要拼出来
    res = [...res, ...makeDOM(key)]
  })
  // let newData = makeDOM(PID);
  
  return res;
}

export function findPKs(treeNodes) {
  let list = [];
  function loop(data) {
    data.forEach((item) => {
      if (item.children) {
        list.push(item.refpk);
        loop(item.children);
      }
    });
  }
  loop(treeNodes);
  return list;
}

/**
 *
 * @param extArea 扩展区坐标
 * @param cellInfo 当前单元格坐标
 * @return {boolean}
 */

export function extIncludesSelectedCell(extArea, cellInfo) {
  let { startCell, endCell } = extArea;
  return (cellInfo.row > startCell.row || startCell.row === cellInfo.row)
    && (cellInfo.col > startCell.col || startCell.col === cellInfo.col)
    && (endCell.row > cellInfo.row || endCell.row === cellInfo.row)
    && (endCell.col > cellInfo.col || endCell.col === cellInfo.col)
}


/**
 *
 * @param record 待处理的数据
 * 
 * 
 */

export function formatResDataByCacheData (record, isView) { // 为了显示扩展区对行列表和交叉表做了合并 这里拆分传给后端
  const data = JSON.parse(JSON.stringify(record))
  
  let validateFiledCanBeSaved = true; // 如果是false 保存提示 字段已被树形设置使用，不能设置为分组字段 --- 刘亚让加的
  // let repeatAreaName = '';
  let repeatAreaCode = '';
  let repeatField = '';

  data.areacontentsets = data && data.areacontentsets.map(item => {
    const fieldNames = Array.isArray(item.areaContentExtInfo && item.areaContentExtInfo.fieldNames) ? item.areaContentExtInfo.fieldNames : [];
    const filedRepeatArr = item.areaContentExtInfo ? [item.areaContentExtInfo.innercode, item.areaContentExtInfo.parentcode, ...fieldNames] : [];
    const validateCondition = item.areaContentExtInfo && item.areaContentExtInfo.isEnable === true && item.areaContentExtInfo.levelAreaType === 'levelTree';
    /* 
      * 把之前处理过的数据结构组织成后段需要的
    */
    const contentsKeyArr = ['detailFldNames', 'areaFieldSet', 'groupFldNames', 'measureSet', 'rowFldNames', 'columnFldNames'];
    contentsKeyArr.map(key => {
      if (item[key] && Array.isArray(item[key]) && item[key].length > 0) {
        item[key].forEach(resItem => {

          const defaultMultiTextFromTree = resItem.m_field && resItem.m_field.m_multiLangText; // 左侧树上默认的显示标题名称

          resItem.anaRepFields = resItem.anaRepField && resItem.anaRepField.anaRepFields || resItem.anaRepFields;
          resItem.m_countType = resItem.anaRepField && resItem.anaRepField.m_countType !== undefined ? resItem.anaRepField.m_countType : resItem.m_countType;
          resItem.m_field = resItem.anaRepField && resItem.anaRepField.m_field || resItem.m_field;
          resItem.showField = resItem.anaRepField && resItem.anaRepField.showField || resItem.showField;
          resItem.m_titles = resItem.anaRepField && resItem.anaRepField.m_titles ||
            (resItem.m_titles && resItem.m_titles[0] !== '' && resItem.m_titles) || 
            (resItem.name && resItem.name.split('|')) || 
            (resItem.m_field && resItem.m_field.m_caption && resItem.m_field.m_caption.split('|')) || 
            (defaultMultiTextFromTree && resItem.m_field.m_multiLangText.text && resItem.m_field.m_multiLangText.text.split('|'));
          resItem.m_titles2 = resItem.anaRepField && resItem.anaRepField.m_titles2 ||
            (resItem.m_titles2 && resItem.m_titles2[0] !== '' && resItem.m_titles2) || 
            (resItem.name2 && resItem.name2.split('|')) || 
            (resItem.m_field && resItem.m_field.m_caption && resItem.m_field.m_caption.split('|')) || 
            (defaultMultiTextFromTree && resItem.m_field.m_multiLangText.text2 && resItem.m_field.m_multiLangText.text2.split('|'));
          resItem.m_titles3 = resItem.anaRepField && resItem.anaRepField.m_titles3 || 
            (resItem.m_titles3 && resItem.m_titles3[0] !== '' && resItem.m_titles3) || 
            (resItem.name3 && resItem.name3.split('|')) || 
            (resItem.m_field && resItem.m_field.m_caption && resItem.m_field.m_caption.split('|')) || 
            (defaultMultiTextFromTree && resItem.m_field.m_multiLangText.text3 && resItem.m_field.m_multiLangText.text3.split('|'));
          resItem.hideFieldSet = resItem.anaRepField && resItem.anaRepField.hideFieldSet || resItem.hideFieldSet;
          resItem.isShow = resItem.anaRepField && resItem.anaRepField.isShow !== undefined ? resItem.anaRepField.isShow : resItem.isShow;
          resItem.isCalcShow = resItem.anaRepField && resItem.anaRepField.isCalcShow !== undefined ? resItem.anaRepField.isCalcShow : resItem.isCalcShow;
        });
      }
      return key;
    });

    // groupFldNames 是二纬数组 下面根据几种不同的格式处理成接口需要的格式
    let newGroupFldNames = [];
    const firstGroupCondition = item.groupFldNames && item.groupFldNames.length > 0 && Array.isArray(item.groupFldNames[0]) && item.groupFldNames[0].length > 1;
    const secondGroupCondition = item.groupFldNames && item.groupFldNames.length > 0 && !Array.isArray(item.groupFldNames[0]);
    if (firstGroupCondition) {
      newGroupFldNames = item.groupFldNames[0].map(groupItem => {
        return [groupItem];
      });
    } else if (secondGroupCondition) {
      newGroupFldNames = item.groupFldNames.map(groupItem => {
        return [groupItem]
      });
    } else {
      newGroupFldNames = item.groupFldNames || [];
    }

    if (newGroupFldNames.length > 0 && validateCondition) {
      newGroupFldNames.forEach(groupItem => {
        filedRepeatArr.forEach(filedItem => {
          if (groupItem[0].id === filedItem) {
            // repeatAreaName = groupItem[0].name;
            repeatField = item.areaName;
            repeatAreaCode = groupItem[0].id;
            validateFiledCanBeSaved = false;
          }
        })
      })
    }

    if (item.areaContentExtInfo && item.areaContentExtInfo.levelAreaType === 'groupFold') { // 分组折叠需要此逻辑
      item.showFold = true;
    } else {
      item.showFold = false;
    }
    
    return {
      ...item,
      groupFldNames: newGroupFldNames,
    }
  });
  const resAreacontentsets = data.areacontentsets.filter(areaContent => areaContent.areaType === 'rowCol');
  const resCrossareacontentsets = data.areacontentsets.filter(crossContent => crossContent.areaType === 'cross');

  const result = {
    ...data,
    areacontentsets: resAreacontentsets,
    crossareacontentsets: resCrossareacontentsets,
    isviewbypreset: (isView && data.code === 'default') || undefined, // 预览的时候如果是预置视图 需要给后端加个字段
  }

  if (validateFiledCanBeSaved === false) {
    toast({
      content: `${repeatAreaCode} ${langCheck(
        "reportMultiLang",
        "dataView-100301-000281"
      )}`,
      color: "success",
    }); // 保存成功
    return false;
  }

  return result;
}


/**
 * 根据条件删除树的某些节点
 */

export function deleteTreeFieldByAuthorityFld (data) {
  let newData = data.filter(item => typeof item.authorityFld === 'boolean');
  newData.forEach(item => item.children && (item.children = deleteTreeFieldByAuthorityFld(item.children)))
  return newData
}