import React, { Component } from 'react';
import StyleButton from './style_button';
import { base, toast } from 'nc-lightapp-front';
const { NCIcon, NCModal, NCButton, NCTabs, NCUpload, NCFormControl } = base;
// import { INLINE_STYLES } from '../config/inline_type';
export default class ImageControls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			imageURL: '',
			showImgInput: false
		};
	}
	onChangeImageURL = (imageURL) => {
		this.setState({
			imageURL
		});
	};
	addImage = () => {
		this.setState({
			showModal: true
		});
	};
	closeModal = () => {
		this.setState({
			showModal: false,
			imageURL: ''
		});
	};
	tabChange = (key) => {
		console.log(key);
	};
	createBillId = () => {
		let s = [],
			billId = '';
		const hexDigits = '0123456789abcdef';
		for (let i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(+('0.'+(+new Date()+'').split('').reverse().join('')) * 0x10), 1);
		}
		s[14] = '4';
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		s[8] = s[13] = s[18] = s[23] = '-';
		billId = s.join('');
		return billId;
	};
	showInput = () => {
		this.setState({
			showImgInput: true
		});
	};
	render() {
		const { lang } = this.props;
		const billId = this.createBillId();
		let fullPath = billId;
		const uploadOptions = {
			name: 'file',
			accept: '.png, .jpg, .jpeg, .gif',
			size: 10 * 1024 * 1024 * 1024,
			multiple: false,
			showUploadList: false,
			action: '/nccloud/platform/attachment/upload.do',
			data: {
				billId,
				fullPath
			},
			onChange: (info) => {
				const status = info.file.status;
				if (status === 'done') {
					let url = info.file.response.data.map((item) => item.previewUrl).join();
					this.onChangeImageURL(url);
				} else if (status === 'error') {
					toast({
						color: 'error',
						content: `${info.file.name} file upload failed.`
					});
				}
			}
		};
		return (
			<div className="hrEditor-controls">
				<StyleButton iconClassName={''} key={''} active={''} label={''} onToggle={this.addImage} style={''}>
					<NCIcon type="uf-picture" />
				</StyleButton>
				<NCModal visible={this.state.showModal} backdropClosable={false} width="60%" onCancel={this.closeModal}>
					<NCModal.Header closeButton>
						<NCModal.Title>{`${lang['hrpub-000141']}${lang['hrpub-000143']}`}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<NCUpload.Dragger {...uploadOptions}>
							<p className="u-upload-drag-icon">
								<NCIcon type="inbox" className="uf-upload" />
							</p>
							<p className="u-upload-text">{lang['hrpub-000144']}</p>
							<p className="u-upload-hint">{lang['hrpub-000145']}</p>
						</NCUpload.Dragger>
					</NCModal.Body>
					<NCModal.Footer>
						{/* <div className="add-image-url">
							<NCButton onClick={this.showInput}>{`${lang['hrpub-000141']}${lang['hrpub-000143']}${lang[
								'hrpub-000142'
							]}`}</NCButton>
							<NCFormControl
								style={{ display: this.state.showImgInput ? 'inline' : 'none' }}
								className="image-url"
								value={this.state.imageURL}
								onChange={this.onChangeImageURL}
							/>
						</div> */}
						<div className="button-group">
							<NCButton type="primary">{lang['hrpub-000055']}</NCButton>
							<NCButton onClick={this.closeModal}>{lang['hrpub-000056']}</NCButton>
						</div>
					</NCModal.Footer>
				</NCModal>
			</div>
		);
	}
}
