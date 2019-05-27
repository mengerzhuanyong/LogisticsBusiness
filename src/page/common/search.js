/**
 * 速芽物流商家端 - 公共详情页
 * http://menger.me
 * @Meng
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    WebView,
    StatusBar,
    TextInput,
    Dimensions,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import NetRequest from '../../util/utilsRequest'
import NetApi from '../../constant/GlobalApi'
import { ACTION_FLOW, ACTION_NAVGATION } from '../../constant/EventActions'
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'
import NavigationBar from '../../component/common/NavigationBar'
import UtilsView from '../../util/utilsView'
import {toastShort, consoleLog} from '../../util/utilsToast'


export default class RepositoryDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchKey: [{'name': '酒水饮料'},{'name': '冷热速食'},{'name': '休闲食品'},{'name': '肉禽蛋奶'},{'name': '清洁日化'},{'name': '家具用品'},{'name': '粮油米面'}],
        }
    }

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <HeaderSearchView onUpdateSearchKey = {this.onUpdateSearchKey} />,
        headerRight: <HeaderSearchBtnView onSubmitSearch = {() => this.onSubmitSearch} />
    });

    onUpdateSearchKey = (key) => {
        // console.log(key);
    }

    onSubmitSearch = (data) => {
        // console.log(data);
    }

    onPushToCategoryList = () => {

    }

    renderHotSearchKey = () => {
        let { searchKey } = this.state;
        if (!searchKey) {
            return;
        }
        let searchKeys = searchKey.map((item, index) => {
            // console.log('热门搜索', item, index);
            return <TouchableOpacity
                    key = {"hotkey"+index}
                    style = {styles.hotKeyItem}
                    onPress = {() => this.onPushToCategoryList()}
                >
                    <Text style={styles.hotkeyName}>{item.name}</Text>
                </TouchableOpacity>
        })
        return searchKeys;
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = {'Test'}
                    leftButton = {UtilsView.getLeftButton(() => { this.state.canBack && this.onBack()})}
                />
                <StatusBar
                    animated = {true}
                    hidden = {false}
                    backgroundColor = {'#42b3ff'}
                    translucent = {true}
                    barStyle = {'default'}
                />
                <HeaderSearchBtnView onSubmitSearch = {() => this.onSubmitSearch} />
                <View style={styles.hotSearchView}>
                    <Text style={styles.hotSearchViewTitle}>热门搜索</Text>
                    <View style={styles.hotSearchViewCon}>
                        {this.renderHotSearchKey()}
                    </View>
                </View>
            </View>
        );
    }

}

export class HeaderSearchView extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        return (
            <View style={styles.headerSearchView}>
                <View style = {styles.headerSearchInputView}>
                    <Icon
                        name = 'ios-search'
                        style = {styles.headerSearchIcon}
                    />
                    <TextInput
                        style = {styles.headerSearchInput}
                        placeholder = "请输入您要搜索的商品名"
                        placeholderTextColor = '#888'
                        underlineColorAndroid = {'transparent'}
                        onChangeText = {(text)=>{
                            this.props.onUpdateSearchKey(text);
                        }}
                    />
                </View>
            </View>
        )
    }
}

export class HeaderSearchBtnView extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    submitSearch = () => {
            this.props.onSubmitSearch;
        // consoleLog('商品搜索', this.props);
        if (this.props.onSubmitSearch) {
        }
    }

    render(){
        return (
            <TouchableOpacity
                style = {styles.headerSearchBtnView}
                onPress = { () => this.submitSearch()}
            >
                <Text style={styles.headerSearchTips}>搜索</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webContainer: {
        flex: 1,
        marginTop: -20,
        backgroundColor: '#f1f2f3',
    },
    headerSearchView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    headerSearchInputView: {
        height: 35,
        borderRadius: 22,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: GlobalStyles.width * 0.7,
        backgroundColor: '#dddddd77'
    },
    headerSearchIcon: {
        fontSize: 25,
        color: '#555',
        marginRight: 5,
    },
    headerSearchInput: {
        color: '#666',
        width: GlobalStyles.width * 0.6,
    },
    headerSearchTips: {
        color: '#666'
    },
    headerSearchBtnView: {
        marginRight: 10,
    },
    hotSearchView: {
        padding: 10,
    },
    hotSearchViewTitle: {
        fontSize: 16,
        lineHeight: 30,
        fontWeight: '600',
    },
    hotSearchViewCon: {
        marginTop: 10,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    hotKeyItem: {},
    hotkeyName: {
        color: '#686868',
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 5,
        overflow: 'hidden',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f0f2f6',
    },
});