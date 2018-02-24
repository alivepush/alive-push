# react-native-alive-push

<!-- badge -->

[![npm version](https://img.shields.io/npm/v/react-native-alive-push.svg)](https://www.npmjs.com/package/react-native-alive-push)
[![npm license](https://img.shields.io/npm/l/react-native-alive-push.svg)](https://www.npmjs.com/package/react-native-alive-push)
[![npm download](https://img.shields.io/npm/dm/react-native-alive-push.svg)](https://www.npmjs.com/package/react-native-alive-push)
[![npm download](https://img.shields.io/npm/dt/react-native-alive-push.svg)](https://www.npmjs.com/package/react-native-alive-push)

<!-- endbadge -->

## Getting started

`$ npm install react-native-alive-push --save`

alive-push安装好之后默认会进行link,如果link失败请手动link

### Mostly automatic installation

`$ react-native link react-native-alive-push`

## Usage

### 重写`ReactNativeHost`的`getJSBundleFile`和`getBundleAssetName`

#### Android

```java
@Nullable
@Override
protected String getJSBundleFile() {
    return RNAlivePushModule.getJSBundleFile(MainApplication.this);
}

@Nullable
@Override
protected String getBundleAssetName() {
    String bundleAssetName = RNAlivePushModule.getBundleAssetName(MainApplication.this);
    if (bundleAssetName != null) {
        return bundleAssetName;
    }
    return super.getBundleAssetName();
}
```

#### IOS

在AppDelegate.m中添加 

```objective-c
#import "RNAlivePush.h"

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
    ...
    NSURL *jsCodeLocation = [RNAlivePush getJSBundleFile];
    ...
} 
```

## Change

### 0.0.2

-   android/ios alivepush配置文件添加了versionName后缀
-   android支持asset-dest bundle
-   修改了下载完成后feedback失败的bug
-   修改了覆盖安装时访问老版本的bug
-   优化了alive-push代码

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## alivePush

**Parameters**

-   `options` **[AlivePushOption](#alivepushoption)** 

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **AlivePushComponent** 

## AlivePushStatus

**Properties**

-   `beforeCheck` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 检查更新前
-   `checking` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 检查中
-   `afterCheck` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 检查更新后
-   `beforeDownload` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 下载前
-   `downloading` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 下载中
-   `afterDownload` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 下载后
-   `install` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 安装成功

## AlivePushOption

Type: {deploymentKey: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), host: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?}

**Properties**

-   `deploymentKey` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 部署的key
-   `host` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** 服务器的地址
