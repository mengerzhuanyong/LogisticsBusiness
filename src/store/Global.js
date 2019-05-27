
//用户登录数据
global.store = {
    loginState: '', //登录状态
    storeData: '', //用户数据
};
//刷新的时候重新获得用户数据
storage.load({
    key: 'loginState',
}).then(ret => {
    global.store.loginState = true;
    global.store.storeData = ret;
}).catch(err => {
    global.store.loginState = false;
    global.store.storeData = '';
})