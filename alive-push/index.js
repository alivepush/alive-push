import {NativeModules, Platform, Dimensions, PixelRatio} from 'react-native'
import React, {Component} from 'react'
import RNFetchBlob from 'react-native-fetch-blob'
import RNDeviceInfo from 'react-native-device-info'
import {unzip} from 'react-native-zip-archive'

const host = "http://172.16.30.157:8080/";
const {RNAlivePush}=NativeModules;
const alivePushFeedbackType = {
	downloadSuccess: 1,
	installSuccess: 2
};
const dim = Dimensions.get("window");
console.log(dim);

export const AlivePushStatus = {
	beginCheck: "BEGINCHECK",
	checking: "CHECKING",
	endCheck: "ENDCHECK",
	beginDownload: "BEGINDOWNLOAD",
	downloading: "DOWNLOADING",
	endDownload: "ENDDOWNLOAD",
	beginUnzip: "BEGINUNZIP",
	unzipping: "UNZIPPING",
	endUnzip: "ENDUNZIP",
	complete: "COMPLETE"
};

console.log(RNAlivePush);

let _deviceInfo = null, _appInfo = null;

type LogFormData={
	type:alivePushFeedbackType
}

type AlivePushOption={
	deploymentKey:String
}

type APPInfo={
	Binary:String,
	Inner:Number,
	DeploymentKey:String
}

type AlivePushConfig={
	// bundle path
	path:String,
	// bundle version
	version:String,
	// last time update config file
	lastUpdateTime:Number,
	//
	install:Boolean
}

type ResponseJSON={
	success:Boolean,
	data:Object,
	msg:String,
	code:Number
}


function objectToBase64Sync(obj: Object): String {
	let data = [];
	for (let key in obj) {
		if (typeof obj[key] !== "function") {
			data.push(`${key}=${obj[key]}`);
		}
	}
	let str = data.join(',');
	return RNFetchBlob.base64.encode(str, 'base64');
}

function getFilenameSync(url: String): String {
	return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
}

export class DeviceInfo {
	constructor() {
		this.UniqueID = RNDeviceInfo.getUniqueID();
		this.Manufacturer = RNDeviceInfo.getManufacturer();
		this.Brand = RNDeviceInfo.getBrand();
		this.Model = RNDeviceInfo.getModel();
		this.DeviceId = RNDeviceInfo.getDeviceId();
		this.SystemName = RNDeviceInfo.getSystemName();
		this.SystemVersion = RNDeviceInfo.getSystemVersion();
		this.BundleId = RNDeviceInfo.getBundleId();
		this.BuildNumber = RNDeviceInfo.getBuildNumber();
		this.Version = RNDeviceInfo.getVersion();
		this.ReadableVersion = RNDeviceInfo.getReadableVersion();
		this.DeviceName = RNDeviceInfo.getDeviceName();
		this.UserAgent = RNDeviceInfo.getUserAgent();
		this.DeviceLocale = RNDeviceInfo.getDeviceLocale();
		this.DeviceCountry = RNDeviceInfo.getDeviceCountry();
		this.Timezone = RNDeviceInfo.getTimezone();
		this.InstanceID = RNDeviceInfo.getInstanceID();
		this.Emulator = RNDeviceInfo.isEmulator();
		this.Tablet = RNDeviceInfo.isTablet();
		this.Width = dim.width;
		this.Height = dim.height;
		this.Ratio = PixelRatio.get()

	}

	toBase64Sync() {
		return objectToBase64Sync(this);
	}
}

