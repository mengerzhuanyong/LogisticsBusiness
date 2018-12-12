/**
 * 速芽物流商家端 - NavigationBar
 * http://menger.me
 * @大梦
 */

import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Platform,
    StatusBar,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types';
import GlobalStyles from '../../constant/GlobalStyle'
import GlobalIcons from '../../constant/GlobalIcon'

const __IOS__ = Platform.OS === 'ios';
const STATUS_BAR_HEIGHT = 20;
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const StatusBarShape = {
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(['light-content', 'default', ]),
};

export default class NavigationBar extends Component {

    static propTypes = {
        hide: PropTypes.bool,
        title: PropTypes.string,
        style: View.propTypes.style,
        titleView: PropTypes.element,
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        backgroundImage: PropTypes.bool,
        titleLayoutStyle: View.propTypes.style,
        statusBar: PropTypes.shape(StatusBarShape),
    }

    static defaultProps = {
        statusBar: {
            hidden: false,
            barStyle: 'light-content',
        },
        backgroundImage: true,
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false
        };
    }

    /**
     * @Author   Menger
     * @DateTime 2018-01-17
     * @return   按钮组件
     */
    getButtonElement = (data) => {
        return (
            <View style={styles.navBarButton}>
                {data ? data : null}
            </View>
        );
    }

    /**
     * @Author   Menger
     * @DateTime 2018-01-17
     * @return   导航背景
     */
    renderBackgroundImages = () => {
        return this.props.backgroundImage && <Image source={GlobalIcons.images_bg_navigation} style={styles.backgroundImage} />;
    }

    /**
     * @Author   Menger
     * @DateTime 2018-01-17
     * @return   导航状态栏
     */
    renderStatusBar = () => {
        let statusBar = !this.props.statusBar.hidden ?
            <View style={styles.statusBar}>
                <StatusBar {...this.props.statusBar} />
            </View> : null;
        return statusBar;
    }

    /**
     * @Author   Menger
     * @DateTime 2018-01-17
     * @return   导航主体内容
     */
    renderContent = () => {
        let titleView = this.props.titleView ? this.props.titleView :
            <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>;

        let content = this.props.hide ? null :
            <View style={styles.navBar}>
                {this.getButtonElement(this.props.leftButton)}
                <View style={[styles.navBarTitleContainer,this.props.titleLayoutStyle]}>
                    {titleView}
                </View>
                {this.getButtonElement(this.props.rightButton)}
            </View>;
        return content;
    }

    render() {
        return (
            <View style={[styles.container, this.props.style, this.props.backgroundImage && styles.containerTransparent]}>
                {this.renderBackgroundImages()}
                {this.renderStatusBar()}
                {this.renderContent()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: GlobalStyles.themeColor,
    },
    containerTransparent: {
        backgroundColor: 'transparent',
    },
    backgroundImage: {
        top: 0,
        bottom: 0,
        resizeMode: 'cover',
        position: 'absolute',
        width: GlobalStyles.width,
        height: __IOS__ ? NAV_BAR_HEIGHT_IOS + 20 : NAV_BAR_HEIGHT_ANDROID,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: __IOS__ ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 40,
        left: 40,
        top: 0,
    },
    title: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: __IOS__ ? STATUS_BAR_HEIGHT : 0,
    },
})