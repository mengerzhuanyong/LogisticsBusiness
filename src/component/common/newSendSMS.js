/**
 * 汇了金融 - SendSMS
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import GlobalStyles from '../../constant/GlobalStyle'
import {VerticalLine} from '../../component/common/commonLine'
import NetRequest from "../../util/utilsRequest";
import NetApi from "../../constant/GlobalApi";
import {toastShort} from "../../util/utilsToast";
import {clearAllTimeout} from "../../util/utilsTool";
import {checkPhone} from "../../util/utilsRegularMatch";

export default class SendSMS extends Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds: 60,
            mobile: this.props.mobile,
            secureTextEntry: true,
            codeAlreadySend: false,
        };
        this.netRequest = new NetRequest();
        this.lastActionTime = 0;
    }

    static defaultProps = {
        type: 'public',
        mobile: '',
        btnViewStyle: null,
        btnStyle: null,
        lineStyle: null,
    };

    componentWillReceiveProps(nextProps){
        this.setState({
            mobile: nextProps.mobile
        })
    }

    componentWillUnmount() {
        this.timerInterval && clearInterval(this.timerInterval);
    }

    sendSMS = (mobile, type) => {
        // console.log(mobile);
        if (!mobile) {
            toastShort('手机号不能为空', 'center');
            return false;
        }
        if (!checkPhone(mobile)) {
            toastShort('phone', 'center');
            return;
        }
        let url = type === 'register' ? NetApi.sendSMS : NetApi.sendPubSMS;
        let smsType = type === 'register' ? 1 : 0;
        let data = {
            type: smsType,
            mobile: mobile,
        };
        // this.countDownTimer();
        // console.log(url, data);
        // return;
        this.netRequest.fetchPost(url, data)
            .then( result => {
                if (result && result.code == 1) {
                    this.countDownTimer();
                    toastShort('验证码已发送，请注意查收！', 'center');
                }else{
                    toastShort(result.msg, 'center');
                }
                // console.log('验证码', result);
            })
            .catch( error => {
                toastShort('服务器请求失败，请稍后重试！', 'center');
                // console.log('登录出错', error);
            })
    };

    // 验证码倒计时
    countDownTimer(){
        this.setState({
            codeAlreadySend: true,
            seconds: 60,
        });
        this.timerInterval = setInterval(() => {
            if (this.state.seconds === 0) {
                return clearInterval(this.timerInterval);
            }

            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000)
    };

    render(){
        let {type, btnViewStyle, btnStyle, lineStyle} = this.props;
        let {mobile, seconds, codeAlreadySend} = this.state;
        if (!codeAlreadySend) {
            return (
                <TouchableOpacity
                    style={[styles.btnGetCodeView, btnViewStyle]}
                    onPress={() => this.sendSMS(mobile, type)}
                >
                    <VerticalLine lineStyle={[styles.verLine, lineStyle]}/>
                    <Text style={[styles.btnGetCodeCon, btnStyle]}>获取验证码</Text>
                </TouchableOpacity>
            );
        } else if (seconds === 0) {
            return (
                <TouchableOpacity
                    style={[styles.btnGetCodeView, btnViewStyle]}
                    onPress={() => this.sendSMS(mobile, type)}
                >
                    <VerticalLine lineStyle={[styles.verLine, lineStyle]}/>
                    <Text style={[styles.btnGetCodeCon, btnStyle]}>重新获取</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={[styles.btnGetCodeView, btnViewStyle]}>
                    <VerticalLine lineStyle={[styles.verLine, lineStyle]}/>
                    <Text style={[styles.btnGetCodeCon, btnStyle]}>剩余{seconds}秒</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    btnGetCodeView: {
        width: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnGetCodeCon: {
        fontSize: 12,
        color: GlobalStyles.themeColor
    },
    verLine: {
        height: 15,
        marginRight: 10,
        backgroundColor: GlobalStyles.themeColor,
    },
});