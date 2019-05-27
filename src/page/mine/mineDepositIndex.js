/**
 * 速芽物流商家端 - MineDepositIndex
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
import BusinessItem from '../../component/common/businessItem'
import FinanceItem from '../../component/common/financeItem'
import NavigatorItem from '../../component/mine/navigatorItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineDepositIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            loadMore: false,
            refreshing: false,
            // companyListData: '',
            companyListData: [],
            store: global.store.storeData,
            deposit: {name: '保证金', money: '', status: '', style: '1'},
            topDeposit: {name: '扶持费用', money: '', status: '', style: '2'},
            rankDeposit: {name: '申请优质商家', money: '', status: '', style: '4'},
            canBack: false,
            remark: '',
            tips: '',
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
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    };

    loadNetData = () => {
        let url = NetApi.mineDeposit + this.state.store.sid;
        this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                this.setState({
                    remark: result.data.remark,
                    tips: result.data.tips || '',
                    deposit: result.data.deposit,
                    topDeposit: result.data.topDeposit,
                    rankDeposit: result.data.rankDeposit,
                })
            })
    };

    onPushNavigator = (webTitle, component, item) => {
        const {navigate} = this.props.navigation;
        // console.log(navigate);
        // item.status = 1;
        navigate(component, {
            webTitle: webTitle,
            item: item,
            remark: this.state.remark,
            tips: this.state.tips,
            reloadData: () => this.loadNetData(),
        })
    };

    render(){
        const { ready, refreshing, companyListData, deposit, topDeposit, rankDeposit } = this.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'增值业务'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.mineNavigatorContainer}>
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {deposit.name}
                        rightText = {deposit.status == 1 ? '已交' : '未交'}
                        onPushNavigator = {() => this.onPushNavigator(deposit.name, 'MineDeposit2', deposit)}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {false}
                        leftTitle = {topDeposit.name}
                        // rightText = {topDeposit.status == 1 ? '已交' : '未交'}
                        onPushNavigator = {() => this.onPushNavigator(topDeposit.name, 'MineDeposit', topDeposit)}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        // <View style={[GlobalStyles.horLine, styles.horLine]} />
                        leftIcon = {false}
                        leftTitle = {rankDeposit.name}
                        // rightText = {rankDeposit.status == 1 ? '已交' : '未交'}
                        onPushNavigator = {() => this.onPushNavigator(rankDeposit.name, 'MineDepositApply', rankDeposit)}
                    />
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
    horLine: {
        marginVertical: 10,
    },
    mineNavigatorContainer: {
        marginTop: 10,
        backgroundColor: '#fff',
    }
});
