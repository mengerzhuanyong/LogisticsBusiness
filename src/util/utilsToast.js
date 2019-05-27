/**
 * 速芽物流用户端 - Toast
 * http://menger.me
 * @大梦
 */

import Toast from 'react-native-root-toast';

let toast;
const loggerTrueColor = 'color: #1ba01b';
const loggerFalseColor = 'color: #f00';

export const toastShort = (content, position = -100) => {
    if (content === 'error') {
        content = '网络请求失败，请稍后重试！';
    }
    if (position === 'center') {
        position = Toast.positions.CENTER;
    }
    if (toast !== undefined) {
        Toast.hide(toast);
    }
    toast = Toast.show(content.toString(), {
        duration: Toast.durations.SHORT,
        position: position,
        shadow: false,
        textStyle: {
            color: '#000',
            fontSize: 12,
        },
        animation: true,
        hideOnPress: true,
        delay: 0,
        containerStyle: {
            borderRadius: 50,
            paddingVertical: 7,
            backgroundColor: '#ddd',
        }
    });
};

export const toastLong = (content, position = -100) => {
    if (position === 'center') {
        position = Toast.positions.CENTER;
    }
    if (toast !== undefined) {
        Toast.hide(toast);
    }
    toast = Toast.show(content.toString(), {
        duration: Toast.durations.LONG,
        position: position,
        shadow: false,
        textStyle: {
            color: '#000',
            fontSize: 12,
        },
        animation: true,
        hideOnPress: true,
        delay: 0,
        containerStyle: {
            borderRadius: 50,
            paddingVertical: 7,
            backgroundColor: '#ddd',
        }
    });
};

export const consoleLog = (tips, content) => {
    tips = tips ? tips : '模块打印';
    if (__DEV__) {
        try {
            console.group('%c'+ tips, loggerTrueColor);
            console.log( '%c返回结果——>>', loggerTrueColor, content);
            console.groupEnd();
        } catch (e) {
            // 非调试模式，无法使用group
        }
    }
};