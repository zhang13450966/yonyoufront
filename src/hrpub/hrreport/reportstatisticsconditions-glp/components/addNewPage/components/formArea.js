import React from 'react';

import './index.less';

import { render, connect } from 'src/hrpub/common/frame';

import AddAction from '../actions/index';
import reactComposition from './util'
const FormArea = render({
    actions: {
        aa: AddAction
    },
    state: {
        selectAll: false,
        selectRows: null
    }
})(({ props, state, action }) => {
    const {
        rsc,
    } = props;

    return (
        <textarea
        ref={(ref) => rsc.textareaRef = ref}
        className="sql-area"
        value={rsc.areaValTotal}
        onBlur={action.aa.onBlur}
        readOnly={rsc.readOnly}
        {
            ...reactComposition({
                onChange: async(event) => {
                    var value = event.target.value
                    if (event.reactComposition.composition === false) {
                        action.aa.changeData('finalValue', value)
                    }
                    await action.aa.changeData('areaValTotal', value)
                    // action.aa.onChange
                }
            })
        }
    ></textarea>
    );

});

export default connect(FormArea)