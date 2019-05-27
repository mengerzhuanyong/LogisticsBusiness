/**
 * 速芽物流商家端 - BANNER
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

const img_url = GlobalIcons.banner1;

export default class Banner extends Component {

    constructor(props){
        super(props);
        this.state = {
            swiperShow: false,
            banners: this.props.bannerData,
        };
        this.netRequest = new NetRequest();
    }

    static defaultProps = {
        bannerData: [
            {'id': 1, 'logo': img_url},
            {'id': 2, 'logo': img_url},
            {'id': 3, 'logo': img_url},
        ],
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0)
    }

    componentWillReceiveProps(nextProps){
        // // consoleLog('首页轮播', nextProps);
        this.setState({
            banners: nextProps.bannerData
        })
    }

    updateState = (state) => {
        if (!this) {
            return;
        }
        this.setState(state);
    }

    loadNetData = () => {

    }

    renderBanner = (row) => {
        if(this.state.swiperShow) {
            if(row.length <= 0) {
                return null;
            }
            let banners = row.map((obj,index)=>{
                return (
                    <TouchableOpacity
                        style={GlobalStyles.bannerViewWrap}
                        key={"bubble_"+index}
                        activeOpacity = {1}
                        onPress={() => {}}
                    >
                        <View style={GlobalStyles.bannerViewWrap}>
                            <Image source={obj.logo ? {uri: obj.logo} : img_url} style={GlobalStyles.bannerImg} />
                        </View>
                    </TouchableOpacity>
                )
            });
            return (
                <Swiper
                    index={0}
                    loop={true}
                    autoplay={true}
                    horizontal={true}
                    removeClippedSubviews={false}
                    showsPagination={true}
                    autoplayTimeout={5}
                    height={GlobalStyles.width / 2}
                    width={GlobalStyles.width}
                    style={{paddingTop:0,marginTop:0}}
                    lazy={true}
                    dot = {<View style={GlobalStyles.bannerDot} />}
                    activeDot = {<View style={GlobalStyles.bannerActiveDot} />}
                >
                    {banners}
                </Swiper>
            )
        }
    }

    render(){
        const { banners } = this.state;
        return (
            <View style={GlobalStyles.bannerContainer}>
                {this.renderBanner(banners)}
            </View>
        );
    }
}

const styles = StyleSheet.create({

});