/**
 * 速芽物流商家端 - App主页面
 * http://menger.me
 * @大梦
 */

import React, { Component } from 'react'
import { Image, Platform, InteractionManager } from 'react-native'
import AppNavigation from './router'
import {NavigationActions} from "react-navigation"
import SplashScreen from 'react-native-splash-screen'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import * as wechat from 'react-native-wechat'
import JPushModule from 'jpush-react-native'

import GlobalStyles from './constant/GlobalStyle'
import GlobalIcons from './constant/GlobalIcon'
import NetRequest from './util/utilsRequest'
import NetApi from './constant/GlobalApi'
import {toastShort, consoleLog} from './util/utilsToast'
import {Geolocation} from 'react-native-baidu-map'
import {checkFloat} from './util/utilsRegularMatch'

const __IOS__ = Platform.OS === 'ios';

export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            lat: '',
            lng: '',
            loginState: false,
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount (){
        this.timer = setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                SplashScreen.hide();
            });
        }, 3000);
        this.registerKeyBoard();
        this.jpushRelative();
        this.getLocation();
        wechat.registerApp(NetApi.wechatAppid);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        JPushModule.clearAllNotifications();
    }

    getLocation = async () => {
        let data = await Geolocation.getCurrentPosition();
        console.log('Geolocation---->', data);
        if (!data) {
            toastShort('定位失败，请稍后重试');
            return;
        }
        let location = checkFloat(data.latitude);
        if (location) {
            global.lat = data.latitude;
            global.lng = data.longitude;
            this.setState({
                lat: data.latitude,
                lng: data.longitude,
            });
            this.postLocation(data.latitude, data.longitude);
        }
    };

    postLocation = async (lat = this.state.lat, lng = this.state.lng) => {
        console.log('lat, lng---->', lat, lng);
        if (this.state.lat !== '') {
            lat = this.state.lat;
            lng = this.state.lng;
        }
        let url = NetApi.postLongitude;
        lng = lng < 0 ? -lng : lng;
        let data = {
            lat: lat,
            lng: lng,
        };
        try {
            let result = this.netRequest.fetchPost(url, data, true);
        } catch (e) {
            console.log('e---->', e);
        }
    }
    
    setBadge() {
        if (__IOS__) {
            JPushModule.setBadge(0, (badgeNumber) => {
                // console.log(badgeNumber);
                // alert(badgeNumber);
            })
        }
    }

    jumpSecondActivity = () => {
        // console.log('jump to SecondActivity');
        // this.props.navigation.navigate('Mine');
    }

    jpushRelative = () => {
        if (Platform.OS === 'android') {
            JPushModule.initPush()
            JPushModule.getInfo(map => {
                this.setState({
                    appkey: map.myAppKey,
                    imei: map.myImei,
                    package: map.myPackageName,
                    deviceId: map.myDeviceId,
                    version: map.myVersion
                })
            })
            JPushModule.notifyJSDidLoad(resultCode => {
                if (resultCode === 0) {}
            })
        }
        __IOS__ && this.setBadge();
        // JPushModule.addReceiveCustomMsgListener(map => {
        //     // this.setState({
        //     //     pushMsg: map.message
        //     // })
        //     // console.log('extras: ' + map.extras)
        // })

        JPushModule.addReceiveNotificationListener(map => {
            // console.log('alertContent: ' + map.alertContent)
            // console.log('extras: ' + map.extras)
            // var extra = JSON.parse(map.extras);
            // console.log(extra.key + ": " + extra.value);
        })

        JPushModule.addReceiveOpenNotificationListener(map => {
            // console.log('Opening notification!')
            // console.log('map.extra: ' + map.extras)
            // this.jumpSecondActivity();
            __IOS__ && this.setBadge();
            // JPushModule.jumpToPushActivity("SecondActivity");
        })

        JPushModule.addGetRegistrationIdListener(registrationId => {
            // console.log('Device register succeed, registrationId ' + registrationId)
        })
    }

    registerKeyBoard = () => {
        CustomKeyboard.keyBoardAPI('numberKeyBoard')(class extends Component{
            static getKeyBoardIcon = () => {
                return <Image source={GlobalIcons.anquanbaohu} style={GlobalStyles.keyBoardIcon}/>
            }

            static getKeyBoardName = () => {
                return "安全键盘"
            }

            render() {
                return (
                    <CustomKeyboard.NumberKeyBoardView
                        keyboardType={"number-pad"}
                        disableOtherText={true}
                        disableDot={true}
                        {...this.props}
                    />
                )
            }
        })
        CustomKeyboard.keyBoardAPI('numberKeyBoardWithDot')(class extends Component{
            static getKeyBoardIcon = () => {
                return <Image source={GlobalIcons.anquanbaohu} style={GlobalStyles.keyBoardIcon}/>
            }

            static getKeyBoardName = () => {
                return "安全键盘"
            }

            render() {
                return (
                    <CustomKeyboard.NumberKeyBoardView
                        keyboardType={"number-pad"}
                        disableOtherText={true}
                        {...this.props}
                    />
                )
            }
        })
    }

    render() {
        return (
            <AppNavigation />
        );
    }
};