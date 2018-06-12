/**
 * 速芽物流商家端 - Home
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Switch,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity
} from 'react-native'
import Geolocation from 'Geolocation'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import ModalView from '../../util/utilsDialogs'
import {toastShort, consoleLog} from '../../util/utilsToast'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'

import NavigationButton from '../../component/common/headerRightButton'
import BannerView from '../../component/common/Banner'
import HotNews from '../../component/common/hotNews'
import NavigatorItem from '../../component/home/navigatorItem'
import BusinessItem from '../../component/common/businessItem'

import ShopData from '../../asset/json/homeBusiness.json'

const MODAL_CONFIG = {
    title: '下班提醒',
    modalText: '下班后用户将无法下单，您确认要下班吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};
const __IOS__ = Platform.OS === 'ios';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            store: global.store ? global.store.storeData : '',
            ready: false,
            loadMore: false,
            refreshing: false,
            status: '2',
            workStatus: false,
            companyListData: [],
            modalShow: false,
            audited: '1',
            isRefreshing: false,
            bannerData: [],
            hotNewsData: [],
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.getBannerData();
        // this.getCurrentPosition();
        // console.log(global.store.storeData);
        if (global.store && global.store.loginState) {
            this.setState({
                store: global.store.storeData
            })
        }
        this.timer = setTimeout(() => {
            this.setState({
                ready: true
            })
        },600)
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };
    
    //开始监听位置变化
    getCurrentPosition = () => {
        let para = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        };
        Geolocation.getCurrentPosition(
            location => {
                let result = {
                    lng: location.coords.longitude,
                    lat: location.coords.latitude
                };
                // console.log("获取位置：", result)
            },
            error => {
                toastShort('获取当前位置失败，请稍后重试！');
                // console.log("获取位置失败：", error)
            },
            para
        );
    }

    getBannerData = () => {
        let url = NetApi.getBanner;
        this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    this.setState({
                        bannerData: result.data.banner,
                    });
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    };

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    showModalView = () => {
        this.setState({
            modalShow: !this.state.modalShow
        });
    }

    cancelFoo = () => {
        this.setState({
            workStatus: true,
            modalShow: !this.state.modalShow,
        })
    }

    loadNetData = () => {
        // console.log(this.state.store);
        this.getBannerData();
        let url = NetApi.index + this.state.store.sid;
        this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                if (result && result.code == 1) {
                    this.setState({
                        status: result.data.storeStatus,
                        workStatus: result.data.storeStatus == 1 ? true : false,
                        audited: result.data.audited,
                        hotNewsData: result.data.hot_note,
                    })
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    renderCompanyItem = (item) => {
        return (
            <BusinessItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness()}
            />
        )
    }
    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <Text style={styles.titleName}>推荐</Text>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
            </View>
        )
    }
    renderFooterView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }
    renderEmptyView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    onPushToBusiness = () => {
        const { navigate } = this.props.navigation;
        // console.log(123);
        navigate('BusinessDetail', {
            webTitle: 'webTitle',
            reloadData: () => this.loadNetData(),
        })
    }

    onPushNavigator = (webTitle, compent) => {
        let {audited} = this.state;
        let { navigate } = this.props.navigation;
        let {storeData} = global.store;
        if (audited == 0) {
            toastShort('对不起，您的账号还未通过审核，暂时无法使用该功能！', 'center');
            return;
        }
        // console.log(navigate);
        navigate(compent, {
            webTitle: webTitle,
            reloadData: () => this.loadNetData(),
        })
    }

    changeWorkStatus = (data) => {
        data == 2 && this.showModalView();
        if (data == 2) {
            this.setState({
                workStatus: false,
            });
        }
        let { store, status } = this.state;
        if ( data == status) {
            return;
        }
        this.setState({
            status: data
        });
        let url = NetApi.workStatus + store.sid + '/status/' + data;
        // console.log(url);
        this.netRequest.fetchGet(url)
            .then( result => {
                // console.log(result);
                if (result && result.code == 1) {
                    let msg = data == 1 ? '您已上班，开始接单啦' : '您已下班，暂停接单中';
                    toastShort(msg);
                }
            })
            .catch( error => {
                toastShort('网络请求失败，请稍后重试');
            })
    }

    renderLeftButton = () => {
        let { status, audited, workStatus } = this.state;
        let statusName = '立即上班';
        if (audited == 0) {
            statusName = '等待审核中';
        } else if (status == 1) {
            statusName = '立即下班';
        }
        return (
            <View style={styles.leftButtonView}>
                <Text style={styles.leftButtonItemName}>{statusName}</Text>
                <Switch
                    tintColor = {'#ddd'}
                    onTintColor = {'#4caf50'}
                    value = {workStatus}
                    onValueChange = {(value) => {
                        if (value === true) {
                            this.setState({
                                workStatus: value
                            }, () => this.changeWorkStatus(1));
                        } else {
                            this.showModalView();
                        }
                    }}
                />
            </View>
        );
    };

    render(){
        const { ready, bannerData, hotNewsData, refreshing, companyListData, modalShow, isRefreshing, store } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    style = {{
                        backgroundColor: GlobalStyles.themeColor
                    }}
                    backgroundImage = {false}
                    titleLayoutStyle = {{left: 150, right: 90,}}
                    leftButton = {this.renderLeftButton()}
                    rightButton = {<NavigationButton icon={GlobalIcons.icon_user_list} iconStyle={{tintColor: '#fff'}} type={'right'} submitFoo={() => this.onPushToNextPage('通讯录', 'UserContact')} />}
                />
                <ScrollView
                    style={styles.homeNavigationView}
                    refreshControl={
                        <RefreshControl
                            title='Loading...'
                            refreshing={isRefreshing}
                            onRefresh={this.loadNetData}
                            tintColor="#0398ff"
                            colors={['#0398ff']}
                            progressBackgroundColor="#fff"
                        />
                    }
                >
                    <BannerView bannerData = {bannerData} />
                    <View style={styles.hotNewsView}>
                        <Image source={GlobalIcons.icon_note} style={styles.noteIcon} />
                        <TouchableOpacity
                            style={styles.hotNewsItemView}
                            onPress={() => this.onPushNavigator('门店公告', 'MineStoreNote')}
                        >
                            <Text style={styles.hotNewsTitle} numberOfLines={2}>{hotNewsData}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.homeNavigationCon}>
                        <NavigatorItem
                            navigatorName = {"服务管理"}
                            navigatorIcon = {GlobalIcons.icon_services}
                            onPushNavigator = {() => this.onPushNavigator('服务管理', 'SverviceList')}
                        />
                        <NavigatorItem
                            navigatorName = {"订单管理"}
                            navigatorIcon = {GlobalIcons.icon_orders}
                            onPushNavigator = {() => this.onPushNavigator('订单管理', 'Order')}
                        />
                        {store.isStore == 1 && <NavigatorItem
                            navigatorName={"财务管理"}
                            navigatorIcon={GlobalIcons.icon_finance}
                            onPushNavigator={() => this.onPushNavigator('财务管理', 'MineFinance')}
                        />}
                        {store.isStore == 1 && <NavigatorItem
                            navigatorName = {"服务点管理"}
                            navigatorIcon = {GlobalIcons.icon_serviceAddress}
                            onPushNavigator = {() => this.onPushNavigator('服务点管理', 'MineAddressList')}
                        />}
                        {store.isStore == 1 && <NavigatorItem
                            navigatorName = {"员工管理"}
                            navigatorIcon = {GlobalIcons.icon_employee}
                            onPushNavigator = {() => this.onPushNavigator('员工账号添加', 'MineEmployee')}
                        />}
                        {store.isStore == 1 && <NavigatorItem
                            navigatorName = {"司机管理"}
                            navigatorIcon = {GlobalIcons.icon_drivers}
                            onPushNavigator = {() => this.onPushNavigator('司机账号添加', 'MineDriver')}
                            />
                        }
                    </View>
                    {modalShow && <ModalView
                        show = {modalShow}
                        title = {MODAL_CONFIG.title}
                        contentText = {MODAL_CONFIG.modalText}
                        cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                        confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                        cancelFoo = {() => this.cancelFoo()}
                        confirmFoo = {() => this.changeWorkStatus(2)}
                    />}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    leftButtonView: {
        zIndex: 2,
        marginLeft: 15,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    leftButtonItem: {
        height: 40,
        justifyContent: 'center',
    },
    leftButtonItemName: {
        fontSize: __IOS__ ? 17 : 14,
        color: '#fff',
        marginRight: 10,
    },
    hotNewsView: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#fafafa',
        justifyContent: 'flex-start',
    },
    noteIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    hotNewsItemView: {
        height: 45,
        width: GlobalStyles.width - 60,
        justifyContent: 'center',
    },
    hotNewsTitle: {
        fontSize: 14,
        color: '#666',
    },
    homeNavigationView: {
        flex: 1,
    },
    homeNavigationCon: {
        flex: 1,
        flexWrap: 'wrap',
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        // backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    shopListView: {
        marginTop: 10,
        backgroundColor: '#fff',
    },
    shopListViewTitle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: GlobalStyles.borderColor,
    },
    horLine: {
        width: 50,
        backgroundColor: '#ddd',
    },
    titleName: {
        fontSize: 12,
        color: '#666',
        marginHorizontal: 20,
    },
});
