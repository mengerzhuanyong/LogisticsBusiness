/**
 * 速芽物流商家端 - MineDeposit
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
    Platform,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import * as wechat from 'react-native-wechat'
import Alipay from 'react-native-yunpeng-alipay'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import MineCouponItem from '../../component/mine/mineCouponItem'
import BusinessItem from '../../component/common/businessItem'
import FinanceItem from '../../component/common/financeItem'
import NavigatorItem from '../../component/mine/navigatorItem'
import ModalView from '../../util/utilsDialogs'

import ShopData from '../../asset/json/homeBusiness.json'

const MODAL_CONFIG = {
    title: '退款提醒',
    modalText: '您确定要将保证金退回吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

const __IOS__ = Platform.OS === 'ios';
const selectedIcon = GlobalIcons.icon_checked;
const selectIcon = GlobalIcons.icon_check;

export default class MineDeposit extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            store: global.store.storeData,
            ready: false,
            loadMore: false,
            refreshing: false,
            paymentType: '2',
            // item: '',
            item: params && params.item ? params.item : {},
            remark: params && params.remark ? params.remark : {title: '', content: [],},
            canPress: true,
            modalShow: false,
            canBack: false,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.onBack();
        this.timer && clearTimeout(this.timer);
        this.timer2 && clearTimeout(this.timer2);
    }

    onBack = () => {
        this.props.navigation.state.params.reloadData();
        this.props.navigation.goBack();
    }

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    showModalView = () => {
        this.setState({
            modalShow: !this.state.modalShow
        })
    }

    loadNetData = () => {

    }

    dropLoadMore = () => {}

    freshNetData = () => {}

    renderListItem = (item) => {
        return (
            <FinanceItem item = {item} />
        )
    }
    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>账单</Text>
            </View>
        )
    }
    renderFooterView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }
    renderEmptyView = () => {
        return (
            <View style={styles.emptyTipsView}>
                <Text style={styles.emptyTipsCon}>您还没有收藏商家</Text>
            </View>
        )
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    onPushNavigator = (webTitle, compent) => {
        const { navigate } = this.props.navigation;
        // console.log(navigate);
        navigate(compent, {
            webTitle: webTitle
        })
    }

    submit = () => {
        let { store, item, paymentType } = this.state;

        let data = {
            sid: store.sid,
            style: item.style,
        };
        // console.log(paymentType);
        if (paymentType == 1) {
            wechat.isWXAppInstalled()
                .then((isInstalled) => {
                    if(isInstalled) {
                        let url = NetApi.wechatPay;
                        this.netRequest.fetchPost(url, data)
                            .then( result => {
                                // console.log(result);
                                this.submitWechatPay(result.data);
                            })
                            .catch( error => {
                                // console.log('首页推荐', error);
                            })
                    }else{
                        toastShort('没有安装微信软件，请您安装微信之后再试');
                    }
                })
                .catch((error) => {
                    toastShort(error.message);
                });
        } else {
            let url = NetApi.mineDepositPay;
            this.netRequest.fetchPost(url, data)
                .then( result => {
                    // console.log(result);
                    if (result && result.code == 1) {
                        this.submitAlipay(result.data);
                    }
                })
                .catch( error => {
                    // console.log('首页推荐', error);
                })
        }
    }

    submitWechatPay = async (data) => {
        try {
            const Pay = await wechat.pay({
                appid: NetApi.wechatAppid,
                partnerId: data.partnerid,        // 商家向财付通申请的商家id
                prepayId: data.prepayid,          // 预支付订单
                nonceStr: data.noncestr,          // 随机串，防重发
                timeStamp: data.timestamp,        // 时间戳，防重发
                package: data.package,            // 商家根据财付通文档填写的数据和签名
                sign: data.sign                   // 商家根据微信开放平台文档对数据做的签名
            });
            // console.log(Pay);
        } catch (error) {
            // console.log('付款失败：' + error);
        }
    }

    submitAlipay = (signed) => {
        const {navigate, state, goBack} = this.props.navigation;
        Alipay.pay(signed)
            .then(function(data) {
                toastShort('付款成功');
                this.timer2 = setTimeout(() => {
                    // this.onBack();
                    state.params.reloadData();
                    goBack();
                }, 500);
                // console.log(data);
            }, function(err) {
                // console.log(err);
                toastShort(err.domain);
            });
    }

    submitReturn = () => {
        this.showModalView();
        let url = NetApi.mineDepositReturn + this.state.store.sid;
        this.setState({
            canPress: false
        })
        this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.timer = setTimeout(() => {
                        this.onBack();
                    }, 1000);
                } else {
                    toastShort(result.msg);
                    this.setState({
                        canPress: true
                    })
                }
            })
            .catch(error => {
                toastShort('error');
                this.setState({
                    canPress: true
                })
            })
    };

    renderRemarkContent = (data) => {
        if (!data || data.length < 1) {
            return;
        }
        let content = data.map((item, index) => {
            return <Text key={'rule'+item.id} style={styles.rulesContext}>{item.value}</Text>;
        });
        return content;
    };

    render(){
        const { ready, refreshing, item, paymentType, canPress, modalShow, remark } = this.state;
        const { params } = this.props.navigation.state;
        let depositStatus = item.name == '保证金' && item.status == 1;
        let tips = depositStatus ? '已交纳' : '交纳';
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {tips + params.webTitle}
                    style = {{
                        zIndex: 2,
                    }}
                    backgroundImage = {false}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.mineTopContainer}>
                    <Image style={styles.backgroundImages} source={GlobalIcons.images_bg_finance} />
                    <View style={styles.mineAccountInfoView}>
                        <Text style={styles.mineAccountInfoCon}>{item.money}元</Text>
                    </View>
                </View>
                {!depositStatus && <View style={styles.mineNavigatorContainer}>
                    <TouchableOpacity
                        style = {styles.paymentMethodItem}
                        onPress = {() => {
                            this.setState({
                                paymentType: '2',
                            })
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_alipay} style={styles.paymentMethodIcon} />
                            <Text style={styles.cargoAttributesTitle}>支付宝支付</Text>
                        </View>
                        <Image source={paymentType == '2' ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>
                    {/*<View style={[GlobalStyles.horLine, styles.horLine]} />
                    <TouchableOpacity
                        style = {styles.paymentMethodItem}
                        onPress = {() => {
                            this.setState({
                                paymentType: '1',
                            })
                        }}
                    >
                        <View style={styles.paymentMethodTitleView}>
                            <Image source={GlobalIcons.icon_wechat} style={styles.paymentMethodIcon} />
                            <Text style={styles.cargoAttributesTitle}>微信支付</Text>
                        </View>
                        <Image source={paymentType == '1' ? selectedIcon : selectIcon} style={GlobalStyles.checkedIcon} />
                    </TouchableOpacity>*/}
                </View>}
                <View style={styles.mineBtnView}>
                    {depositStatus ?                        
                        <TouchableOpacity
                            style = {[GlobalStyles.btnView, {backgroundColor: '#ccc'}]}
                            onPress = {() => {canPress && this.showModalView()}}
                        >
                            <Text style={[GlobalStyles.btnItem, {color: '#555'}]}>退回保证金</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style = {GlobalStyles.btnView}
                            onPress = {() => {canPress && this.submit()}}
                        >
                            <Text style={GlobalStyles.btnItem}>立即交纳</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.rulesContent}>
                    <Text style={styles.rulesTitle}>{remark.title}</Text>
                    {this.renderRemarkContent(remark.content)}
                </View>
                {modalShow && <ModalView
                    show = {modalShow}
                    title = {MODAL_CONFIG.title}
                    contentText = {MODAL_CONFIG.modalText}
                    cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                    confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                    cancelFoo = {() => this.showModalView()}
                    confirmFoo = {() => this.submitReturn()}
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    mineTopContainer: {
        height: GlobalStyles.width * 0.45,
        marginTop: -70,
        paddingBottom: 20,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
    },
    backgroundImages: {
        position: 'absolute',
        top: 0,
        width: GlobalStyles.width,
        height: GlobalStyles.width * 0.45,
    },
    mineAccountInfoView: {
        paddingTop: 90,
        paddingBottom: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    mineAccountInfoTitle: {
        fontSize: 16,
        color: '#fff',
    },
    mineAccountInfoCon: {
        fontSize: 36,
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20,
        // fontWeight: '600',
    },
    mineInfoView: {
        paddingVertical: 50,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    userPhotoView: {
        width: 100,
        height: 100,
        borderWidth: 5,
        marginRight: 25,
        borderRadius: 50,
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: GlobalStyles.themeDeepColor,
    },
    userPhoto: {
        width: 80,
        height: 80,
    },
    userInfoDetail: {
        height: 70,
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
    },
    userInfoName: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '800',
    },
    userInfoSetting: {
    },
    userInfoSettingName: {
        fontSize: 14,
        color: '#fff',
    },
    mineNavigatorContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    flatListView: {
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    shopListViewTitle: {
        padding: 15,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderColor: GlobalStyles.borderColor,
    },
    titleName: {
        fontSize: 14,
        color: '#333',
    },
    emptyTipsView: {
        alignItems: 'center',
    },
    emptyTipsCon: {
        fontSize: 16,
        color: '#666',
        lineHeight: 30,
    },
    emptyTipsBtnCon: {

    },

    paymentMethodItem: {
        marginTop: 5,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        // width: GlobalStyles.width - 100,
    },
    paymentMethodIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    mineBtnView: {
        marginTop: 20,
    },
    rulesContent: {
        padding: 10,
    },
    rulesTitle: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    rulesContext: {
        fontSize: 13,
        color: '#666',
        lineHeight: 25,
        marginHorizontal: 14,
    },
});
