/**
 * 速芽物流商家端 - HotNews
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

const img_url = '../../asset/img/img/banner1.png';

export default class HotNews extends Component {

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
            {'id': 1, 'title': img_url},
            {'id': 2, 'title': img_url},
            {'id': 3, 'title': img_url},
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
            // row = [
            //     {'id': 1, 'title': img_url},
            //     {'id': 2, 'title': img_url},
            //     {'id': 3, 'title': img_url},
            // ];
            let banners = row.map((obj,index)=>{
                return (
                    <TouchableOpacity
                        style={styles.hotNewsItemView}
                        key={"bubble_"+index}
                        activeOpacity = {1}
                        onPress={() => {}}
                    >
                        <Text style={styles.hotNewsTitle} numberOfLines={2}>{obj.title}</Text>
                    </TouchableOpacity>
                )
            });
            return (
                <Swiper
                    index={0}
                    loop={true}
                    autoplay={true}
                    horizontal={false}
                    removeClippedSubviews={false}
                    showsPagination={false}
                    autoplayTimeout={5}
                    height={45}
                    width={GlobalStyles.width}
                    style={{paddingTop:0,marginTop:0}}
                    lazy={true}
                >
                    {banners}
                </Swiper>
            )
        }
    }

    render(){
        const { banners } = this.state;
        return (
            <View style={styles.container}>
                <Image source={GlobalIcons.icon_note} style={styles.noteIcon} />
                {this.renderBanner(banners)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#fafafa',
        justifyContent: 'flex-start',
    },
    noteIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    hotNewsItemView: {
        height: 45,
        width: GlobalStyles.width - 60,
        justifyContent: 'center',
    },
    hotNewsTitle: {
        fontSize: 15,
        color: '#666',
    }
});