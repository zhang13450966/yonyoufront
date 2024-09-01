import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import Utils from "@public/utils";

import './index.less';

const { langCheck } = Utils;
const { NCButton, NCModal, NCButtonGroup } = base;

class ViewIngModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewDataIngVisibile: false, // 预览视图中visible
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewDataIngVisibile !== nextProps.viewDataIngVisibile) {
      this.setState({
        viewDataIngVisibile: nextProps.viewDataIngVisibile,
      })
    }
  }


  render() {
    const {
      viewDataIngVisibile,
    } = this.state;
    const { dataViewMenuArr, curSelectModelIndex, entranceType } = this.props;
    const buttonList = [
      {
        title: langCheck('reportMultiLang', 'dataView-100301-000246'), // 保存
        colors: "primary",
        key: "confirm",
        onClick: this.props.saveCurrentOperate,
        className: "button-primary data-view-footer-button",
      },
      {
        title: langCheck('reportMultiLang', 'dataView-100301-000247'), // 另存
        key: "default",
        colors: "secondary",
        onClick: this.props.saveAsCurrentOperate,
        className: "data-view-footer-button"
      },
    ]
    const showTitle = entranceType === 'add' ? langCheck('reportMultiLang', 'dataView-100301-000250') : `${langCheck('reportMultiLang', 'dataView-100301-000250')}-${Array.isArray(dataViewMenuArr) && dataViewMenuArr.length > 0 && dataViewMenuArr[curSelectModelIndex] && dataViewMenuArr[curSelectModelIndex].name}`;
    const modalLefPos = document.body.clientWidth - 310;
    return (
      <NCModal
        fieldid="viewDataIngModal"
        show={viewDataIngVisibile}
        // className="view-data-ing-modal-container"
        className="modal-no-event view-data-ing-find-modal"
        resizeClassName="modal-event"
        contentStyle={{'min-height': 'auto','width': '310px', height: 'auto'}}
        centered={false}
        minHeight='87'
        backdrop={false}
        showPosition={{ x: modalLefPos, y: 73 }}
      >
        <NCModal.Header className="view-data-ing-modal-header">
          <div className={'view-data-ing-title'}>
            <span className='icon'> </span>
            <div className='title' title={showTitle}>
              {/* 视图预览中 */}
              {showTitle}
            </div>
          </div>
        </NCModal.Header>
        <NCModal.Body className="view-data-ing-modal-body">
        </NCModal.Body>
        <NCModal.Footer className="view-data-ing-modal-footer">
          <NCButton className="data-view-footer-button" onClick={() => {
            this.props.setViewDataIngVisibile(false);
            this.props.continueSetDataView();
          }}
          >
            {/* 继续设置 */}
            {langCheck('reportMultiLang', 'dataView-100301-000244')}
          </NCButton>


          {
            entranceType === 'edit' && <NCButtonGroup style={{ marginLeft: 8 }} list={buttonList} />
          }

          {
            entranceType === 'add' && (
              <NCButton fieldid="saveAs" colors='primary' className="data-view-footer-button" onClick={() => {
                this.props.saveAsCurrentOperate();
              }}>
                {/* 保存 */}
                {langCheck('reportMultiLang', 'dataView-100301-000246')}
              </NCButton>
            )
          }
          
          <NCButton 
            className="data-view-footer-button"
            onClick={() => {
              this.props.onCancleViewIngModal();
              this.props.setViewDataIngVisibile(false);
          }}>
            {/* 取消 */}
            {langCheck('reportMultiLang', 'dataView-100301-000248')}
          </NCButton>
        </NCModal.Footer>
      </NCModal>
    );
  }
}

export default ViewIngModal;
