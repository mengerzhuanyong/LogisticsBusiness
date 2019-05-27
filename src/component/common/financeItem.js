/**
 * 速芽物流商家端 - FinanceItem
 * http://menger.me
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

export default class FinanceItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.item,
            index: this.props.item.index,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        // item: HomeNavigation
    }

    componentDidMount() {
        // consoleLog("参数传递", this.props.item);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            item: nextProps.item.item
        })
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {
        
    }

    renderShopServices = (data) => {
        
        // consoleLog('商店服务', data);
        if(data.length <= 0) {
            return null;
        }
        let routers = data.map((obj,index)=>{
            return (
                <Text key = {"services"+index} style={styles.shopRouterCon}>{obj.router}</Text>
            )
        });
        return routers;
    }

    render(){
        const { item, index } = this.state;
        // console.log(item);
        const { onPushToBusiness } = this.props;
        return (
            <View style = {styles.container}>
                <View style={styles.leftView}>
                    <Text style={styles.balanceTitle}>{item.style}</Text>
                    <Text style={styles.balance}>余额：{item.balance}</Text>
                </View>
                <View style={styles.shopStarView}>
                    <Text style={styles.shopStarTitle}>{item.createtime}</Text>
                    <Text style={styles.shopStarNum}>{item.price}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    shopAlbumView: {
        width: 80,
        height: 80,
        overflow: 'hidden',
        position: 'relative',
    },
    shopTopIcon: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        zIndex: 2,
        height: 40,
    },
    shopThumbnail: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
    },
    shopInfoView: {
        width: GlobalStyles.width - 120,
    },
    shopInfoItem: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shopName: {
        fontSize: 16,
    },
    shopTagsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shopTagsIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    shopTagsName: {
        fontSize: 12,
        marginLeft: 5,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        color: GlobalStyles.themeColor,
        borderColor: GlobalStyles.themeColor,
    },
    shopStarView: {
        // flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    shopStarTitle: {
        fontSize: 13,
        color: '#666',
    },
    shopStarCon: {
        marginTop: 10,
    },
    shopStarIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    shopStarNum: {
        fontSize: 18,
        color: '#888',
        marginTop: 10,
    },
    balanceTitle: {
        fontSize: 15,
        color: '#666',
    },
    balance: {
        fontSize: 13,
        color: '#555',
        marginTop: 10,
    },
    shopDiscountView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopDiscountTitle: {
        padding: 1,
        fontSize: 12,
        borderWidth: 1,
        marginRight: 10,
        color: GlobalStyles.themeColor,
        borderColor: GlobalStyles.themeColor,
    },
    shopDiscountCon: {
        color: GlobalStyles.themeColor,
    },
    shopRouterView: {},
    shopRouterCon: {
        color: '#888'
    },
    shopRouterBtn: {},
    shopRouterBtnItem: {
        color: GlobalStyles.themeColor
    },
});