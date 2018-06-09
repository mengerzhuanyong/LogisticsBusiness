/**
 * 速芽物流商家端 - MineEmployee
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
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'

import ActivityIndicatorItem from '../../component/common/ActivityIndicatorItem'
import EmptyComponent from '../../component/common/EmptyComponent'
import EmployeeItem from '../../component/mine/employeeItem'

import ShopData from '../../asset/json/homeBusiness.json'

export default class MineEmployee extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            sid: global.store.storeData.sid,
            style: '1',
        	name: '',
            ready: false,
            loadMore: false,
            refreshing: false,
            staffListData: [],
            canBack: false,
        }
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
    }

    loadNetData = (page) => {
        let {sid, style, name} = this.state;
        let url = NetApi.staffList + sid + '/style/' + style + '/page/' + page + '/name/' + name;
        return this.netRequest.fetchGet(url, true)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error);
                toastShort('error');
            })
    };

    dropLoadMore = async () => {
        // let result = await this.loadNetData(0);
        // if (result && result.code == 1) {
        //     this.setState({
        //         staffListData: result.data.staff
        //     })
        // } else {
        //     toastShort(result.msg);
        // }  
    };

    freshNetData = async () => {
        let result = await this.loadNetData(0);
        if (result && result.code == 1) {
            this.setState({
                staffListData: result.data.staff
            })
        } else {
            toastShort(result.msg);
        }  
    };

    onSubmitSearch = () => {

    }

    onPushNavigator = (webTitle, component) => {
        const { navigate } = this.props.navigation;
        // console.log(123);
        navigate(component, {
            webTitle: webTitle,
            reloadData: () => this.freshNetData(),
        })
    }

    onPushEdit = ({item}) => {
        console.log(123);
        const { navigate } = this.props.navigation;
        navigate('MineEmployeeEdit', {
            item: item,
            reloadData: () => this.freshNetData(),
        });
    };

    renderServiceItem = (item) => {
        return (
            <EmployeeItem
                item = {item}
                {...this.props}
                onPushToBusiness = {()=> this.onPushToBusiness()}
                onPushEdit = {()=> this.onPushEdit(item)}
                reloadData = {() => this.freshNetData()}
            />
        )
    }

    renderHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>为您找到的物流公司</Text>
                <View style={styles.sortView}>
                    <Text style={styles.sortTips}>排序</Text>
                </View>
            </View>
        )
    }

    renderFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        return (
            <TouchableOpacity
                style = {GlobalStyles.listAddBtnView}
                onPress = {() => this.onPushNavigator('添加服务', 'MineEmployeeAdd')}
            >
                <Image source={GlobalIcons.icon_add} style={GlobalStyles.listAddBtnIcon} />
            </TouchableOpacity>
        )
    }

    renderEmptyView = () => {
        return <EmptyComponent emptyTips={'对不起，您当前还没有添加员工'} />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    render(){
        const { ready, refreshing, staffListData } = this.state;
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
                        <Image source={GlobalIcons.icon_search} style={GlobalStyles.searchIcon} />
                        <TextInput
                            style = {styles.searchInputItem}
                            placeholder = "请输入姓名"
                            placeholderTextColor = '#888'
                            underlineColorAndroid = {'transparent'}
                            onChangeText = {(text)=>{
                                this.setState({
                                    name: text
                                })
                            }}
                        />
                    </View>
                    <TouchableOpacity
                        style = {styles.searchBtnView}
                        onPress = {() => this.freshNetData()}
                    >
                        <Text style={styles.searchBtnItem}>查找</Text>
                    </TouchableOpacity>
                </View>
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {staffListData}
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
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    searchInputView: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 14,
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
        color: GlobalStyles.themeColor,
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
