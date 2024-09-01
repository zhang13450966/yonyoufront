import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
import Utils from "@public/utils";

const { langCheck } = Utils;
import './index.less';

const { NCModal, NCButton } = base;

class HelpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show) {
      this.setState({
        helpVisible: nextProps.show
      });
    }
  }

  componentDidMount() {
    this.setState({
      helpVisible: this.props.show
    });
  }


  render() {
    const { helpVisible } = this.state;
    return (
      <NCModal
        fieldid="helpModel"
        show={helpVisible}
        id="helpModel"
        // className="demo-margin"
        onHide={() => { this.props.onCancel(); }}
        width={680}
        height={450}
      >
        <NCModal.Header closeButton>
          <span className='data-view-help-title'>
            {this.props.title}
          </span>
        </NCModal.Header>
        <NCModal.Body>
          <div className='data-view-help-container'>
            {this.props.content}
          </div>
        </NCModal.Body>
        <NCModal.Footer>
          <NCButton fieldid="helpCancel" className="cancel-button" onClick={() => {
            this.props.onCancel();
          }}>
            {/* 知道了 */}
            {langCheck("reportMultiLang", "dataView-100301-000267")}
          </NCButton>
        </NCModal.Footer>
      </NCModal>
    );
  }
}

export default HelpModal;
