/**
 * 速芽物流商家端 - 全局样式
 * https://menger.me
 * @大梦
 */

import {
    Platform,
    Dimensions,
} from 'react-native'

const __IOS__ = Platform.OS === 'ios';
const {    width, height } = Dimensions.get('window');
const themeColor = '#5a89f5';

const noPicture = 'http://oyzkrnb0o.bkt.clouddn.com/no_picture.jpg';
module.exports = {
    width: width,
    height: height,
    statusBar_Height_Ios: 44,
    statusBar_Height_Android: 50,
    noPicture: noPicture,
    
    rightButton: {
        paddingHorizontal: 8,
    },
    rightButtonName: {
        color: '#fff',
        fontSize: 15,
    },
    
    bgColor: '#f0f0f0',
    themeColor: themeColor,
    borderColor: '#e7e8e9',
    themeDeepColor: '#4c80fb',
    themeLightColor: '#4cc2fe',

    transparent: 0,

    f_w4: {
        fontWeight: '400'
    },

    marginTop10: {
        marginTop: 10,
    },
    ml_10: {
        marginLeft: 10,
    },

    clearInputBtn: {
        color: '#aaa',
        fontSize: 20,
        fontWeight: '200',
    },
    
    logoIcon: {
        borderWidth: 6,
        borderColor: '#f4f4f4',
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    keyBoardIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    subScript: {
        position: 'absolute',
        top: -7,
        width: 18,
        height: 18,
        right: -10,
        fontSize: 8,
        color: '#fff',
        lineHeight: 17,
        borderRadius: 9,
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: themeColor,
    },
    subScriptLarge: {
        fontSize: 10,
    },
    scrollTabBarNav: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tabBarUnderline: {
        height: 2,
        backgroundColor: themeColor,
    },

    verLine: {
        width: 1,
        backgroundColor: '#e7e8e9'
    },
    horLine: {
        height: 1,
        backgroundColor: '#e7e8e9'
    },

    bannerContainer: {
        height: 210,
    },
    bannerViewWrap: {
        flex: 1,
        position: 'relative',
    },
    bannerImg: {
        width: width,
        height: 210,
        resizeMode: 'cover'
    },
    bannerDot: {
        width: 8,
        height: 8,
        marginTop: 2,
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: '#fff',
    },
    bannerActiveDot: {
        width: 18,
        height: 8,
        marginTop: 2,
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: '#fff',
    },

    hasFixedContainer: {
        marginBottom: 90,
    },
    fixedBtnView: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: width,
        bottom: 0,
    },
    btnView: {
        margin: 20,
        height: 40,
        borderRadius: 5,
        width: width - 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColor,
    },
    btnItem: {
        fontSize: 15,
        color: '#fff',
    },
    checkedIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    moreBtnIcon: {
        fontSize: 24,
        color: '#888',
        marginLeft: 5,
        fontWeight: '400',
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: 'contain',
    },
    btnGetCodeView: {
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        borderColor: '#e7e8e9',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    btnGetCodeItem: {
        height: 30,
        fontSize: 13,
        color: '#666',
        lineHeight: 27,
        paddingHorizontal: 8,

    },
    placeViewIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeStartIcon: {
        backgroundColor: themeColor,
    },
    placeEndIcon: {
        backgroundColor: '#f60',
    },
    placeText: {
        fontSize: 12,
        color: '#fff',
    },
    fixBtnView: {
        height: 50,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColor,
    },
    fixBtnItemName: {
        fontSize: 16,
        color: '#fff',
    },

    countDownTime: {
        fontSize: 12,
        color: '#fff',
        borderRadius: 2,
        marginHorizontal: 3,
        paddingHorizontal: 3,
        backgroundColor: themeColor,
    },
    countDownColon: {
        fontSize: 12,
        color: themeColor
    },

    shopStarCon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shopStarIcon: {
        width: 13,
        height: 13,
        marginRight: 3,
        resizeMode: 'contain',
    },
    uploadView: {
        width: 80,
        height: 80,
    },
    uploadIcon: {
        width: 80,
        height: 80,
        resizeMode: 'contain'
    },

    spinnerWrap: {
        position: 'absolute',
        top: 64,
        left: 0,
        flex: 1,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000033',
    },
    listAddBtnView: {
        marginTop: 20,
        marginRight: 15,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    listAddBtnIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    buttonImage: {
        flex: 1,
        resizeMode: 'cover',
        position: 'absolute',
    },
};