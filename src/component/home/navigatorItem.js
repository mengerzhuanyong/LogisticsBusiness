/**
 * 速芽物流商家端 - HomeNavigatorItem
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Platform,
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

const __IOS__ = Platform.OS === 'ios';

export default class HomeNavigatorItem extends Component {

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
        const { onPushNavigator, navigatorName, navigationSubName, navigatorIcon, showBadge} = this.props;
        return (
            <TouchableOpacity
                style = {styles.navigationItemView}
                onPress = {onPushNavigator}
            >
                <Image source={GlobalIcons.images_bg_homeButton} style={styles.navigationBack} />
                <Image source={navigatorIcon} style={styles.navigationIcon} />
                {showBadge && <View style={styles.badgeStyle}/> }
                <Text style={styles.navigationName}>{navigatorName}</Text>
                {navigationSubName && <Text style={styles.navigationName}>{navigationSubName}</Text>}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    navigationItemView: {
        marginBottom: 15,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: (GlobalStyles.width - 45) / 2,
        height: GlobalStyles.width / 3,
    },
    navigationBack: {
        resizeMode: 'cover',
        position: 'absolute',
        width: (GlobalStyles.width - 45) / 2,
        height: GlobalStyles.width / 3,
    },
    navigationIcon: {
        width: __IOS__ ? 40 : 35,
        height: __IOS__ ? 40 : 35,
        resizeMode: 'contain',
    },
    navigationName: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 10,
    },
    badgeStyle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#f00',
        position: 'absolute',
        top: __IOS__ ? 20 : 18,
        right: '50%',
        marginRight: -20,
    }
});