import React from 'react';
import './index.less';
import ReactDom from 'react-dom';
import { createPage } from 'nc-lightapp-front';

import { getBusinessInfo, ajax } from 'nc-lightapp-front';
import { formatDate, getAppPageConfig, snCreateUIDom } from '../../../common/utils/utils';

let businessInfo = window.businessInfo || {};
let appInfo = getAppPageConfig();
let moduleList = [];
let style = document.createElement('style');

style.media = 'print';
style.innerHTML = `
    @page {
        size: auto; 
        margin: 0mm;
    }
`;
document.head.appendChild(style);

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.splitTemplate = this.splitTemplate.bind(this);
    }

    splitTemplate(template) {
        let items = template[window.printOption.moduleId].items;

        let count = 0;
        let result = [];
        let oneRow = [];
        let modules = [];
        let maxColLen = window.printOption.maxColLen || 8;
        items.map((col, index) => {
            if (col.visible) {
                oneRow.push(col);
                if (col.children) {
                    if (count + col.children.length < maxColLen) {
                        count = count + col.children.length;
                    }
                    else {
                        count = col.children.length;
                        oneRow.pop(col);
                        result.push(oneRow);
                        oneRow = [col];
                    }
                }
                else {
                    if (col.attrcode === 'opr') {
                        oneRow.pop(col);
                    } else {
                        count++;
                    }
                }

                if (count >= maxColLen) {
                    count = 0;
                    result.push(oneRow);
                    oneRow = [];
                }

                if (items[index + 1] === undefined && count !== 0) {
                    result.push(oneRow);
                }
            }
        });

        result.forEach((row, index) => {
            let moduleName = `${window.printOption.moduleId}_${index}`;
            template[moduleName] = {
                ...template[window.printOption.moduleId],
                code: moduleName,
                items: row
            }

            modules.push(moduleName);
            moduleList = modules;
        });

        return template;
    }

    componentDidMount() {
        const { meta, editTable, form } = this.props;

        meta.setMeta(this.splitTemplate(window.printOption.template), () => {
            if (window.printOption.printType === 'table') {
                moduleList.forEach((moduleId) => {
                    editTable.setTableData(moduleId, window.printOption.data);
                });
            }
            else if (window.printOption.printType === 'form') {
                moduleList.forEach((moduleId) => {
                    form.setAllFormValue({
                        [moduleId]: window.printOption.data
                    });
                });
            }

        });
    }

    render() {
        const { editTable, form } = this.props;
        let len = moduleList.length;
        return (
            <div>
                <div className="print-title">{window.printOption.title}</div>
                <div className="print-content-wrap">
                    <If condition={window.printOption.printType === 'table'}>
                        {moduleList.map((moduleId, index) => {
                            return (
                                <table className={`module-wrapper ${index === len - 1 ? 'print-last-table' : ''}`}>
                                    <tr>
                                        <td>
                                            {editTable.createEditTable(moduleId, {
                                                height: window.printOption.height ? window.printOption.height : 450,
                                            })}
                                        </td>
                                    </tr>
                                </table>
                            );
                        })}
                    </If>
                    <If condition={window.printOption.printType === 'form'}>
                        {moduleList.map((moduleId, index) => {
                            return (
                                <table className={`module-wrapper ${index === len - 1 ? 'print-last-table' : ''}`}>
                                    <tr>
                                        <td>
                                            {form.createForm(moduleId)}
                                        </td>
                                    </tr>
                                </table>
                            );
                        })}
                    </If>
                    <div className="print-footer">
                        <div class="print-maker">
                            {window.printOption.maker}: {businessInfo.userName || ''}
                        </div>
                        <div class="print-date">
                            {window.printOption.date}: {formatDate(new Date())}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

let Wrapper = createPage({})(HomePage);

ReactDom.render(<Wrapper />, document.getElementById('app'));