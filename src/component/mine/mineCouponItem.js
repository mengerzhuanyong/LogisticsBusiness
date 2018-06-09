/**
 * 速芽物流商家端 - MineCouponItem
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Swiper from 'react-native-swiper'
import {toastShort, consoleLog} from '../../util/utilsToast'
import NetApi from '../../constant/GlobalApi'
import NetRequest from '../../util/utilsRequest'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

export default class MineCouponItem extends Component {

    constructor(props){
        super(props);
        this.state = {};
        this.netRequest = new NetRequest();
    }

    componentDidMount() {
        // consoleLog("接受参数", this.props);
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    render(){
        const { onPushNavigator, leftIcon, leftTitle, rightText } = this.props;
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {onPushNavigator}
            >
                <Image source={GlobalIcons.images_coupon_nouse} style={styles.couponBackgroundImg} />
                <View style={[styles.couponInfoItemView, styles.couponInfoTopView]}>
                    <Text style={styles.couponInfoName}>优惠券</Text>
                    <Text style={styles.couponInfoMoneyInfo}>¥ <Text style={styles.couponInfoMoneyCon}>6.00</Text></Text>
                </View>
                <View style={[styles.couponInfoItemView, styles.couponInfoBottomView]}>
                    <Text style={styles.couponInfoDetail}>限制活动使用时间</Text>
                    <Text style={styles.couponInfoDetail}>有效期至2018/01/20</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        borderRadius: 5,
        marginBottom: 15,
        overflow: 'hidden',
        position: 'relative',
        // paddingHorizontal: 15,
        // backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    couponBackgroundImg: {
        height: 120,
        top: 0,
        resizeMode: 'cover',
        position: 'absolute',
        width: GlobalStyles.width - 30,
    },
    navigationItemView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    couponInfoItemView: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    couponInfoTopView: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: '#123',
    },
    couponInfoName: {
        color: '#fff',
        fontSize: 15,
    },
    couponInfoMoneyInfo: {
        fontSize: 13,
        color: '#fff',
    },
    couponInfoMoneyCon: {
        fontSize: 18,
    },
    couponInfoBottomView: {
        height: 70,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    couponInfoDetail: {
        color: '#777',
        marginRight: 10,
        lineHeight: 25,
    },
});