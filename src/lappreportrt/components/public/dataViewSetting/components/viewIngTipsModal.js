import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import Utils from "@public/utils";

import './index.less';

const { NCButton, NCModal, NCTooltip, NCHotKeys } = base;
const { langCheck } = Utils;

class ViewIngTipsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewDataIngTipsVisibile: false, // 预览视图中visible
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewDataIngTipsVisibile !== nextProps.viewDataIngTipsVisibile) {
      this.setState({
        viewDataIngTipsVisibile: nextProps.viewDataIngTipsVisibile,
      })
    }
  }


  render() {
    const {
      viewDataIngTipsVisibile,
    } = this.state;

    return (
      <div className="btn-box">
        <NCModal
          fieldid="viewDataIngTipsModal"
          show={viewDataIngTipsVisibile}
          className="report-view-data-ing-tips-modal"
          size='sm'
          width={435}
        >
          <NCModal.Header>
            {/* 提示信息 */}
            <span className="modal-title">
              {langCheck('reportMultiLang', 'dataView-100301-000249')}
            </span>
          </NCModal.Header>
          <NCModal.Body>
            <div style={{ padding: '10px 20px 35px' }}>
              <div className='content-title'>
                <i style={{ fontSize: 18, color: 'green' }} className="iconfont icon-chenggong"></i>
                <span className='content-title-text'>
                  {/* 视图预览中 */}
                  {langCheck('reportMultiLang', 'dataView-100301-000250')}
                </span>
              </div>
              <div className='content-body nc-theme-common-font-c'>
                {/* 当前存在预览中的视图，请处理后再进行其他操作 */}
                {langCheck('reportMultiLang', 'dataView-100301-000251')}
              </div>
            </div>
          </NCModal.Body>
          <NCModal.Footer>

            <NCHotKeys
              keyMap={{
                cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
              }}
              handlers={{
                cancelBtnHandler: () => {
                  this.setState({
                    viewDataIngTipsVisibile: false,
                  })
                  this.props.setViewDataIngTipsVisibile(false);
                },
              }}
              focused={true}
              attach={document.body}
              style={{ display: 'inline-block' }}
            >

              <NCTooltip
                inverse
                trigger={["hover", "focus"]}
                placement="top"
                className="model-helper-overlay"
                overlay={`${langCheck(
                  "reportMultiLang",
                  "dataView-100301-000252"
                )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM})`}
              >
                <NCButton fieldid="viewDataIngTips" colors="primary" className="sure-button" onClick={() => {
                  this.setState({
                    viewDataIngTipsVisibile: false,
                  })
                  this.props.setViewDataIngTipsVisibile(false);
                }}>
                  {/* 确定 */}
                  {langCheck('reportMultiLang', 'dataView-100301-000252')}
                  (<span className="text-decoration-underline">
                      Y
                  </span>)
                </NCButton>
              </NCTooltip>
            </NCHotKeys>
          </NCModal.Footer>
        </NCModal>
      </div>
    );
  }
}

export default ViewIngTipsModal;
