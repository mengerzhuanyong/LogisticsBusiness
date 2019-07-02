/**
 * 速芽物流商家端 - BusinessDetail
 * http://menger.me
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
import BusinessItem from '../../component/common/businessItem'
import BusinessServicesItem from '../../component/business/businessServicesItem'
import BusinessCommentItem from '../../component/business/businessCommentItem'
import BannerView from '../../component/common/Banner'

import ShopData from '../../asset/json/homeBusiness.json'

export default class BusinessDetail extends Component {

    constructor(props) {
        super(props);
        this.state =  {
            ready: false,
            loadMore: false,
            refreshing: false,
            companyListData: [],
            canBack: false,
        }
        this.netRequest = new NetRequest();
    }

    // static navigationOptions = ({ navigation, screenProps }) => ({
    //     title: navigation.state.params.webTitle,
    // });


    componentDidMount(){
        this.loadNetData();
        this.timer = setTimeout(() => {
            this.setState({
                ready: true
            })
        },600);
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

    loadNetData = () => {}

    dropLoadMore = () => {}

    freshNetData = () => {}

    onSubmitSearch = () => {

    }

    onPushToFlow = () => {
        const { navigate } = this.props.navigation;
        navigate('Flow');
    }

    renderCompanyItem = (item) => {
        return (
            <BusinessServicesItem
                item = {item}
                onPushToFlow = {() => this.onPushToFlow()}
            />
        )
    }

    renderCommentItem = (item) => {
        return (
            <BusinessCommentItem
                item = {item}
            />
        )
    }

    renderServicesHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>为您找到的物流公司</Text>
                <View style={styles.sortView}>
                    <Text style={styles.sortTips}>排序</Text>
                </View>
            </View>
        )
    }

    renderServicesFooterView = () => {
        // return this.state.loadMore && <ActivityIndicatorItem />;
        return (
            <View style={styles.listFooterView}>
                <View style={[GlobalStyles.horLine, styles.listFooterHorLine]} />
                <TouchableOpacity
                    style = {styles.listFooterBtnView}
                >
                    <Text style={styles.listFooterBtnName}>点就加载更多</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderCommentHeaderView = () => {
        return (
            <View style={styles.shopListViewTitle}>
                <Text style={styles.titleName}>用户评价（1024）</Text>
            </View>
        )
    }

    renderCommentFooterView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }

    renderEmptyView = () => {
        return this.state.loadMore && <ActivityIndicatorItem />;
    }

    renderSeparator = () => {
        return <View style={GlobalStyles.horLine} />;
    }

    render(){
        const { ready, refreshing, companyListData } = this.state;

        return (
            <ScrollView style={styles.container}>
                <View style = {styles.fixedHeaderBtnView}>
                    <TouchableOpacity
                        style = {styles.fixedBtnBackItem}
                        onPress = {()=> {this.state.canBack && this.props.navigation.goBack()}}
                    >
                        <Text style={styles.headerBtnIcon}>返回</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.fixedBtnRightItem}
                        onPress = {()=>this.props.navigation.goBack()}
                    >
                        <Text style={styles.headerBtnIcon}>收藏</Text>
                    </TouchableOpacity>
                </View>
                <BannerView />
                <View style={styles.shopInfoView}>
                    <View style={styles.shopInfoItem}>
                        <Text style={styles.shopName}>顺丰</Text>
                    </View>
                    <View style={styles.shopInfoItem}>
                        <View style={styles.shopStarView}>
                            <Text style={styles.shopStarTitle}>评分：</Text>
                            <View style={GlobalStyles.shopStarCon}>{this.renderStar(companyListData[0].star)}</View>
                            <Text style={styles.shopStarNum}>{companyListData[0].star.tens_digit}.{companyListData[0].star.digits}</Text>
                        </View>
                        <View style={styles.shopTagsView}>{this.renderShopTags(companyListData[0].tags)}</View>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.shopInfoItem}>
                        <View style={styles.shopAddressView}>
                            <Image source={GlobalIcons.icon_place} style={styles.shopPlaceIcon} />
                            <View style={styles.shopAddressDetail}>
                                <Text style={styles.shopAddressCon}>光谷软件园27号楼</Text>
                                <Text style={styles.shopDistance}>{companyListData[0].distance}</Text>
                            </View>
                        </View>
                        <Image source={GlobalIcons.icon_place} style={styles.shopPhoneIcon} />
                    </View>
                </View>

                <View style={styles.searchView}>
                    <View style={styles.searchTitleView}>
                        <Text style={styles.searchTitle}>所有线路搜索</Text>
                        <Text style={styles.searchTitleConTips}>优惠信息：{companyListData[0].disinfo}</Text>
                    </View>
                    <View style={[GlobalStyles.horLine, styles.horLine]} />
                    <View style={styles.searchContentView}>
                        <View style={styles.searchInputView}>
                            <View style={styles.searchInputItemView}>
                                <View style={[styles.searchItemIcon, styles.searchStartIcon]} />
                                <TextInput
                                    style = {styles.searchInputItem}
                                    placeholder = "请输入发货地"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </View>
                            <View style={[GlobalStyles.horLine, styles.searchHorLine]} />
                            <View style={styles.searchInputItemView}>
                                <View style={[styles.searchItemIcon, styles.searchEndIcon]} />
                                <TextInput
                                    style = {styles.searchInputItem}
                                    placeholder = "请输入目的地"
                                    placeholderTextColor = '#888'
                                    underlineColorAndroid = {'transparent'}
                                    onChangeText = {(text)=>{
                                        this.setState({
                                            mobile: text
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style = {styles.searchBtnView}
                            onPress = {() => this.onSubmitSearch()}
                        >
                            <Text style={styles.searchBtnItem}>搜索</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {companyListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCompanyItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        // ListHeaderComponent = {this.renderServicesHeaderView}
                        ListFooterComponent = {this.renderServicesFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }
                {ready ?
                    <FlatList
                        style = {styles.shopListView}
                        keyExtractor = { item => item.id}
                        data = {companyListData}
                        extraData = {this.state}
                        renderItem = {(item) => this.renderCommentItem(item)}
                        onEndReachedThreshold = {0.1}
                        onEndReached = {(info) => this.dropLoadMore(info)}
                        onRefresh = {this.freshNetData}
                        refreshing = {refreshing}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent = {this.renderCommentHeaderView}
                        ListFooterComponent = {this.renderCommentFooterView}
                        ListEmptyComponent = {this.renderEmptyView}
                    />
                    : <ActivityIndicatorItem />
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.bgColor,
    },
    fixedHeaderBtnView: {
        position: 'absolute',
        top: 20,
        height: 40,
        zIndex: 2,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width,
        backgroundColor: 'transparent',
    },
    fixedBtnBackItem: {},
    fixedBtnRightItem: {},
    headerBtnIcon: {
        fontSize: 15,
        color: '#fff',
    },
    horLine: {
        marginVertical: 10,
    },
    shopInfoView: {
        marginBottom: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    shopInfoItem: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
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
    shopStarNum: {
        marginLeft: 10,
        color: '#f00',
    },
    shopAddressView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopPlaceIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    shopAddressDetail: {},
    shopAddressCon: {},
    shopDistance: {
        fontSize: 12,
        color: '#888',
        lineHeight: 20,
    },
    shopPhoneIcon: {},
    searchHorLine: {
        width: 30,
        marginHorizontal: 20,
        backgroundColor: '#555',
    },
    searchView: {
        padding: 15,
        backgroundColor: '#fff',
    },
    searchTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchTitle: {
        fontSize: 15,
        color: '#555',
    },
    searchTitleConTips: {
        fontSize: 15,
        color: GlobalStyles.themeColor,
    },
    searchContentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    searchInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GlobalStyles.width - 130,
    },
    searchInputItemView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchItemIcon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    searchStartIcon: {
        backgroundColor: GlobalStyles.themeColor,
    },
    searchEndIcon: {
        backgroundColor: '#f60',
    },
    searchInputItem: {
        height: 40,
        fontSize: 16,
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
        backgroundColor: '#fff',
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
    listFooterView: {
        width: GlobalStyles.width,
        alignItems: 'center',
    },
    listFooterHorLine: {
        width: GlobalStyles.width,
    },
    listFooterBtnView: {
        height: 60,
        // backgroundColor: '#f60',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listFooterBtnName: {
        color: GlobalStyles.themeColor,
    },

});
