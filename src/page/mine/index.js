/**
 * 速芽物流商家端 - MINE
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity
} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { NavigationActions } from 'react-navigation'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'
import NavigatorItem from '../../component/mine/navigatorItem'

const ACTION_CONFIG = {
    CANCEL_INDEX: 0,
    DESTRUCTIVE_INDEX: 1,
    options: ['取消', '确定'],
    title: '您确定要退出吗？',
};

export default class Mine extends Component {

    constructor(props) {
        super(props);
        this.state = {
            store: global.store ? global.store.storeData : '',
            storeData: '',
            isRefreshing: false,
            canBack: false,
        }
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
        let {store} = this.state;
        let url = NetApi.mine + store.sid;
        this.netRequest.fetchGet(url, true)
            .then(result => {
                if (result && result.code == 1) {
                    this.setState({
                        storeData: result.data
                    })
                } else {
                    toastShort(result.msg);
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    onPushNavigator = (webTitle, compent) => {
        const { navigate } = this.props.navigation;
        // console.log(navigate);
        if (this.state.storeData.status == 0) {
            toastShort('对不起，您的账号还未通过审核，暂时无法使用该功能！', 'center');
            return;
        }
        navigate(compent, {
            webTitle: webTitle,
            item: this.state.storeData,
            reloadData: () => this.loadNetData(),
        })
    }

    doLogOut = (index) => {
        if (index === 1) {
            let url = NetApi.logOut;
            this.netRequest.fetchGet(url)
                .then( result => {
                    // console.log(result);
                    this.removeLoginState();
                    if (result && result.code == 1) {
                        toastShort("退出成功");
                    }
                })
                .catch( error => {
                    // console.log('退出失败，请重试！', error);
                })
        }

    }

    removeLoginState = () => {
        storage.remove({
            key: 'loginState',
        });
        global.store.loginState = false;
        global.store.storeData = '';
        this.timer = setTimeout(() => {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'Login'})
                ]
            })
            this.props.navigation.dispatch(resetAction)
        }, 500);
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    render(){
        let {storeData, isRefreshing, store} = this.state;
        console.log(storeData);
        return (
            <ScrollView
                style={styles.container}
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
                <View style={styles.mineTopContainer}>
                    <Image style={styles.backgroundImages} source={GlobalIcons.images_bg_finance} />
                    <View style={styles.mineInfoView}>
                        <View style={styles.userPhotoView}>
                            <Image style={styles.userPhoto} source={storeData.logo ? {uri: storeData.logo} : GlobalIcons.images_user_photo} />
                        </View>
                        <View style={styles.userInfoDetail}>
                            <Text style={styles.userInfoName}>{storeData.name}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.mineNavigatorContainer}>
                    {store.isStore == 1 && <NavigatorItem
                        leftIcon = {GlobalIcons.icon_mine_crash}
                        leftTitle = {'押金'}
                        onPushNavigator = {() => this.onPushNavigator('押金', 'MineDepositIndex')}
                    />}
                    {store.isStore == 1 && <View style={[GlobalStyles.horLine, styles.horLine]} />}
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_mine_userinfo}
                        leftTitle = {'门店信息'}
                        onPushNavigator = {() => this.onPushNavigator('门店信息', 'MineInfoSetting')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_mine_discount}
                        leftTitle = {'优惠信息'}
                        onPushNavigator = {() => this.onPushNavigator('优惠信息', 'MineDiscount')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_mine_feedback}
                        leftTitle = {'用户反馈'}
                        onPushNavigator = {() => this.onPushNavigator('用户反馈', 'MineFeedBack')}
                    />
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_feedback}
                        leftTitle = {'有奖建议'}
                        onPushNavigator = {() => this.onPushNavigator('有奖建议', 'MineFeedBackReward')}
                    />
                </View>
                <View style={{marginVertical: 10,}}>
                    <NavigatorItem
                        leftIcon = {GlobalIcons.icon_setting}
                        leftTitle = {'门店设置'}
                        onPushNavigator = {() => this.onPushNavigator('门店设置', 'MineStoreSetting')}
                    />
                </View>
                <View style={styles.mineBtnView}>
                    <TouchableOpacity
                        style = {GlobalStyles.btnView}
                        onPress = {() => {this.showActionSheet()}}
                    >
                        <Text style={GlobalStyles.btnItem}>退出登录</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.wrapper}>
                    <ActionSheet
                        ref = {o => this.ActionSheet = o}
                        title = {ACTION_CONFIG.title}
                        options = {ACTION_CONFIG.options}
                        cancelButtonIndex = {ACTION_CONFIG.CANCEL_INDEX}
                        destructiveButtonIndex = {ACTION_CONFIG.DESTRUCTIVE_INDEX}
                        onPress = {this.doLogOut}
                    />
                </View>        
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {
        marginVertical: 8,
    },
    mineTopContainer: {
        // paddingBottom: 20,
        position: 'relative',
        backgroundColor: '#fff',
        height: 210,
    },
    backgroundImages: {
        position: 'absolute',
        top: 0,
        width: GlobalStyles.width,
        height: 210,
    },
    mineInfoView: {
        paddingVertical: 50,
        // flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userPhotoView: {
        width: 100,
        height: 100,
        borderWidth: 5,
        borderRadius: 50,
        overflow: 'hidden',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderColor: '#ddd',
    },
    userPhoto: {
        width: 90,
        height: 90,
        resizeMode: 'cover',
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
        paddingBottom: 8,
        backgroundColor: '#fff',
    },
    mineBtnView: {
        marginVertical: 40,
    },
});
