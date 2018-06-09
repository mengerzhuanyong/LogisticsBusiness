/**
 * 速芽物流商家端 - MineFinance
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
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
import EmptyComponent from '../../component/common/EmptyComponent'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineFinance extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            store: global.store.storeData,
            ready: false,
            loadMore: false,
            refreshing: false,
            accountMoney: '',
            accountDetail: [],
            minMoney: 0,
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    /**
     * 初始化状态
     * @type {Boolean}
     */
    page = -1;
    totalPage = 0;
    loadMore = false;
    refreshing = false;

    componentDidMount(){
        this.freshNetData();
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

    loadNetData = (page) => {
        let {store} = this.state;
        let url = NetApi.mineAccount + store.sid + '/page/' + page;
        return this.netRequest.fetchGet(url, true)
            .then(result => {
                return result;
            })
            .catch(error => {
                toastShort('error');
            })
    }

    dropLoadMore = () => {}

    freshNetData = async () => {
        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.page = 0;
            this.setState({
                minMoney: result.data.minmoney,
                accountMoney: result.data.capital,
                accountDetail: result.data.capital_log,
            })
        } else {
            toastShort(result.msg);
        }
    }

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
        return <EmptyComponent emptyTips={'对不起，您当前暂无资金变动！'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    onPushNavigator = (webTitle, compent) => {
        const { navigate } = this.props.navigation;
        // console.log(navigate);
        navigate(compent, {
            webTitle: webTitle,
            minMoney: this.state.minMoney,
            accountMoney: this.state.accountMoney,
            reloadData: () => this.freshNetData(),
        })
    }

    render(){
        const { ready, refreshing, accountDetail, accountMoney } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'财务管理'}
                    style = {{
                        zIndex: 2,
                        backgroundColor: 'transparent'
                    }}
                    backgroundImage = {false}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.mineTopContainer}>
                    <Image style={styles.backgroundImages} source={GlobalIcons.images_bg_finance} />
                    <View style={styles.mineAccountInfoView}>
                        <Text style={styles.mineAccountInfoTitle}>账户余额（元）</Text>
                        <Text style={styles.mineAccountInfoCon}>{parseFloat(accountMoney).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={styles.mineNavigatorContainer}>
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_wallet}
                        leftTitle = {'提现'}
                        onPushNavigator = {() => this.onPushNavigator('账户提现', 'MineFinanceWithdraw')}
                    />
                </View>
                {ready ?
                    <FlatList
                        style = {styles.flatListView}
                        keyExtractor = { item => item.id}
                        data = {accountDetail}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderListItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent = {this.renderHeaderView}
                        ListFooterComponent = {this.renderFooterView}
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
    mineTopContainer: {
        height: 190,
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
        height: 190,
    },
    mineAccountInfoView: {
        paddingTop: 70,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    mineAccountInfoTitle: {
        fontSize: 16,
        color: '#fff',
    },
    mineAccountInfoCon: {
        fontSize: 45,
        color: '#fff',
        marginTop: 20,
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
        paddingVertical: 10,
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

    }
});
