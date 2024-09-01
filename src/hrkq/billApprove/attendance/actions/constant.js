export default class Constant {
    reqData = [{
        rqUrl: '/platform/templet/querypage.do',
        rqJson: `{\n  \"pagecode\": \"60656046nccloud\",\n  \"appcode\": \"60656046\"\n}`,
        rqCode: 'template'
    }, {
        rqUrl: '/platform/appregister/queryallbtns.do',
        rqJson: `{\n  \"pagecode\": \"60656046nccloud\",\n  \"appcode\": \"60656046\"\n}`,
        rqCode: 'button'
    }, {
        rqUrl: '/platform/appregister/queryappcontext.do',
        rqJson: `{\n  \"appcode\": \"60656046\"}`,
        rqCode: 'context'
    }];
};