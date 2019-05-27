# 速芽物流商家端

### react-native-scrollable-tab-view

        // scrolltabbar.js 第62行
        if (offset.value === undefined) {
          offset.value = this.props.activeTab;
        }

### react-native-yunpeng-alipay

        删除 AlipayPackage.java中的
        @Override
        public List<Class<? extends JavaScriptModule>> createJSModules() {
            return Collections.emptyList();
        }
        
### react-native-splash-screen
    
        // SplashScreen.java            
        mSplashDialog = new Dialog(activity, fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme);
        // 替换为
        mSplashDialog = new Dialog(activity, R.layout.launch_screen);