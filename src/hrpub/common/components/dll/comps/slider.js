import React, { useState } from 'react'
export const DlSlider = ({addChart, dataArr=[], isEdit}) => {
    const handleClick = (type, index) => {
        if (isEdit) {
            addChart(type)
        }
    }
    return (
        <ul>
            {
                dataArr.map((obj,i)=>{
                    return (
                        <li 
                            key={obj.type+i} 
                            onClick={handleClick.bind(this, obj.type, i)} 
                            className={`${isEdit ? 'checkedDom' : ''}`}
                            style={{cursor: isEdit ? '' : 'not-allowed'}}>
                            <span style={{fontSize: obj.iconCalss === 'hr-renjunfuwuliang-' ? '12px' : '14px'}} className={`anticon anticon-menu-fold hrfont ${obj.iconCalss}`}></span>
                            <span>{obj.name}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
}