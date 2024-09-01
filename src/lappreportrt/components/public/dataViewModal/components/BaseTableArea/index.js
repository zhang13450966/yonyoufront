import React, { Component, Fragment } from 'react';
import ListBaseTable from './ListBaseTable';
import CrossListTable from './CrossListTable';
import Utils from "@public/utils";
const {
    getGlobalStorage,
} = Utils;
class BaseTableArea extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let { changeList, handleDrop, changeValue, curViewData, curSelectExpandIndex } = this.props;
        const nccTableConfig = JSON.parse(getGlobalStorage("localStorage", "nccTable") || '{}');
        nccTableConfig['enableLangMaps'] = curViewData && curViewData.enableLangMaps; 
        const isListBaseTableFlag = Array.isArray(curViewData.areacontentsets) && curViewData.areacontentsets[curSelectExpandIndex] && curViewData.areacontentsets[curSelectExpandIndex].groupFldNames
        return (
            <Fragment>
                {
                    isListBaseTableFlag
                        ? <ListBaseTable
                            groupFldNames={this.props.groupFldNames}
                            detailFldNames={this.props.detailFldNames}
                            areaFieldSet={this.props.areaFieldSet}
                            changeList={changeList}
                            handleDrop={handleDrop}
                            changeValue={changeValue}
                            showType={this.props.showType}
                            isSyncData={this.props.isSyncData}
                            showfold={this.props.showfold}
                            isShowCount={this.props.isShowCount}
                            sortRowCb={this.props.sortRowCb}
                            checkDeleteFieldCb={this.props.checkDeleteFieldCb}
                            nccTableConfig={nccTableConfig}
                        />
                        : <CrossListTable
                            columnFldNames={this.props.columnFldNames}
                            rowFldNames={this.props.rowFldNames}
                            measureSet={this.props.measureSet}
                            measureDirection={this.props.measureDirection}
                            rowSubType={this.props.rowSubType}
                            columnSubType={this.props.columnSubType}
                            changeList={changeList}
                            changeValue={changeValue}
                            handleDrop={handleDrop}
                            sortRowCb={this.props.sortRowCb}
                            showTransformRowAndCol={this.props.showTransformRowAndCol}
                            checkDeleteFieldCb={this.props.checkDeleteFieldCb}
                            nccTableConfig={nccTableConfig}
                        />
                }
            </Fragment>
        );
    }
}

export default BaseTableArea;
