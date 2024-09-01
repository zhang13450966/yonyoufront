import React, { useState, useEffect, useRef, useMemo } from 'react';
import classnames from 'classnames';
import { setDefaultScheme } from './ajaxMethods';

export default function SchemeItem(props) {
	const { itemData, schemeList, updateList, handleSelectChange, currentSchemeObj } = props;
	let { shcemename, analysis_id, default_scheme } = itemData;
	const [ hiddenIcon, setHiddenIcon ] = useState(true);

	const handleMouseEnter = () => {
		setHiddenIcon(false);
	};
	const handleMouseLeave = () => {
		setHiddenIcon(true);
	};

	const handleSetDefault = (e) => {
		e.stopPropagation();
		let params = {
			analysis_params: []
		};
		schemeList.forEach((item) => {
			item.default_scheme = false;
			if (item.analysis_id === analysis_id) {
				item.default_scheme = true;
			}
			params.analysis_params.push({
				analysis_id: item.analysis_id,
				default_scheme: item.default_scheme,
				operType: 'EDIT'
			});
		});
		updateList([ ...schemeList ]);
		setDefaultScheme(params);
	};

	const handleSetCurrentScheme = (e) => {
		handleSelectChange(analysis_id);
	};
	return (
		<div
			className={classnames('scheme-item-box', currentSchemeObj.analysis_id === analysis_id && 'active')}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleSetCurrentScheme}
		>
			<span>{shcemename}</span>
			<i
				className={classnames('iconfont icon-sheweimoren', {
					hidden: !default_scheme && hiddenIcon,
					default: default_scheme
				})}
				onClick={handleSetDefault}
			/>
		</div>
	);
}
