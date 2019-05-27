/**
 * 速芽物流商家端 - MineCoupon
 * http://menger.me
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

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineCoupon extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            ready: false,
            loadMore: false,
            refreshing: false,
            // companyListData: '',
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

    renderListItem = (item) => {
        return (
            <MineCouponItem
                item = {item}
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
        return (
            <View style={styles.emptyTipsView}>
                <Text style={styles.emptyTipsCon}>您还没有优惠券呢～</Text>
                <TouchableOpacity style={styles.emptyTipsBtnCon}>
                    <Text style={styles.emptyTipsCon}>已使用/过期的优惠券></Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    render(){
        const { ready, refreshing, companyListData } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'Test'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                {ready ?
                    <FlatList
                        style = {styles.flatListView}
                        keyExtractor = { item => item.id}
                        data = {companyListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderListItem(item)}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    flatListView: {
        padding: 15,
        backgroundColor: 'transparent'
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
