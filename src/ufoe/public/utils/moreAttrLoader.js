import React, {Component} from "react";

export default class MoreAttrLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plugin: null
    }
  }
  
  componentDidMount() {
    this.createScript(this.props.url);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.url !== nextProps.url) {
      this.createScript(nextProps.url);
    }
  }

  componentWillUnmount() {
    if(this.script) {
      this.script.removeEventListener('load', this.a);
			this.script.removeEventListener('error', this.b);
			delete this.a;
			delete this.b;
			delete this.script;
    }
  }

  refCodeToRefKey = (refcode) => {
    let refKey = refcode.replace(/\..\//g,'')
		refKey.includes('.js') && (refKey = refKey.substring(0, refKey.length - 3));
		return refKey;
  };
  
  createScript = (src) => {
    if(!src) {
      this.setState({
        url: ""
      });
      return ;
    }
    let scripts = Array.from(document.getElementsByTagName('script')),
				flag,
        refKey = this.refCodeToRefKey(src);
    flag = scripts.find((e) => {
      return e.src.includes(refKey);
    });
    this.a = this.handleLoad.bind(null, refKey, true);
    this.b = this.handError.bind(null, src);
    if(window[refKey]) {
      this.handleLoad(refKey);
    }else {
      this.setState({
        url: ""
      }, () => {
        let script;
        if(flag) {
          script = flag;
        }else {
          script = document.createElement('script');
          script.src = '../../../../' + refKey + '.js';
          script.type = 'text/javascript';
          document.body.appendChild(script);
        }
        this.script = script;
        script.addEventListener('load', this.a);
        script.addEventListener('error', this.b);
      })
    }
  }

  handError = (src) => {
		this.setState({
			url: null
		});
		console.error(`找不到${src}这个文件，请检查引用路径`);
  }
  
  handleLoad = (refKey, async = false) => {
    let that = this;
    try{
      if (!(async && refKey !== that.refCodeToRefKey(that.props.url))) {
        console.log(window[refKey])
        console.log(window[refKey].default)
				that.setState({
					url: window[refKey].default
				});
			}
    }catch(err) {
      this.setState({
        url: null
      });
      console.error(err.message);
    }
  }

  render() {
    let App = this.state.url;
    console.log(App)
    console.log(this.props)
    return typeof App === 'function' && <App {...this.props} />;
  }
}