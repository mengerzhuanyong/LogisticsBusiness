/**
 * 速芽物流商家端 - BusinessItem
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

export default class BusinessItem extends Component {

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
        const { onPushToBusiness } = this.props;
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {onPushToBusiness}
            >
                <View style={styles.shopAlbumView}>
                    {item.istop == 1 && <Image source={GlobalIcons.icon_top} style={styles.shopTopIcon} />}
                    <Image source={GlobalIcons.banner1} style={styles.shopThumbnail} />
                </View>
                <View style={styles.shopInfoView}>
                    <View style={styles.shopInfoItem}>
                        <Text style={styles.shopName}>{item.name}</Text>
                        <View style={styles.shopTagsView}>{this.renderShopTags(item.tags)}</View>
                    </View>
                    <View style={styles.shopInfoItem}>
                        <View style={styles.shopStarView}>
                            <Text style={styles.shopStarTitle}>评分：</Text>
                            <View style={GlobalStyles.shopStarCon}>{this.renderStar(item.star)}</View>
                            <Text style={styles.shopStarNum}>{item.star.tens_digit}.{item.star.digits}</Text>
                        </View>
                        <Text style={styles.shopDistance}>{item.distance}</Text>
                    </View>
                    <View style={styles.shopInfoItem}>
                        <View style={styles.shopDiscountView}>
                            <Text style={styles.shopDiscountTitle}>惠</Text>
                            <Text style={styles.shopDiscountCon}>{item.disinfo}</Text>
                        </View>
                    </View>
                    <View style={styles.shopInfoItem}>
                        <View style={styles.shopRouterView}>
                            {this.renderShopServices(item.services)}
                        </View>
                        <TouchableOpacity style={styles.shopRouterBtn}>
                            <Text style={styles.shopRouterBtnItem}>更多路线</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    shopStarTitle: {
        color: '#333',
    },
    shopStarCon: {},
    shopStarIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
    },
    shopStarNum: {
        marginLeft: 10,
        color: '#f00',
    },
    shopDistance: {
        fontSize: 12,
        color: '#888',
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