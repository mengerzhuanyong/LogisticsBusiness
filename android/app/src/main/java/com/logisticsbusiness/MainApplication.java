package com.logisticsbusiness;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNSyanImagePickerPackage;
import com.theweflex.react.WeChatPackage;
import com.yunpeng.alipay.AlipayPackage;
import com.horcrux.svg.SvgPackage;
import com.yusha.customKeyboard.RNCustomKeyboardPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.beefe.picker.PickerViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import java.util.Arrays;
import java.util.List;

import cn.jpush.reactnativejpush.JPushPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSyanImagePickerPackage(),
            new BaiduMapPackage(getApplicationContext()),
            new WeChatPackage(),
            new AlipayPackage(),
            new SvgPackage(),
            new RNCustomKeyboardPackage(),
            new RNSpinkitPackage(),
            new PickerViewPackage(),
            new JPushPackage(true, true),
            new SplashScreenReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
