/**
 * 速芽物流商家端 - 入口
 * https://menger.me
 * @大梦
 */

import { AppRegistry } from 'react-native';
import App from './src/index';
// import App from './src/test1';
// import App from './App'

/**
 * @Author   Menger
 * @DateTime 2017-11-24
 * 正式发布版本屏蔽控制台打印
 */
if ( !__DEV__ ) {
	global.console = {
		log: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		gruop: () => {},
		gruopEnd: () => {},
	};
};

console.ignoredYellowBox = ['Remote debugger is in'];

AppRegistry.registerComponent('LogisticsBusiness', () => App);
