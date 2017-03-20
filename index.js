'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.DeviceInfo=exports.AlivePushStatus=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _reactNative=require('react-native');
var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNativeFetchBlob=require('react-native-fetch-blob');var _reactNativeFetchBlob2=_interopRequireDefault(_reactNativeFetchBlob);
var _reactNativeDeviceInfo=require('react-native-device-info');var _reactNativeDeviceInfo2=_interopRequireDefault(_reactNativeDeviceInfo);
var _reactNativeZipArchive=require('react-native-zip-archive');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var host="http://172.16.30.157:8080/";var

RNAlivePush=_reactNative.NativeModules.RNAlivePush;

var alivePushFeedbackType={
downloadSuccess:1,
installSuccess:2};


var dim=_reactNative.Dimensions.get("window");

var _deviceInfo=null;

function objectToBase64Sync(obj){
var data=[];
for(var key in obj){
if(typeof obj[key]!=="function"){
data.push(key+'='+obj[key]);
}
}
var str=data.join(',');
return _reactNativeFetchBlob2.default.base64.encode(str,'base64');
}






































var alivePush=function alivePush(options){

if(!options){
throw new Error('options is required');
}
if(!options.deploymentKey){
throw new Error('options.deploymentKey is required');
}
var decorator=function decorator(RootComponent){
return function(_Component){_inherits(AlivePushComponent,_Component);_createClass(AlivePushComponent,[{key:'restart',value:function restart()
{
RNAlivePush.restart();
}}]);

function AlivePushComponent(props){_classCallCheck(this,AlivePushComponent);var _this=_possibleConstructorReturn(this,(AlivePushComponent.__proto__||Object.getPrototypeOf(AlivePushComponent)).call(this,
props));
_this.options=options;
_this.statusChangeCallback=function(){
};
_this.downloadProgressCallback=function(){
};
_this.errorCallback=null;return _this;
}_createClass(AlivePushComponent,[{key:'componentDidMount',value:function componentDidMount()

{
var rootComponentInstance=this.refs.rootComponent;

if(rootComponentInstance&&rootComponentInstance.alivePushStatusChange){
this.statusChangeCallback=rootComponentInstance.alivePushStatusChange;
if(rootComponentInstance instanceof _react.Component){
this.statusChangeCallback=this.statusChangeCallback.bind(rootComponentInstance);
}
}

if(rootComponentInstance&&rootComponentInstance.alivePushDownloadProgress){
this.downloadProgressCallback=rootComponentInstance.alivePushDownloadProgress;
if(rootComponentInstance instanceof _react.Component){
this.downloadProgressCallback=this.downloadProgressCallback.bind(rootComponentInstance);
}
}

if(rootComponentInstance&&rootComponentInstance.alivePushError){
this.errorCallback=rootComponentInstance.alivePushError;
if(rootComponentInstance instanceof _react.Component){
this.errorCallback=this.errorCallback.bind(rootComponentInstance);
}
}

this.sync();
}},{key:'buildUrlSync',value:function buildUrlSync(

url){
return''+(this.options.host||host)+url;
}},{key:'getDeviceInfo',value:function getDeviceInfo()


{
return new Promise(function(resolve,reject){
if(!_deviceInfo){
_deviceInfo=new DeviceInfo();
}
resolve(_deviceInfo);
});
}},{key:'getAppInfo',value:function getAppInfo(){var _this2=this;var

value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return regeneratorRuntime.async(function getAppInfo$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt('return',
this.getConfig().then(function(config){
return _extends({
Binary:RNAlivePush.VersionName,
Inner:config.version||0,
DeploymentKey:_this2.options.deploymentKey},
value);
}));case 1:case'end':return _context.stop();}}},null,this);}},{key:'buildHeaders',value:function buildHeaders(


appInfo){var device,app,headers;return regeneratorRuntime.async(function buildHeaders$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return regeneratorRuntime.awrap(
this.getDeviceInfo());case 2:device=_context2.sent;_context2.next=5;return regeneratorRuntime.awrap(
this.getAppInfo(appInfo));case 5:app=_context2.sent;
headers={
device:device.toBase64Sync(),
'Content-Type':'application/json',
app:objectToBase64Sync(app)};return _context2.abrupt('return',

headers);case 8:case'end':return _context2.stop();}}},null,this);}},{key:'checkUpdate',value:function checkUpdate(){var headers,res,json;return regeneratorRuntime.async(function checkUpdate$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.next=2;return regeneratorRuntime.awrap(



this.buildHeaders());case 2:headers=_context3.sent;
this.statusChangeCallback(AlivePushStatus.checking);_context3.next=6;return regeneratorRuntime.awrap(
_reactNativeFetchBlob2.default.fetch("GET",this.buildUrlSync("main/checkupdate"),headers));case 6:res=_context3.sent;
json=res.json();return _context3.abrupt('return',
json);case 9:case'end':return _context3.stop();}}},null,this);}},{key:'downloadPackage',value:function downloadPackage(


url){var headers;return regeneratorRuntime.async(function downloadPackage$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(
url){_context4.next=2;break;}throw(
new Error("url is required"));case 2:if(

/^(http|https)/.test(url)){_context4.next=4;break;}throw(
new Error("url is invalid"));case 4:_context4.next=6;return regeneratorRuntime.awrap(




this.buildHeaders());case 6:headers=_context4.sent;
this.statusChangeCallback(AlivePushStatus.downloading);return _context4.abrupt('return',
_reactNativeFetchBlob2.default.config({
fileCache:true}).
fetch("GET",url,headers).
progress(this.downloadProgressCallback));case 9:case'end':return _context4.stop();}}},null,this);}},{key:'feedback',value:function feedback(){var


data=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{type:alivePushFeedbackType.downloadSuccess};var appInfo=arguments[1];var headers;return regeneratorRuntime.async(function feedback$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.next=2;return regeneratorRuntime.awrap(
this.buildHeaders(appInfo));case 2:headers=_context5.sent;
_reactNativeFetchBlob2.default.fetch("POST",this.buildUrlSync('main/feedback'),headers,JSON.stringify(data));case 4:case'end':return _context5.stop();}}},null,this);}},{key:'getConfig',value:function getConfig()


{
return _reactNativeFetchBlob2.default.fs.readStream(RNAlivePush.AlivePushConfigPath,'utf8').
then(function(readStream){
return new Promise(function(resolve,reject){
var data=[];
readStream.onData(function(chunk){
data.push(chunk);
});
readStream.onEnd(function(){
var jsonStr=data.join('');
jsonStr=jsonStr.substring(jsonStr.indexOf("{"),jsonStr.lastIndexOf("}")+1);
var json=void 0;
try{
json=JSON.parse(jsonStr);
}
catch(ex){
json={};
}
resolve(json);
});
readStream.onError(function(err){

resolve({});
});
readStream.open();
});
});
}},{key:'writeConfig',value:function writeConfig(

newConfig){var exists,str,ws;return regeneratorRuntime.async(function writeConfig$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:_context6.next=2;return regeneratorRuntime.awrap(
_reactNativeFetchBlob2.default.fs.exists(RNAlivePush.AlivePushConfigPath));case 2:exists=_context6.sent;
str=JSON.stringify(newConfig);if(!
exists){_context6.next=12;break;}_context6.next=7;return regeneratorRuntime.awrap(
_reactNativeFetchBlob2.default.fs.writeStream(RNAlivePush.AlivePushConfigPath,'utf8'));case 7:ws=_context6.sent;
ws.write(str);return _context6.abrupt('return',
ws.close());case 12:return _context6.abrupt('return',


_reactNativeFetchBlob2.default.fs.createFile(RNAlivePush.AlivePushConfigPath,str,'utf8'));case 13:case'end':return _context6.stop();}}},null,this);}},{key:'updateConfig',value:function updateConfig(



newConfig){var oldConfig,config;return regeneratorRuntime.async(function updateConfig$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:_context7.next=2;return regeneratorRuntime.awrap(
this.getConfig());case 2:oldConfig=_context7.sent;
config=_extends({},oldConfig,newConfig);return _context7.abrupt('return',
this.writeConfig(config));case 5:case'end':return _context7.stop();}}},null,this);}},{key:'unzipPackage',value:function unzipPackage(


path,filename){var targetPath;return regeneratorRuntime.async(function unzipPackage$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:
targetPath=RNAlivePush.CachePath+'/'+filename;return _context8.abrupt('return',
(0,_reactNativeZipArchive.unzip)(path,targetPath).
then(function(unzipPath){

return _reactNativeFetchBlob2.default.fs.unlink(path).
then(function(){
return unzipPath;
});
}));case 2:case'end':return _context8.stop();}}},null,this);}},{key:'sync',value:function sync(){var packageInfo,newPackage,packagePath,unzipPath,bundlePath,config;return regeneratorRuntime.async(function sync$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:_context9.prev=0;




this.statusChangeCallback(AlivePushStatus.beforeCheck);_context9.next=4;return regeneratorRuntime.awrap(
this.checkUpdate());case 4:packageInfo=_context9.sent;
this.statusChangeCallback(AlivePushStatus.afterCheck,packageInfo);if(!(
packageInfo.success&&packageInfo.data)){_context9.next=22;break;}
this.statusChangeCallback(AlivePushStatus.beforeDownload);_context9.next=10;return regeneratorRuntime.awrap(
this.downloadPackage(packageInfo.data.url));case 10:newPackage=_context9.sent;
this.feedback(alivePushFeedbackType.downloadSuccess,{
Inner:packageInfo.data.inner});

packagePath=newPackage.path();_context9.next=15;return regeneratorRuntime.awrap(
this.unzipPackage(packagePath,packageInfo.data.inner));case 15:unzipPath=_context9.sent;
bundlePath=unzipPath+'/app/index.'+_reactNative.Platform.OS+'.js';_context9.next=19;return regeneratorRuntime.awrap(
this.updateConfig({
path:bundlePath,
lastUpdateTime:new Date(),
install:false,
version:packageInfo.data.inner}));case 19:

this.statusChangeCallback(AlivePushStatus.afterDownload,RNAlivePush.restart);_context9.next=26;break;case 22:_context9.next=24;return regeneratorRuntime.awrap(


this.getConfig());case 24:config=_context9.sent;
if(config.path){
if(config.path===RNAlivePush.JSBundleFile){
if(!config.install){
this.feedback({type:alivePushFeedbackType.installSuccess},{
Inner:config.version});

this.updateConfig({
install:true});

this.statusChangeCallback(AlivePushStatus.install);
}
}
}case 26:_context9.next=35;break;case 28:_context9.prev=28;_context9.t0=_context9['catch'](0);if(!




this.errorCallback){_context9.next=34;break;}
this.errorCallback(_context9.t0);_context9.next=35;break;case 34:throw _context9.t0;case 35:case'end':return _context9.stop();}}},null,this,[[0,28]]);}},{key:'render',value:function render()







{
return _react2.default.createElement(RootComponent,_extends({},this.props,{ref:"rootComponent"}));
}}]);return AlivePushComponent;}(_react.Component);

};
if(typeof options==="function"){
return decorator(options);
}else{
return decorator;
}
};












