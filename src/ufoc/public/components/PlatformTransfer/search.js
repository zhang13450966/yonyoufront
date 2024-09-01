/* eslint-disable no-undef */
/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:49:54
 * @LastEditTime: 2022-04-24 14:27:15
 * @LastEditors: Please set LastEditors
 * @Description: 搜索部分
 * @FilePath: \Platform_Front\src\platform\base\TransferBox\search.js
 * 这锅我不背
 */
import React, { Component } from 'react';
import {base} from 'nc-lightapp-front'

let { NCInput : FormControl } = base;
import PropTypes from 'prop-types';

const propTypes = {
    prefixCls: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    handleClear: PropTypes.func,
}

const defaultProps = { placeholder: '' };

class Search extends React.Component {

    handleChange = e => {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(e);
        }
    }

    handleClear = e => {
        e.preventDefault();

        const handleClear = this.props.handleClear;
        if (handleClear) {
            handleClear(e);
        }
    }

    render() {
        const { placeholder, value, prefixCls } = this.props;

        return (
            <div>
                <FormControl
                    placeholder={placeholder}
                    className={prefixCls}
                    value={value}
                    // ref="input"
                    type="search"
                    onChange={this.handleChange}
                    onSearch={this.handleChange}
                    clearSearch={this.handleClear}
                />
            </div>
        );
    }
}
Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;