
export default {
    currentPage: 'main', // 当前页面 main id-verify reset-pwd first-
    userName: '', // 登录的用户名
    password: '', // 登录的密码
    codeVerify: false, // 是否有验证码
    email: '', // 用户邮箱
    fkey: '', // 验证第一步返回的值
    newPwd: '', // 新密码
    sureNewPwd: '', // 确认新密码
    verifyCode: '', // 邮箱验证码
    showVerifyCode: true, // 是否需要显示邮箱验证码输入框
    inputType: {
        newPwd: '',
        sureNewPwd: '',
        password: ''
    }, // input框动态设置type，为了解决自动填充密码问题
    dsName: '', // 第一次登录后，接口返回，在重置密码时需要作为参数
    encryptionPWD: '', // 经过加密之后的密码
    pageHeight: 0, // 页面高度
}