var AlivePushStatus=exports.AlivePushStatus={
beforeCheck:1,
checking:10,
afterCheck:20,
beforeDownload:30,
downloading:40,
afterDownload:50,
install:60};exports.default=



alivePush;var














DeviceInfo=exports.DeviceInfo=function(){
function DeviceInfo(){_classCallCheck(this,DeviceInfo);
this.UniqueID=_reactNativeDeviceInfo2.default.getUniqueID();
this.Manufacturer=_reactNativeDeviceInfo2.default.getManufacturer();
this.Brand=_reactNativeDeviceInfo2.default.getBrand();
this.Model=_reactNativeDeviceInfo2.default.getModel();
this.DeviceId=_reactNativeDeviceInfo2.default.getDeviceId();
this.SystemName=_reactNativeDeviceInfo2.default.getSystemName();
this.SystemVersion=_reactNativeDeviceInfo2.default.getSystemVersion();
this.BundleId=_reactNativeDeviceInfo2.default.getBundleId();
this.BuildNumber=_reactNativeDeviceInfo2.default.getBuildNumber();
this.Version=_reactNativeDeviceInfo2.default.getVersion();
this.ReadableVersion=_reactNativeDeviceInfo2.default.getReadableVersion();
this.DeviceName=encodeURI(_reactNativeDeviceInfo2.default.getDeviceName());
this.UserAgent=_reactNativeDeviceInfo2.default.getUserAgent();
this.DeviceLocale=_reactNativeDeviceInfo2.default.getDeviceLocale();
this.DeviceCountry=_reactNativeDeviceInfo2.default.getDeviceCountry();
this.Timezone=_reactNativeDeviceInfo2.default.getTimezone();
this.InstanceID=_reactNativeDeviceInfo2.default.getInstanceID();
this.Emulator=_reactNativeDeviceInfo2.default.isEmulator();
this.Tablet=_reactNativeDeviceInfo2.default.isTablet();
this.Width=dim.width;
this.Height=dim.height;
this.Ratio=_reactNative.PixelRatio.get();

}_createClass(DeviceInfo,[{key:'toBase64Sync',value:function toBase64Sync()

{
return objectToBase64Sync(this);
}}]);return DeviceInfo;}();
