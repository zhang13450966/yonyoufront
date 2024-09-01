import React, { Component } from 'react';
import ViewModel from './viewmodel';
/*
* autor:张建新  zjx@yonyou.com   
* date: 2018/06/28
* ViewModel for App Component cache
* useage: @withViewModel, component will support viewmodel cache automatically
*/
export default function withViewModel(ImportComponent) {
  class WithViewModelComponent extends Component {
    constructor(props) {
      super(props);
      //this.props.ViewModel = ViewModel;
    }
    render() {
      return <ImportComponent ViewModel={ViewModel} {...this.props} />;
}
  }
return WithViewModelComponent;
}
