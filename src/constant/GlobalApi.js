/**
 * 速芽物流商家端 - API
 * https://menger.me
 * UpdateTime: 2017/12/25 14:55
 * @大梦
 */


module.exports = {

    wechatAppid: 'wxe14f9320375dc01e',
    alipayAppid: '2018031002347396',

    base: 'http://suya.3todo.com/',
    // base: 'http://suya.com/index/',
    // base: 'http://suya.com.192.168.2.174.xip.io/index/',
    // base: 'http://192.168.2.120/',

    index: 'home/index/index_list/sid/',                                                                    // 首页
    navigation: 'home/navigation/index',                                                               // 导航
    workStatus: 'home/index/open/id/',
    getBanner: 'home/index/banner',                                                                     // 首页
    contact: 'home/index/contact_list',
    contactAdd: 'home/index/set_contact_list',

    loginIn: 'home/login/index',                                                                        // 登录
    logOut: 'home/login/logout',                                                                        // 登录
    register: 'home/login/register',
    rePassword: 'home/login/forget',
    sendSMS: 'home/login/sendSMS',
    sendPubSMS: 'home/login/sendPubSMS',
    uploadImages: 'user/upfiles/uploadStore',
    protocol: 'user/login/protocol',                                                                    // 用户协议

    serviceSearch: 'home/service/search',
    serviceList: 'home/service/index/sid/',
    submitAddService: 'home/service/add/',
    submitEditService: 'home/service/edit/',
    submitDelService: 'home/service/del/id/',
    serviceHelp: 'home/index/getService',

    staffList: 'home/staff/index/sid/',
    staffAdd: 'home/staff/add/',
    staffEdit: 'home/staff/edit/',
    staffDel: 'home/staff/del/id/',

    store: 'home/store/index/sid/',
    storeDiscount: 'home/index/disinfo/',
    storeSetDiscount: 'home/index/setDisinfo',
    storeAdd: 'home/store/add/',
    storeEdit: 'home/store/edit/',
    storeDel: 'home/store/storeDel/id/',

    storeServices: 'home/service/service_type',

    orderList: 'home/order/index/',
    orderDetail: 'home/order/detail/id/',
    orderCancel: 'user/order/cancelOrder/oid/',
    orderAccept: 'home/order/orderAccept/oid/',
    orderArrival: 'home/order/orderArrival/oid/',
    orderPicked: 'home/order/orderPicked/oid/',
    orderSigned: 'home/order/orderSigned/oid/',
    orderDelete: 'home/order/orderDelete/oid/',

    mine: 'home/personal/index/sid/',
    mineEditPwd: 'home/login/updatePwd/',
    mineStoreEdit: 'home/personal/edit/',
    mineStoreNote: 'home/index/update_hot_note',
    mineStoreSetting: 'home/Personal/set_store_service',
    mineFeedback: 'home/index/message',
    mineFeedbackReward: 'user/index/getMessage',

    mineAccount: 'home/capital/index/sid/',
    mineDeposit: 'home/capital/deposit/sid/',
    mineDepositTips: 'home/capital/depositTips',
    mineDepositApplyTips: 'home/capital/depositApplyTips',
    mineDepositPay: 'home/capital/payDeposit',
    mineDepositApplyPay: 'home/capital/payDeposit',
    mineDepositReturn: 'home/capital/refund/sid/',

    withdraw: 'home/capital/withdraw',
    wechatPay: '',
    aliPay: 'home/capital/payDeposit',
};