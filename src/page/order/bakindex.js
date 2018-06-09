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
    FlatList,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import EmptyComponent from '../../component/common/EmptyComponent'
import OrderItem from '../../component/order/orderItem'

import BannerView from '../../component/common/Banner'
import NavigatorItem from '../../component/home/navigatorItem'
import BusinessItem from '../../component/common/businessItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            store: global.store.storeData,
            audited: '1',
            ready: false,
            loadMore: false,
            refreshing: false,
            companyListData: [],
            isRefreshing: false,
            navigations: [
                {name: '待接单订单', status: '1'},
                {name: '待取货订单', status: '7'},
                {name: '进行中订单', status: '2'},
                {name: '待收货订单', status: '8'},
                {name: '已完成订单', status: '4'},
                {name: '已取消订单', status: '6'},
            ],
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
        this.timer = setTimeout(() => {
            this.setState({
                ready: true
            })
        },600)
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
        this.timer && clearTimeout(this.timer);
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        let url = NetApi.index + this.state.store.sid;
        this.netRequest.fetchGet(url, true)
            .then(result => {
                console.log(result);
                if (result && result.code == 1) {
                    this.setState({
                        audited: result.data.audited,
                    })
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    dropLoadMore = async () => {
        // let result = await this.loadNetData(0);
        // if (result && result.code == 1) {
        //     this.setState({
        //         serviceListData: result.data.service
        //     })
        // } else {
        //     toastShort(result.msg);
        // }
    };

    freshNetData = async () => {
        // let result = await this.loadNetData(0);
        // if (result && result.code == 1) {
        //     this.setState({
        //         orderListData: result.data.order
        //     })
        // } else {
        //     toastShort(result.msg);
        // }
    };

    renderCompanyItem = (item) => {
        return (
            <BusinessItem
                item = {item}
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
            webTitle: 'webTitle'
        })
    }

    onPushNavigator = (webTitle, compent, orderStatus) => {
        const { navigate } = this.props.navigation;
        let {storeData} = global.store;
        if (this.state.audited == 0) {
            toastShort('对不起，您的账号还未通过审核，暂时无法使用该功能！', 'center');
            return;
        }
        // console.log(navigate);
        navigate(compent, {
            webTitle: webTitle,
            orderStatus: orderStatus,
            reloadData: () => this.freshNetData(),
        })
    }

    renderOrderTabBar = (data) => {
        if (!data && data.length <= 0) {
            return;
        }
        let orderTabBar = data.map((obj, index) => {
            if (!obj) {
                return;
            }
            return (
                <OrderDetailTab
                    sid = {this.state.store.sid}
                    key = {'orderTabBar' + obj.status}
                    status = {obj.status}
                    tabLabel = {obj.name}
                    {...this.props}
                />
            );
            
        });
        return orderTabBar;
    }

    render(){
        // status 0 未付款 1 待接单 2 运输中 3 待评价 4 已完成 5 退款申请中 6 退款成功 7 等待取货 8 待收货 9 已关闭
        const { ready, refreshing, companyListData, isRefreshing, navigations } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'订单管理'}
                />                
                {navigations.length > 0 ?
                    <ScrollableTabView
                        initialPage={0}
                        tabBarInactiveTextColor = "#333"
                        tabBarActiveTextColor = {GlobalStyles.themeColor}
                        tabBarUnderlineStyle = {GlobalStyles.tabBarUnderline}
                        renderTabBar = { () => <ScrollableTabBar/>}
                        style = {GlobalStyles.scrollTabBarNav}
                    >
                        {this.renderOrderTabBar(navigations)}
                    </ScrollableTabView>
                    : null
                }
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
                    <View style={styles.homeNavigationCon}>
                        <NavigatorItem
                            navigatorName = {"待接单订单"}
                            navigatorIcon = {GlobalIcons.icon_waitingOrders}
                            onPushNavigator = {() => this.onPushNavigator('待接单订单', 'OrderList', '1')}
                        />
                        <NavigatorItem
                            navigatorName = {"待取货订单"}
                            navigatorIcon = {GlobalIcons.icon_waitingPicked}
                            onPushNavigator = {() => this.onPushNavigator('待取货订单', 'OrderList', '7')}
                        />
                        <NavigatorItem
                            navigatorName = {"进行中订单"}
                            navigatorIcon = {GlobalIcons.icon_waitingProcessing}
                            onPushNavigator = {() => this.onPushNavigator('进行中订单', 'OrderList', '2')}
                        />
                        <NavigatorItem
                            navigatorName = {"待收货订单"}
                            navigatorIcon = {GlobalIcons.icon_waitingReceiving}
                            onPushNavigator = {() => this.onPushNavigator('待收货订单', 'OrderList', '8')}
                        />
                        <NavigatorItem
                            navigatorName = {"已完成订单"}
                            navigatorIcon = {GlobalIcons.icon_completed}
                            onPushNavigator = {() => this.onPushNavigator('已完成订单', 'OrderList', '4')}
                        />
                        <NavigatorItem
                            navigatorName = {"已取消订单"}
                            navigatorIcon = {GlobalIcons.icon_cancel}
                            onPushNavigator = {() => this.onPushNavigator('已取消订单', 'OrderList', '6')}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}


export class OrderDetailTab extends Component {

    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state =  {
            sid: global.store.storeData.sid,
            status: params ? params.orderStatus : '1',
            name: '',
            ready: false,
            loadMore: false,
            refreshing: false,
            orderListData: [],
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.freshNetData();
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
        this.props.navigation.state.params.reloadData();
        this.props.navigation.goBack();
    }

    updateState= (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = (page) => {
        // status 0 未付款 1 待接单 2 运输中 3 待评价 4 已完成 5 退款申请中 6 退款成功 7 等待取货 8 待收货 9 已关闭
        let {sid, status} = this.state;
        let url = NetApi.orderList + sid + '/status/' + status + '/page/' + page;
        return this.netRequest.fetchGet(url, true)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error);
                toastShort('error');
            })
    };

    dropLoadMore = async () => {
        // let result = await this.loadNetData(0);
        // if (result && result.code == 1) {
        //     this.setState({
        //         serviceListData: result.data.service
        //     })
        // } else {
        //     toastShort(result.msg);
        // }  
    };

    freshNetData = async () => {
        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.setState({
                orderListData: result.data.order
            })
        } else {
            toastShort(result.msg);
        }  
    };

    onSubmitSearch = () => {

    }

    onPushNavigator = (webTitle, component) => {
        const { navigate } = this.props.navigation;
        // console.log(123);
        navigate(component, {
            webTitle: webTitle,
            reloadData: () => this.freshNetData(),
        })
    }

    renderServiceItem = (item) => {
        return (
            <OrderItem
                item = {item}
                {...this.props}
                reloadData = {() => this.freshNetData()}
                onPushToBusiness = {()=> this.onPushToBusiness()}
            />
        )
    }

    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>为您找到的物流公司</Text>
                <View style={styles.sortView}>
                    <Text style={styles.sortTips}>排序</Text>
                </View>
            </View>
        )
    }

    renderFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        return (
            <TouchableOpacity
                style = {GlobalStyles.listAddBtnView}
                onPress = {() => this.onPushNavigator('添加服务', 'MineEmployeeAdd')}
            >
                <Image source={GlobalIcons.icon_add} style={GlobalStyles.listAddBtnIcon} />
            </TouchableOpacity>
        )
    }

    renderEmptyView = () => {
        return <EmptyComponent emptyTips={'对不起，当前暂无相关订单'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    render(){
        const { ready, refreshing, orderListData } = this.state;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {orderListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderServiceItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderHeaderView}
                        // ListFooterComponent = {this.renderFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }                
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
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
    },
    leftButtonItem: {},
    leftButtonItemName: {
        fontSize: 14,
        color: '#fff',
        marginHorizontal: 2,
    },
    homeNavigationView: {
    },
    homeNavigationCon: {
        flex: 1,
        flexWrap: 'wrap',
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
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
