/**
 * 速芽物流商家端 - Service
 * https://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import Picker from 'react-native-picker'
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import NavigationButton from '../../component/common/headerRightButton'
import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import EmptyComponent from '../../component/common/EmptyComponent'
import ServiceItem from '../../component/service/serviceItem'

import area from '../../asset/json/area.json'
import ShopData from '../../asset/json/homeBusiness.json'

export default class Service extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            sid: global.store.storeData.sid,
            start: '0',
            end: '0',
            ready: false,
            loadMore: false,
            refreshing: false,
            serviceListData: [],
        };
        this.netRequest = new NetRequest();
    }

    componentDidMount(){
        this.freshNetData();
        this.timer = setTimeout(() => {
            this.setState({
                ready: true
            })
        },600)
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
    };

    loadNetData = (page) => {
        let {sid, start, end} = this.state;
        let url = NetApi.serviceList + sid + '/start/' + start + '/end/' + end + '/page/' + page;
        return this.netRequest.fetchGet(url)
            .then(result => {
                // console.log(result);
                return result;
            })
            .catch(error => {
                // console.log(error);
                toastShort('error');
            })
    };

    dropLoadMore = async () => {
        // let result = await this.loadNetData(0);
        // if (result && result.code == 1) {
        //     this.setState({
        //         serviceListData: result.data.service
        //     })
        // } else {
        //     toastShort(result.msg);
        // }  
    };

    freshNetData = async () => {
        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.setState({
                serviceListData: result.data.service
            })
        } else {
            toastShort(result.msg);
        }  
    };

    onSubmitSearch = () => {
        // let {start, end} = this.state;
        // let url = NetApi.serviceSearch;
        // let data = {
        //     start: start,
        //     end: end,
        // };
        // this.netRequest.fetchPost(url, data)
        //     .then(result => {
        //         // console.log(result);
        //         if (result && result.code == 1) {

        //         } else {
        //             toastShort(result.msg);
        //         }
        //     })
        //     .catch(error => {
        //         toastShort('error');
        //         this.setState({
        //             canPress: true,
        //         });
        //     })
    };

    onPushNavigator = (webTitle, component) => {
        const { navigate } = this.props.navigation;
        // console.log(123);
        navigate(component, {
            webTitle: webTitle,
            reloadData: () => this.freshNetData(),
        })
    };

    onPushToNextPage = (pageTitle, page, params = {}) => {
        let {navigate} = this.props.navigation;
        navigate(page, {
            pageTitle: pageTitle,
            ...params,
        });
    };

    renderServiceItem = (item) => {
        return (
            <ServiceItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness()}
                reloadData = {() => this.freshNetData()}
            />
        )
    };

    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>为您找到的物流公司</Text>
                <View style={styles.sortView}>
                    <Text style={styles.sortTips}>排序</Text>
                </View>
            </View>
        )
    };

    renderFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        return (
            <TouchableOpacity
                style = {GlobalStyles.listAddBtnView}
                onPress = {() => this.onPushNavigator('添加服务', 'ServicesAdd')}
            >
                <Image source={GlobalIcons.icon_add} style={GlobalStyles.listAddBtnIcon} />
            </TouchableOpacity>
        )
    };

    renderEmptyView = () => {
        return <EmptyComponent emptyTips={'对不起，您当前还没有添加相关服'} />;
    };

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine}/>;
    };

    render(){
        const { ready, refreshing, serviceListData } = this.state;
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {params.webTitle}
                    style = {{
                        backgroundColor: '#123',
                    }}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <View style={styles.searchView}>
                    <View style={styles.searchInputView}>
                        <View style={styles.searchInputItemView}>
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeStartIcon]}>
                                <Text style={GlobalStyles.placeText}>发</Text>
                            </View>
                            <TextInput
                                style = {styles.searchInputItem}
                                placeholder = "请输入发货地"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        start: text
                                    })
                                }}
                            />
                        </View>
                        <View style={[GlobalStyles.horLine, styles.horLine]} />
                        <View style={styles.searchInputItemView}>
                            <View style={[GlobalStyles.placeViewIcon, GlobalStyles.placeEndIcon]}>
                                <Text style={GlobalStyles.placeText}>收</Text>
                            </View>
                            <TextInput
                                style = {styles.searchInputItem}
                                placeholder = "请输入目的地"
                                placeholderTextColor = '#888'
                                underlineColorAndroid = {'transparent'}
                                onChangeText = {(text)=>{
                                    this.setState({
                                        end: text
                                    })
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style = {styles.searchBtnView}
                        onPress = {() => this.freshNetData()}
                    >
                        <Text style={styles.searchBtnItem}>确认</Text>
                    </TouchableOpacity>
                </View>
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {serviceListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderServiceItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderHeaderView}
                        ListFooterComponent = {this.renderFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    horLine: {
        marginVertical: 5,
        marginLeft: 20,
    },
    searchView: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    searchInputView: {
        width: GlobalStyles.width - 130,
    },
    searchInputItemView: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputItem: {
        flex: 1,
        height: 40,
    },
    placeText: {
        fontSize: 12,
        color: '#fff',
    },
    searchBtnView: {
        width: 80,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#123',
    },
    searchBtnItem: {
        color: '#666',
        fontSize: 16,
    },
    shopListView: {
        marginTop: 10,
        // backgroundColor: '#fff',
    },
    shopListViewTitle: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        borderColor: GlobalStyles.borderColor,
    },
    titleName: {
        fontSize: 16,
        color: '#333',
    },
    sortView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sortTips: {
        fontSize: 16,
        color: '#333',
    },
});