let alivePush = (options: AlivePushOption)=> {
	if (!options) {
		throw new Error('options is required');
	}
	if (!options.deploymentKey) {
		throw new Error('options.deploymentKey is required');
	}
	let decorator = (RootComponent) => {
		return class AlivePushComponent extends Component {
			constructor(props) {
				super(props);
				this.options = options;
				this.statusChangeCallback = ()=> {
				};
				this.downloadProgressCallback = ()=> {
				};
				this.errorCallback = null;
			}

			componentDidMount() {
				let rootComponentInstance = this.refs.rootComponent;

				if (rootComponentInstance && rootComponentInstance.alivePushStatusChange) {
					this.statusChangeCallback = rootComponentInstance.alivePushStatusChange;
					if (rootComponentInstance instanceof Component) {
						this.statusChangeCallback = this.statusChangeCallback.bind(rootComponentInstance);
					}
				}

				if (rootComponentInstance && rootComponentInstance.alivePushDownloadProgress) {
					this.downloadProgressCallback = rootComponentInstance.alivePushDownloadProgress;
					if (rootComponentInstance instanceof Component) {
						this.downloadProgressCallback = this.downloadProgressCallback.bind(rootComponentInstance);
					}
				}

				if (rootComponentInstance && rootComponentInstance.alivePushError) {
					this.errorCallback = rootComponentInstance.alivePushError;
					if (rootComponentInstance instanceof Component) {
						this.errorCallback = this.errorCallback.bind(rootComponentInstance);
					}
				}

				this.sync();
			}


			getDeviceInfo(): DeviceInfo {
				return new Promise((resolve, reject)=> {
					if (!_deviceInfo) {
						_deviceInfo = new DeviceInfo();
					}
					console.log("device info  = ", _deviceInfo);
					resolve(_deviceInfo);
				});
			}

			async getAppInfo(): APPInfo {
				if (_appInfo) {
					return Promise.resolve(_appInfo);
				}
				return this.getConfig().then(config=> {
					_appInfo = {
						Binary: RNAlivePush.VersionName,
						Inner: config.version || 0,
						DeploymentKey: this.options.deploymentKey
					};
					return _appInfo;
				});
			}

			async buildHeaders(): Object {
				let device = await this.getDeviceInfo();
				let app = await this.getAppInfo();
				let headers = {
					device: device.toBase64Sync(),
					contentType: 'application/json',
					app: objectToBase64Sync(app)
				};
				console.log('headers', headers);
				return headers;
			}

			async checkUpdate(): ResponseJSON {
				let headers = await this.buildHeaders();
				this.statusChangeCallback(AlivePushStatus.checking);
				let res = await RNFetchBlob.fetch("GET", `${host}main/checkupdate`, headers);
				let json = res.json();
				return json;
			}

			async downloadPackage(url: String): String {
				if (!url) {
					throw new Error("url is required");
				}
				if (!/^(http|https)/.test(url)) {
					throw new Error("url is invalid");
				}
				if (!/\.zip$/i.test(url)) {
					throw new Error("package url must be end with '.zip'");
				}
				let headers = await this.buildHeaders();
				this.statusChangeCallback(AlivePushStatus.downloading);
				return RNFetchBlob.config({
					fileCache: true
				}).fetch("GET", url, headers)
					.progress(this.downloadProgressCallback);
			}

			async log(data?: LogFormData = {type: alivePushFeedbackType.downloadSuccess}): ResponseJSON {
				let headers = await this.buildHeaders();
				console.log(headers);
				let res = await RNFetchBlob.fetch("POST", `${host}main/feedback`, headers, JSON.stringify(data));
				let json = res.json();
				return json;
			}

			getConfig(): AlivePushConfig {
				return RNFetchBlob.fs.readStream(RNAlivePush.AlivePushConfigPath, 'utf8')
					.then(readStream=> {
						return new Promise((resolve, reject)=> {
							let data = [];
							readStream.onData(chunk=> {
								data.push(chunk);
							});
							readStream.onEnd(()=> {
								let jsonStr = data.join('');
								jsonStr = jsonStr.substring(jsonStr.indexOf("{"), jsonStr.lastIndexOf("}") + 1)
								let json;
								try {
									json = JSON.parse(jsonStr);
								}
								catch (ex) {
									console.error(ex, jsonStr);
									json = {};
								}
								console.log('alive push config', json);
								resolve(json);
							});
							readStream.onError(err=> {
								reject(err);
							});
							readStream.open();
						});
					}).catch(err=> {
						return {};
					});
			}

			async writeConfig(newConfig: AlivePushConfig): Promise {
				console.log('will rewrite alive push config', newConfig);
				let exists = await RNFetchBlob.fs.exists(RNAlivePush.AlivePushConfigPath);
				let str = JSON.stringify(newConfig);
				if (exists) {
					let ws = await RNFetchBlob.fs.writeStream(RNAlivePush.AlivePushConfigPath, 'utf8');
					ws.write(str);
					return ws.close();
				}
				else {
					return RNFetchBlob.fs.createFile(RNAlivePush.AlivePushConfigPath, str, 'utf8');
				}
			}

			async updateConfig(newConfig: AlivePushConfig): Promise {
				let oldConfig = await this.getConfig();
				let config = Object.assign({}, oldConfig, newConfig);
				return this.writeConfig(config);
			}

			async unzipPackage(path: String, filename: String): String {
				console.log(`unzip package file name = ${filename}`);
				this.statusChangeCallback(AlivePushStatus.unzipping);
				let targetPath = `${RNAlivePush.CachePath}/${filename}`;
				console.log(`unzip ${path} to ${targetPath}`);
				return unzip(path, targetPath)
					.then(unzipPath=> {
						// delete package cache
						return RNFetchBlob.fs.unlink(path)
							.then(()=> {
								return unzipPath;
							});
					})
			}

			async sync(): void {
				try {
					this.statusChangeCallback(AlivePushStatus.beginCheck);
					let packageInfo = await this.checkUpdate();
					this.statusChangeCallback(AlivePushStatus.endCheck);
					console.log("packageInfo", packageInfo);
					if (packageInfo.success && packageInfo.data) {
						this.statusChangeCallback(AlivePushStatus.beginDownload);
						let newPackage = await this.downloadPackage(packageInfo.data.url);
						this.statusChangeCallback(AlivePushStatus.endDownload);
						this.log();
						let packagePath = newPackage.path();
						this.statusChangeCallback(AlivePushStatus.beginUnzip);
						let unzipPath = await this.unzipPackage(packagePath, getFilenameSync(packageInfo.data.url));
						this.statusChangeCallback(AlivePushStatus.endUnzip);
						let bundlePath = `${unzipPath}/index.${Platform.OS}.js`;
						console.log(`new bundle path = ${bundlePath},inner version = ${packageInfo.data.inner}`);
						await this.updateConfig({
							path: bundlePath,
							version: packageInfo.data.inner,
							lastUpdateTime: new Date(),
							install: false
						});
						this.statusChangeCallback(AlivePushStatus.complete);
						RNAlivePush.restart();
					}
					else {
						let config = await this.getConfig();
						if (!config.install) {
							this.log({type: alivePushFeedbackType.installSuccess});
							this.updateConfig({
								install: true
							});
						}
						this.statusChangeCallback(AlivePushStatus.complete);
					}
				}
				catch (ex) {
					if (this.errorCallback) {
						this.errorCallback(ex);
					}
					else {
						throw ex;
					}
				}
			}

			render() {
				return <RootComponent {...this.props} ref={"rootComponent"}/>
			}
		}
	}
	if (typeof options === "function") {
		return decorator(options);
	} else {
		return decorator;
	}
};


export default alivePush;
