/**
 * 速芽物流商家端 - EmployeeItem
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
import ModalView from '../../util/utilsDialogs'

const MODAL_CONFIG = {
    title: '删除提醒',
    modalText: '删除后将无法恢复，您确定要删除吗？',
    cancelBtnName: '取消',
    confirmBtnName: '确定',
};

export default class EmployeeItem extends Component {

    constructor(props){
        super(props);
        this.state = {
            item: this.props.item.item,
            index: this.props.item.index,
            modalShow: false,
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

    showModalView = () => {
        this.setState({
            modalShow: !this.state.modalShow
        })
    }

    loadNetData = () => {
        
    };

    deleteStaff = () => {
        this.showModalView();
        let {item} = this.state;
        let url = NetApi.staffDel + item.id;
        this.netRequest.fetchGet(url)
            .then(result => {
                toastShort(result.msg);
                if (result && result.code == 1) {
                    this.props.reloadData();
                }
            })
            .catch(error => {
                toastShort('error');
            })
    }

    onPushEdit = (item) => {
        // console.log(123);
        const { navigate } = this.props.navigation;
        navigate('MineEmployeeEdit', {
            item: item,
            reloadData: () => this.props.reloadData(),
        });
    };

    render(){
        const { item, index, modalShow } = this.state;
        const { onPushToBusiness, onPushEdit } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.shopInfoItem}>
                    <Text style={styles.shopName}>{item.name}</Text>
                </View>
                {modalShow && <ModalView
                    show = {modalShow}
                    title = {MODAL_CONFIG.title}
                    contentText = {MODAL_CONFIG.modalText}
                    cancelBtnName = {MODAL_CONFIG.cancelBtnName}
                    confirmBtnName = {MODAL_CONFIG.confirmBtnName}
                    cancelFoo = {() => this.showModalView()}
                    confirmFoo = {() => this.deleteStaff()}
                />}
                <View style={styles.shopInfoItem}>
                    <TouchableOpacity
                        style = {styles.servicesBtnItem}
                        onPress = {onPushEdit}
                    >
                        <Text style={styles.shopRouterBtnItem}>修改</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.servicesBtnItem}
                        onPress = {() => this.showModalView()}
                    >
                        <Text style={styles.shopRouterBtnItem}>删除</Text>
                    </TouchableOpacity>
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
    servicesBtnItem: {
        marginLeft: 10,
    },
    shopRouterBtnItem: {
        color: GlobalStyles.themeColor
    },
});