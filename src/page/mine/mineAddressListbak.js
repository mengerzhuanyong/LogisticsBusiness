/**
 * 速芽物流商家端 - MineAddressList
 * http://menger.me
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

import OrderItemView from '../../component/order/orderItem'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import AddressItem from '../../component/mine/addressItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineAddressList extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            ready: false,
            loadMore: false,
            refreshing: false,
            companyListData: [],
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

    }

    dropLoadMore = () => {}

    freshNetData = () => {}

    renderCompanyItem = (item) => {
        return (
            <AddressItem
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

    render(){
        const { ready, refreshing, companyListData } = this.state;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {params.webTitle}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {companyListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCompanyItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        // ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderHeaderView}
                        ListFooterComponent = {this.renderFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, styles.btnView]}
                        onPress = {()=>this.submitPayment()}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>新建发货地址</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    orderPayTitleView: {
        height: 70,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    orderPayTitleName: {
        fontSize: 18,
        color: '#444',
    },
    orderPayTitleCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderPaymentNum: {
        fontSize: 26,
        textAlignVertical: 'bottom',
        color: GlobalStyles.themeColor,
    },
    orderPaymentUnit: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5,
    },
    paymentMethodView: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    paymentMethodItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentMethodIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    fixedBtnView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    btnView: {
        borderRadius: 5,
    },
    btnItem: {
        fontSize: 18,
    },
});