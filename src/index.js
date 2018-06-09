/**
 * 速芽物流商家端 - App主页面
 * https://menger.me
 * @大梦
 */

import React, { Component } from 'react'
import { Image, Platform, InteractionManager } from 'react-native'
import AppNavigation from './router'
import {NavigationActions} from "react-navigation"
import SplashScreen from 'react-native-splash-screen'
import * as CustomKeyboard from 'react-native-yusha-customkeyboard'
import * as wechat from 'react-native-wechat'

import GlobalStyles from './constant/GlobalStyle'
import GlobalIcons from './constant/GlobalIcon'
import NetRequest from './util/utilsRequest'
import NetApi from './constant/GlobalApi'
import {toastShort, consoleLog} from './util/utilsToast'


export default class Index extends Component {

    constructor(props) {
        super(props);
        this.state =  {
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
        wechat.registerApp(NetApi.wechatAppid);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
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