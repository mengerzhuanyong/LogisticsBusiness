/**
 * 速芽物流商家端 - NavigatorItem
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

export default class NavigatorItem extends Component {

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
        const { onPushNavigator, leftIcon, leftTitle, rightText } = this.props;
        return (
            <TouchableOpacity
                style = {styles.container}
                onPress = {onPushNavigator}
            >
                <View style={styles.navigationViewItem}>
                    {leftIcon && <Image source={leftIcon} style={styles.navigationIcon} />}
                    <Text style={styles.navigationName}>{leftTitle}</Text>
                </View>
                <View style={styles.navigationViewItem}>
                    {rightText != '' && <Text style={styles.navigationRightText}>{rightText}</Text>}
                    <Image source={GlobalIcons.icon_angle_right_black} style={styles.navigationRightIcon} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    navigationItemView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (GlobalStyles.width - 30) / 4,
    },
    navigationViewItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navigationIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
        resizeMode: 'contain',
    },
    navigationName: {
        color: '#333',
        fontSize: 15,
    },
    navigationRightText: {
        marginRight: 10,
        color: GlobalStyles.themeColor,
    },
    navigationRightIcon: {
        width: 15,
        height: 15,
        tintColor: '#888',
        resizeMode: 'contain',
    }
});