import React, {Component} from 'react';

import './index.less';

import {
    base
} from 'nc-lightapp-front';

const {
    NCButton
} = base;

export default class AddPageHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            status, 
            onClick, 
            button, 
            language,
            cancelEdit,
            cardPagination,
            toBrowsePage,
            fromApprove
        } = this.props;

        return (
            <div className="add-page-header-wrapper">
                
                <Choose>
                    <When condition={status === 'browse'}>
                        {button.createButtonApp({
                            area: 'head',
                            onButtonClick: onClick('browse_status')
                        })}
                    </When>
                </Choose>
            </div>
        );
    }
}