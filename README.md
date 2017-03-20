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

### 重写 ReactNativeHost 的 getJSBundleFile 方法

#### Android

```java
@Nullable
@Override
protected String getJSBundleFile() {
    return RNAlivePushModule.getJSBundleFile(MainApplication.this);
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

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## alivePush

**Parameters**

-   `options` **[AlivePushOption](#alivepushoption)** 

**Examples**

_class wrapper_

```javascript
import alivePush from 'react-native-alive-push'
class MyApp extends React.Component{
	...
}
const AppWrapper=alivePush({...})(MyApp)
```

_Decorator_

```javascript
\@alivePush({
	...
})
class MyApp extends React.Component{
	...
}
```

_事件回调,目前仅支持以下列出的事件回调_

```javascript
\@alivePush
class MyApp extends React.Component{
    alivePushStatusChange(status:AlivePushStatus){
        // do something
    }
    alivePushDownloadProgress(progress){
        // do something
    }
    alivePushError(err){
        // do something
    }
}
```

Returns **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **AlivePushComponent** 

## AlivePushStatus

**Properties**

-   `beforeCheck` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `checking` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `afterCheck` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `beforeDownload` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `downloading` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `afterDownload` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `install` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

## AlivePushOption

Type: {deploymentKey: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), host: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?}

**Properties**

-   `deploymentKey` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 部署的key
-   `host` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** 服务器的地址
