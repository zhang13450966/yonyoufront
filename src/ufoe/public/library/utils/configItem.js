/**
 * @desc 搜索字段动态配置(itemConfig覆盖相应字段)
 * @example
 * item = $namespace.configItem.getSearchItem(itemConfig, 'refer');
 *
 let itemConfig = {
    attrcode: it.code,
    label: it.name,
    refcode: it.refPath,
    ...otherFields
  };
 * */
import {_datepickerTypeTplSearch, _inputTypeTplSearch, _referTypeTplSearch} from './configItem/searchType';
import {_inputTypeTplForm, _datepickerTypeTplForm, _referTypeTplForm} from './configItem/formType';

let searchCfg = {_referTypeTplSearch, _inputTypeTplSearch, _datepickerTypeTplSearch}
let formCfg = {_inputTypeTplForm, _datepickerTypeTplForm, _referTypeTplForm}

export class _configItem {
    // itemtype 提示类型
    static getSearchItem (itemConfig = {}, itemtype = 'refer') {
        return {...searchCfg[`_${itemtype}TypeTplSearch`], ...itemConfig, itemtype}
    }

    static getFormItem(itemConfig = {}, itemtype = 'input') {
        return {...formCfg[`_${itemtype}TypeTplForm`], ...itemConfig}
    }
}