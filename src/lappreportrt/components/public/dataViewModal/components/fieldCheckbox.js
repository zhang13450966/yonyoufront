import React from 'react'
import { base } from 'nc-lightapp-front';

const { NCCheckbox } = base;

export default function FieldCheckbox(props) {
	function handleChange(value) {
		props.handleChange(value, props.code)
	}
	return (
		<NCCheckbox
			onChange={handleChange}
			checked={props.value}
			disabled={props.disabled}
			className='data-view-table-top-checkbox'
		>
			{props.name}
		</NCCheckbox>
	)
}
