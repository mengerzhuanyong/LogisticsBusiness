/**
 * 速芽物流商家端 - OrderItem
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import {toastShort, consoleLog} from '../../util/utilsToast'

export default class OrderItem extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.loadNetData();
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
        const { onPushToOrderDetail, onPushToOrderComment } = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.orderItemView}>
                    <View style={[styles.orderItemInfo, styles.orderItemTitle]}>
                        <Text style={styles.orderItemInfoCompany}>申通物流</Text>
                        <Text style={styles.orderItemInfoStatus}>代付款</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    <View style={[styles.orderItemInfo, styles.orderDetailView]}>
                        <Image source={GlobalIcons.banner1} style={styles.orderGoodsPic} />
                        <View style={styles.orderGoodsInfo}>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsTitle}>发货人：投道科技</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>发货班次：<Text style={styles.orderGoodsLeftViewCon}>黄岛 - 上海</Text></Text>
                                <Text style={styles.orderGoodsRightView}>10-11点班次</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>订单价格：</Text>
                                <Text style={[styles.orderGoodsRightView, styles.orderDetailPrices]}>¥ 50.00</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                        >
                            <Text style={styles.btnItemName}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                            onPress = {onPushToOrderDetail}
                        >
                            <Text style={styles.btnItemName}>查看详情</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {[styles.btnItemView, styles.btnItemViewCur]}
                        >
                            <Text style={[styles.btnItemName, styles.btnItemNameCur]}>去付款</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.orderItemView}>
                    <View style={[styles.orderItemInfo, styles.orderItemTitle]}>
                        <Text style={styles.orderItemInfoCompany}>申通物流</Text>
                        <Text style={styles.orderItemInfoStatus}>已完成</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    <View style={[styles.orderItemInfo, styles.orderDetailView]}>
                        <Image source={GlobalIcons.banner1} style={styles.orderGoodsPic} />
                        <View style={styles.orderGoodsInfo}>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsTitle}>发货人：投道科技</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>发货班次：<Text style={styles.orderGoodsLeftViewCon}>黄岛 - 上海</Text></Text>
                                <Text style={styles.orderGoodsRightView}>10-11点班次</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text style={styles.orderGoodsLeftView}>订单价格：</Text>
                                <Text style={[styles.orderGoodsRightView, styles.orderDetailPrices]}>¥ 50.00</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]}>
                        <Text style={[GlobalStyles.horLine, styles.horLineCon]}></Text>
                    </View>
                    <View style={[styles.orderItemInfo, styles.orderItemBtnView]}>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                        >
                            <Text style={styles.btnItemName}>取消订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {styles.btnItemView}
                            onPress = {onPushToOrderDetail}
                        >
                            <Text style={styles.btnItemName}>查看详情</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style = {[styles.btnItemView, styles.btnItemViewCur]}
                            onPress = {onPushToOrderComment}
                        >
                            <Text style={[styles.btnItemName, styles.btnItemNameCur]}>去评价</Text>
                        </TouchableOpacity>
                    </View>
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
    orderItemView: {
        padding: 15,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    orderItemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderItemTitle: {
        height: 40,
        alignItems: 'center',
    },
    orderItemInfoCompany: {
        fontSize: 14,
        color: '#333',
    },
    orderItemInfoStatus: {
        fontSize: 13,
        color: GlobalStyles.themeColor,
    },
    orderDetailView: {
        paddingVertical: 15,
        position: 'relative',
        justifyContent: 'space-between',
    },
    orderGoodsPic: {
        width: 60,
        height: 60,
        resizeMode: 'cover'
    },
    orderGoodsInfo: {
        width: GlobalStyles.width - 110,
    },
    orderInfoItem: {
        marginVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderGoodsTitle: {
        fontSize: 17,
        color: '#333',
    },
    orderGoodsLeftView: {
        fontSize: 13,
        color: '#555',
    },
    orderGoodsLeftViewCon: {
        fontSize: 13,
        color: '#555',
    },
    orderGoodsRightView: {
        fontSize: 13,
        color: '#555',
    },
    orderDetailPrices: {
        fontSize: 16,
        color: '#f60',
    },
    orderItemBtnView: {
        height: 50,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btnItemView: {
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: '#777',
    },
    btnItemViewCur: {
        borderColor: GlobalStyles.themeColor,
    },
    btnItemName: {
        color: '#555',
        fontSize: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    btnItemNameCur: {
        color: GlobalStyles.themeColor,
    },
});
