/**
 * 速芽物流商家端 - NAVIGATOR
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    View,
} from 'react-native'
import {StackNavigator, TabNavigator, TabBarBottom, NavigationActions} from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import GlobalStyles from '../constant/GlobalStyle'
import GlobalIcons from '../constant/GlobalIcon'

import stroage from '../store'
import '../store/Global'
import { consoleLog } from '../util/utilsToast'


import TabBarItem from '../component/common/TabBarItem'

import Test from '../test'
import Home from '../page/home'
import Order from '../page/order'
import Mine from '../page/mine'

import WebViewPage from '../page/common/webview'
import CommonWeb from '../page/common/commonWeb'

import UserContact from '../page/home/userContact'


import Login from '../page/login'
import Register from '../page/login/register'
import RegisterUser from '../page/login/registerUser'
import RegisterCompany from '../page/login/registerCompany'
import Repassword from '../page/login/repassword'
import Protocol from '../page/common/protocol'


import OrderList from '../page/order/orderList'
import OrderPayment from '../page/order/orderPayment'
import OrderDetail from '../page/order/orderDetail'
import OrderComment from '../page/order/orderComment'

import Cooperate from '../page/cooperate'

import MineCoupon from '../page/mine/mineCoupon'
import MineFeedBack from '../page/mine/mineFeedBack'
import MineFeedBackReward from '../page/mine/mineFeedBackReward'
import MineInfoSetting from '../page/mine/mineInfoSetting'
import MineAddressList from '../page/mine/mineAddressList'
import MineAddressAdd from '../page/mine/mineAddressAdd'
import MineAddressEdit from '../page/mine/mineAddressEdit'
import MineCollect from '../page/mine/mineCollect'
import MineFinance from '../page/mine/mineFinance'
import MineFinanceWithdraw from '../page/mine/mineFinanceWithdraw'
import MineFinanceWithdrawSuccess from '../page/mine/mineFinanceWithdrawSuccess'
import MineDepositIndex from '../page/mine/mineDepositIndex'
import MineDeposit from '../page/mine/mineDeposit'
import MineDeposit2 from '../page/mine/mineDeposit2'
import MineDiscount from '../page/mine/mineDiscount'
import MineStoreNote from '../page/mine/mineStoreNote'
import MineStoreSetting from '../page/mine/mineStoreSetting'

import MineEmployee from '../page/mine/mineEmployee'
import MineEmployeeAdd from '../page/mine/mineEmployeeAdd'
import MineEmployeeEdit from '../page/mine/mineEmployeeEdit'
import MineDriver from '../page/mine/mineDriver'
import MineDriverAdd from '../page/mine/mineDriverAdd'
import MineDriverEdit from '../page/mine/mineDriverEdit'

import SverviceList from '../page/service/index'
import ServicesAdd from '../page/service/servicesAdd'
import ServicesEdit from '../page/service/servicesEdit'
// import BusinessDetail from '../page/service/businessDetail'

import Flow from '../page/flow'


const TabNavScreen = TabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: '首页',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_home}
                        selectedImage = {GlobalIcons.icon_tabbar_home_cur}
                    />
                ),
            }),
        },
        Order: {
            screen: Order,
            navigationOptions: ({ navigation }) => ({
                // header: null,
                title: '订单管理',
                tabBarLabel: '订单管理',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_order}
                        selectedImage = {GlobalIcons.icon_tabbar_order_cur}
                    />
                ),
            }),
        },
        Mine: {
            screen: Mine,
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarLabel: '个人中心',
                tabBarIcon: ({focused, tintColor}) => (
                    <TabBarItem
                        subScript = {false}
                        tintColor = {tintColor}
                        focused = {focused}
                        normalImage = {GlobalIcons.icon_tabbar_mine}
                        selectedImage = {GlobalIcons.icon_tabbar_mine_cur}
                    />
                ),
            }),
        },
    },
    {
        initialRouteName: 'Home',
        // initialRouteName: 'Order',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        tabBarOptions: {
            activeTintColor: '#42b3ff',
            inactiveTintColor: '#808080',
            style: { backgroundColor: '#ffffff' },
            labelStyle: { fontSize: 12, marginBottom: 4,}
        },
    }

);

const App = StackNavigator(
    {
        TabNavScreen: {
            screen: TabNavScreen
        },
        Protocol: {
            screen: Protocol
        },
        Test: {
            screen: Test
        },
        WebViewPage: {
            screen: WebViewPage,
        },
        CommonWeb: {
            screen: CommonWeb,
        },
        UserContact: {
            screen: UserContact,
        },
        Login: {
            screen: Login,
        },
        Register: {
            screen: Register,
        },
        RegisterUser: {
            screen: RegisterUser,
        },
        RegisterCompany: {
            screen: RegisterCompany,
        },
        Repassword: {
            screen: Repassword,
        },
        SverviceList: {
            screen: SverviceList,
        },
        ServicesAdd: {
            screen: ServicesAdd,
        },
        ServicesEdit: {
            screen: ServicesEdit,
        },
        // BusinessDetail: {
        //     screen: BusinessDetail,
        // },
        Flow: {
            screen: Flow,
        },
        OrderList: {
            screen: OrderList,
        },
        OrderPayment: {
            screen: OrderPayment,
        },
        OrderDetail: {
            screen: OrderDetail,
        },
        OrderComment: {
            screen: OrderComment,
        },
        MineCoupon: {
            screen: MineCoupon,
        },
        MineFeedBack: {
            screen: MineFeedBack,
        },
        MineFeedBackReward: {
            screen: MineFeedBackReward,
        },
        MineInfoSetting: {
            screen: MineInfoSetting,
        },
        MineAddressList: {
            screen: MineAddressList,
        },
        MineAddressAdd: {
            screen: MineAddressAdd,
        },
        MineAddressEdit: {
            screen: MineAddressEdit,
        },
        MineCollect: {
            screen: MineCollect,
        },
        MineFinance: {
            screen: MineFinance,
        },
        MineFinanceWithdraw: {
            screen: MineFinanceWithdraw,
        },
        MineFinanceWithdrawSuccess: {
            screen: MineFinanceWithdrawSuccess,
        },
        MineDepositIndex: {
            screen: MineDepositIndex,
        },
        MineDeposit: {
            screen: MineDeposit,
        },
        MineDeposit2: {
            screen: MineDeposit2,
        },
        MineDiscount: {
            screen: MineDiscount,
        },
        MineEmployee: {
            screen: MineEmployee,
        },
        MineEmployeeAdd: {
            screen: MineEmployeeAdd,
        },
        MineEmployeeEdit: {
            screen: MineEmployeeEdit,
        },
        MineDriver: {
            screen: MineDriver,
        },
        MineDriverAdd: {
            screen: MineDriverAdd,
        },
        MineDriverEdit: {
            screen: MineDriverEdit,
        },
        MineStoreNote: {
            screen: MineStoreNote,
        },
        MineStoreSetting: {
            screen: MineStoreSetting,
        },
    },
    {
        mode: 'card',
        headerMode: 'screen',
        // initialRouteName: 'TabNavScreen',
        // initialRouteName: 'OrderDetail',
        // initialRouteName: 'ServicesAdd',
        initialRouteName: 'Login',
        // initialRouteName: 'MineFinanceWithdrawSuccess',
        navigationOptions: ({navigation, screenProps}) => ({
            gesturesEnabled: true,
            header: null,
            headerBackTitle: null,
            headerTintColor: GlobalStyles.themeColor,
            headerStyle: {
                backgroundColor: '#fff',
            },
            showIcon: true,
            headerTitleStyle: {
                alignSelf: 'center',
            },
            headerRight: (
                <View />
            ),
        }),
        // transitionConfig:()=>({
        //     screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        // }),
    }
);
const defaultGetStateForAction = App.router.getStateForAction;

App.router.getStateForAction = (action, state) => {
    if (action.routeName === 'Mine' && !global.store.loginState || action.routeName === 'Home' && !global.store.loginState) {
        this.routes = [
            ...state.routes,
            {
                key: 'id-' + Date.now(),
                routeName: 'Login',
                params: {
                    name: 'name1'
                }
            },
        ];
        return {
            ...state,
            routes,
            index: this.routes.length - 1,
        };
    }
    return defaultGetStateForAction(action, state);
};

export default App;