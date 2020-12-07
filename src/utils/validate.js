// 用来过滤特殊字符
// 导出方法
const validate_inputValue = (s, type) => {
    if (type == 'email') {
        var pattern = new RegExp("[`%~!#$^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
    } else {
        var pattern = new RegExp("[`%~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
    }
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}


// 邮箱验证
const test_email = value => {
    let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    return !reg.test(value)
}

// 密码验证
const test_password = value => {
    let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
    return !reg.test(value)
}
// 验证码验证
const test_code = value => {
    let reg = /^[a-z0-9]{6}$/
    return !reg.test(value)
}
export default {
    validate_inputValue,
    test_email,
    test_password,
    test_code
}