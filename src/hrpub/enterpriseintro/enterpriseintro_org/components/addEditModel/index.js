
import {render,connect} from '../../../../../hrpub/common/frame';
import {base} from 'nc-lightapp-front'
import './index.less'
const {NCModal, NCButton} = base 
const AddEditModel = render({
    actions :{
        
    }
})(({props, action, state}) => {
    const {enterpriseOrg} = props
    const {json} = enterpriseOrg
    return(
        <div className="addEditModel">
            <NCModal visible={enterpriseOrg.showModel}
                  mask={false}
                  onCancel={props.closeModel}>
                <NCModal.Header>
                  <NCModal.Title>{enterpriseOrg.modelTitle}</NCModal.Title>
                </NCModal.Header>
                <NCModal.Body>
                    <div className="modalBody">
                        <div className="modalLeft">
                            <div className="mlDom">
                                {/* 企业名称 */}
                                <span className="labelText">{json['orgmap-000256']}</span>
                                <input 
                                    className="iptName" 
                                    type="text"
                                    placeholder={json['orgmap-000264'] } // 请输入企业名称
                                    value={enterpriseOrg.proname}
                                    onChange={props.pronameChange}/>
                            </div>
                            <div className="mlDom mlTopMar">
                                {/* URL地址 */}
                                <span className="labelText">{json['orgmap-000257']}</span>
                                <input 
                                    className="iptName" 
                                    type="text"
                                    placeholder={json['orgmap-000265']} // 请输入URL地址
                                    value={enterpriseOrg.profile}
                                    onChange={props.profileChange}/>
                            </div>
                        </div>
                        <div className="modalRight">
                            <div className="mrDom">
                                <div className="positionImg hrfont hr-tupianzhanwei-" style={{display: enterpriseOrg.imgBase64 ? 'none' : 'block'}}></div>
                                <img className="uploadImg" src={enterpriseOrg.imgBase64} alt=""/>
                                <span className={`hrfont hr-shangchuan- uploadAction`}></span>
                                <input
                                    type="file"
                                    ref="upload"
                                    className="photoUpload"
                                    onChange={props.uploadChange}
                                />
                            </div>
                            {/* 企业LOGO */}
                            <div className="mrText">{json['orgmap-000258']}</div>
                        </div>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                  {/* 保存 */}
                  <NCButton colors="primary" onClick={props.saveFun}>{json['orgmap-000035']}</NCButton>
                  {/* 取消 */}
                  <NCButton onClick={props.closeModel}>{json['orgmap-000025']}</NCButton>
                </NCModal.Footer>
              </NCModal>
        </div>
    )
})   

export default connect(AddEditModel)