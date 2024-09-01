import React, { Component } from "react";
import { base, toast, getLangCode } from "nc-lightapp-front";
import Utils from "@public/utils";
import './index.less';

const { langCheck } = Utils;
const { NCTooltip, NCIcon, NCFormControl, NCMultiLangText: MultiLangText } = base;
const LANG_MAP_DATA = {
  simpchn: '1',
  tradchn: '2',
  english: '3',
}
class StringEditCell extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
      multiList: props.enableLangMaps || [ // 下拉内容列表
      {
        index: '1',
        languageCode: 'a',
        languageType: 'ZH'
      },
      {
        index: '2',
        languageCode: 'b',
        languageType: 'ZF'
      },
      {
        index: '3',
        languageCode: 'c',
        languageType: 'EN'
      }
    ],
      langIndex: LANG_MAP_DATA[getLangCode()], // 重命名弹窗内 当前的语言index
      // langIndex: 1, // 重命名弹窗内 当前的语言index
       multiValue: this.props.value,
    };
    this.editWarp = React.createRef();
  }

  commitChange = () => {
    const curValue = this.state.multiValue[`dataViewMulti${this.state.langIndex}`].value;
    if (curValue.includes('||')) {
      toast({
        content: langCheck("reportMultiLang", "dataView-100301-000278"),
        color: "info",
      }); /* 国际化处理： 输入格式非法*/
      return;
    }
    if (curValue === "") {
      toast({
        content: langCheck("reportMultiLang", "dataView-100301-000277"),
        color: "info",
      }); /* 国际化处理： */
      return
    };
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.multiValue);
    }
  };

  edit = () => {
    this.setState({ editable: true });
  };

  handleKeydown = event => {
    if (event.keyCode == 13) {
      this.commitChange();
    }
  };

  handleChange = value => {
    const curValue = value[`dataViewMulti${this.state.langIndex}`].value;
    if (curValue === "") this.editWarp.className += " verify-cell";
    this.setState({ multiValue: value });
  };


  render() {
    const { value, editable, multiValue, multiList, langIndex } = this.state;
    const curValue = multiValue[`dataViewMulti${langIndex}`].value;
    return (
      <div className="data-view-editable-cell">
        {editable ? (
          <div ref={el => this.editWarp = el} className="editable-cell-input-wrapper">
            {/* <NCFormControl
              className={value ? "u-form-control" : "u-form-control error"}
              autoFocus
              defaultValue={this.props.value}
              value={value || ''}
              onKeyDown={this.handleKeydown}
              onChange={this.handleChange}
              onBlur={this.commitChange}
            /> */}
            <MultiLangText
              value={multiValue}
              languageMeta={multiList}
              attrcode='dataViewMulti'
              // id='dataViewMulti'
              LangIndex={langIndex}
              autoFocus
              // onSelect={(v) => { console.log(v) }}
              onChange={this.handleChange}
              onBlur={this.commitChange}
            />
            {value === "" ? (
              <NCTooltip
                inverse
                className="u-editable-table-tp"
                placement="bottom"
                overlay={
                  <div className="tp-content">
                    {"请输入" + this.props.colName}
                  </div>
                }
              >
                <NCIcon className="uf-exc-t require" />
              </NCTooltip>
            ) : null}
          </div>
        ) : (
          <div className="editable-cell-text-wrapper" onClick={this.edit} title={curValue} style={{ cursor: 'text' }}>
            {curValue || " "}
          </div>
        )}
      </div>
    );
  }
}
export default StringEditCell