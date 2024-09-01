import { TYPE_INT } from "../constants";
import { getLangCode } from "nc-lightapp-front";
import Utils from "@public/utils";
const LANG_MAP_DATA = {
    simpchn: '1',
    tradchn: '2',
    english: '3',
}
const { langCheck } = Utils;

export function getCellName(record) {
    return (
        (record &&
            record.anaRepField &&
            record.anaRepField.m_field &&
            record.anaRepField.m_field.m_caption) ||
        (record && record.name) ||
        ""
    );
}

export function getCellDisName(record) {
    return (
        (record &&
            record.anaRepField &&
            record.anaRepField.showField &&
            record.anaRepField.showField.m_caption) ||
        ""
    );
}

export function getAreaTableCellName(record) {
    return record.m_mainField_name ? record.m_mainField_name : record.name;
}

export function listAssemble(list = [], excludeList = []) {
    let temp = {};

    if (excludeList.length > 0) {
        excludeList.map((item) => {
            temp[item.m_field.expression] = item;
        });
    }
    return list
        .map((item) => {
            if (Array.isArray(item) && item.length > 0) {
                // 分组列表是 二维数组
                let mFld = item[0].m_field || {};
                return {
                    ...item[0],
                    anaRepField: item[0],
                    id: mFld && mFld.expression,
                    key: mFld && mFld.expression,
                    name: mFld.m_caption,
                    m_isSum: item[0].m_isSum,
                    showField:
                        (item[0].m_field && item[0].m_field.showField) || {},
                };
            }
            let mFld = item.m_field;
            if (mFld) {
                item.m_field.showField = item.showField || {};
                if (temp[mFld.expression]) return;
                return {
                    anaRepField: item,
                    id: mFld.expression,
                    key: mFld.expression,
                    name: mFld.m_caption,
                    m_isSum: item.m_isSum,
                    showField: mFld.showField || {},
                };
            }

            return item;
        })
        .filter((item) => !!item);
}

export function getCalculateOptions(currentFldType) {
    return [
        {
            name: langCheck("reportMultiLang", "100301-000163"), // 求和
            key: "TYPE_SUM",
            value: 0,
            disabled: !TYPE_INT.includes(currentFldType),
        },
        {
            name: langCheck("reportMultiLang", "100301-000164"), // 计数
            key: "TYPE_COUNT",
            value: 1,
        },
        {
            name: langCheck("reportMultiLang", "100301-000165"), // 平均
            key: "TYPE_AVAGE",
            value: 2,
            disabled: !TYPE_INT.includes(currentFldType),
        },
        {
            name: langCheck("reportMultiLang", "100301-000166"), // 最大
            key: "TYPE_MAX",
            value: 3,
        },
        {
            name: langCheck("reportMultiLang", "100301-000167"), // 最小
            key: "TYPE_MIN",
            value: 4,
        },
        {
            name: langCheck("reportMultiLang", "100301-000168"), // 唯一计数
            key: "TYPE_COUNT_DISTINCT",
            value: 5,
        },
    ];
}

export function checkSum(listKey) {
    return ["groupFldNames", "rowFldNames", "columnFldNames"].includes(listKey);
}

export function setShowField(listItem, inputItem) {
    let m_field = listItem.anaRepField.m_field;
    let showField = inputItem.anaRepField.m_field;

    m_field.showField = showField;
}


/**
 *  获取数据视图列标题数据
 */

 export function getTitlesValue (record) {

    let m_titles_values = {
      dataViewMulti1: {
          value: ''
      },
      dataViewMulti2: {
          value: ''
      },
      dataViewMulti3: {
          value: ''
      },
    }
  
    const titleKeyArr = Object.keys(m_titles_values);
    const result = {};
    titleKeyArr.forEach((key, index) => {

      if (index === 0) {
        const nameInsteadTitle = Number(LANG_MAP_DATA[getLangCode()]) === (index + 1) ? (record.name || record.m_field && record.m_field.m_multiLangText.text) : ''; //当前语种下用替代名字 别的语种为空
        result['dataViewMulti1'] = {
            value: (Array.isArray(record.anaRepField.m_titles) &&
            record.anaRepField.m_titles.join("|")) ||
            nameInsteadTitle || ''
        }
      } else {
        const nameInsteadTitle = Number(LANG_MAP_DATA[getLangCode()]) === (index + 1) ? ( record.name || record.m_field && record.m_field.m_multiLangText[`text${index + 1}`]) : ''; //当前语种下用替代名字 别的语种为空
        result[`dataViewMulti${index + 1}`] = {
            value: (Array.isArray(record.anaRepField[`m_titles${index + 1}`]) &&
            record.anaRepField[`m_titles${index + 1}`].join("|")) ||
            nameInsteadTitle || ''
        }
      }
    })
    return result;
  }