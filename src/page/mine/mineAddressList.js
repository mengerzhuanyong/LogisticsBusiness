/**
 * 速芽物流用户端 - MineAddressList
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Alert,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import OrderItemView from '../../component/order/orderItem'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import EmptyComponent from '../../component/common/EmptyComponent'
import AddressItem from '../../component/mine/addressItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineAddressList extends Component {

    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        this.state =  {
            sid: global.store.storeData.sid,
            ready: false,
            showFoot: 0,
            loadMore: false,
            error: false,
            errorInfo: "",
            refreshing: false,
            manageAddress: false,
            storeListData: [],
            // storeListData: [],
            PAGE_FLAG: params.PAGE_FLAG != '' ? params.PAGE_FLAG : '',
            updateContent: params.updateContent ? params.updateContent : () => {},
            // PAGE_FLAG: '',
            // updateContent: '',
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    /**
     * 初始化状态
     * @type {Boolean}
     */
    page = -1;
    totalPage = 0;
    loadMore = false;
    refreshing = false;

    async componentDidMount(){
        // await this.dropLoadMore();
        this.setState({
            ready: true,
            showFoot: 0 // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        })
        this.backTimer = setTimeout(() => {
            this.setState({
                canBack: true
            })
        }, 1000);
    }

    componentWillUnmount(){
        this.backTimer && clearTimeout(this.backTimer);
    }

    onBack = () => {
        const {goBack, state} = this.props.navigation;
        state.params && state.params.reloadData && state.params.reloadData();
        goBack();
    };

    updateState = (state) => {
        if (!this) {
            return;
        };
        this.setState(state);
    }

    onPushToAddressEdit = (item) => {
        item = item.item;
        // console.log(item);
        const { navigate } = this.props.navigation;
        navigate('MineAddressEdit', {
            webTitle: '修改服务点信息',
            item: item,
            reloadData: () => this.freshNetData(),
        });
    }

    onPushToAddressDel = (item) => {
        item = item.item;
        // alert('删除后无法恢复，确认要删除吗？');
       
    }

    submitAddressDel = (data) => {
        // console.log(data);
        let url = NetApi.storeDel + data;
        this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('删除成功', result);
                if (result && result.code == 1) {
                    toastShort(result.msg);
                    this.freshNetData();
                }
            })
            .catch( error => {
                // console.log('删除失败', error);
            })
        // console.log(url);
    }

    loadNetData = (page) => {
        let { sid, style } = this.state;
        let url = NetApi.store + sid + '/page/' + page;
        return this.netRequest.fetchGet(url)
            .then( result => {
                // console.log('', result);
                return result;
            })
            .catch( error => {
                // console.log('', error);
                this.setState({
                    error: true,
                    errorInfo: error
                })
            })
    }

    dropLoadMore = async () => {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot != 0) {
            return;
        }
        if ((this.page != 1) && (this.page >= this.totalPage)) {
            return;
        } else {
            this.page++;
        }
        this.setState({
            showFoot: 2
        })
        let result = await this.loadNetData(this.page);
        // console.log(this.totalPage);
        this.totalPage = result.data.pageSize;
        // console.log(result);
        let foot = 0;
        if (this.page >= this.totalPage) {
            // console.log(this.totalPage);
            foot = 1; //listView底部显示没有更多数据了
        }
        this.setState({
            showFoot: foot,
            storeListData: this.state.storeListData.concat(result.data.store)
            // orderListData: []
        })
    }

    freshNetData = async () => {

        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.page = 0;
            this.setState({
                showFoot: 0
            })
            // console.log(result);
            this.setState({
                storeListData: result.data.store
            })
        }
    }

    renderAddressItem = (item) => {
        // console.log(item);
        return (
            <AddressItem
                item = {item.item}
                {...this.props}
                PAGE_FLAG = {this.state.PAGE_FLAG}
                updateContent = {this.state.updateContent}
                manageAddress = {this.state.manageAddress}
                onPushToAddressEdit = {()=> this.onPushToAddressEdit(item)}
                onPushToAddressDel = {()=> this.onPushToAddressDel(item)}
                reloadData = {() => this.freshNetData()}
            />
        )
    }

    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
                <Text style={styles.titleName}>推荐</Text>
                <View style={[GlobalStyles.horLine, styles.horLine]} />
            </View>
        )
    }

    renderFooterView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }

    renderEmptyView = () => {
        return <EmptyComponent emptyTips={'对不起，您还没有添加过服务点'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    onPushToAddress = () => {
        const { navigate } = this.props.navigation;
        navigate('MineAddressAdd', {
            webTitle: '新增服务点信息',
            reloadData: () => this.freshNetData(),
        });
    }

    manageAddress = () => {
        this.setState({
            manageAddress: !this.state.manageAddress
        })
    }

    renderRightButton = () => {
        if (this.state.storeListData.length <= 0) {
            return <Text />;
        }
        return (
            <TouchableOpacity
                style = {GlobalStyles.rightButton}
                onPress = {() => this.manageAddress()}
            >
                <Text style={GlobalStyles.rightButtonName}>{this.state.manageAddress ? '取消' : '管理'}</Text>
            </TouchableOpacity>
        )
    }

    render(){
        const { ready, refreshing, storeListData } = this.state;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'服务点管理'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                    rightButton = {this.renderRightButton()}
                />
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {storeListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderAddressItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        // ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderHeaderView}
                        ListFooterComponent = {this.renderFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }
                <View style={GlobalStyles.fixedBtnView}>
                    <TouchableOpacity
                        style = {[GlobalStyles.btnView, styles.btnView]}
                        onPress = {()=>this.onPushToAddress()}
                    >
                        <Text style={[GlobalStyles.btnItem, styles.btnItem]}>新增服务点</Text>
                    </TouchableOpacity>
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
    shopListView: {
        marginBottom: 100,
    },
    orderPayTitleView: {
        height: 70,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    orderPayTitleName: {
        fontSize: 18,
        color: '#444',
    },
    orderPayTitleCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderPaymentNum: {
        fontSize: 26,
        textAlignVertical: 'bottom',
        color: GlobalStyles.themeColor,
    },
    orderPaymentUnit: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5,
    },
    paymentMethodView: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    paymentMethodItem: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    paymentMethodTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentMethodIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain',
    },
    paymentMethodTitle: {
        color: '#333',
    },
    fixedBtnView: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    btnView: {
        borderRadius: 5,
    },
    btnItem: {
        fontSize: 18,
    },
});