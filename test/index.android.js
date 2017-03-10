/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from 'react';
import {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	NativeModules,
	Alert
} from 'react-native';
import alivePush from 'react-native-alive-push'
// import alivePush from './alivepush'
const {RNAlivePush}=NativeModules;
import RNFetchBlob from 'react-native-fetch-blob'


@alivePush({
	deploymentKey: "2a2b1bbefc9450b556c034dd86fd3ab2",
	onBeforeRestart: (restartCallback)=> {
		Alert.alert(
			'提示',
			'是否马上进行重启?',
			[
				{text: '否'},
				{
					text: '是',
					onPress: ()=> {
						restartCallback();
					}
				}
			],
			{cancelable: false}
		)
	}
})
export default class test extends Component {
	alivePushStatusChange(status) {
		console.log('alivePushStatusChange', status);
	}

	alivePushError(ex) {
		console.log('alivePushError', ex);
	}

	alivePushDownloadProgress(...args) {
		console.log('alivePushDownloadProgress', args);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.button}>Button</Text>
				<Text
					style={styles.button}
					onPress={event=>{
						async function showChildren(path){
							let files = await RNFetchBlob.fs.ls(path)
							console.log(path,files);
							for(let i=0;i<files.length;i++){
								let subpath=`${path}/${files[i]}`;
								try{
									let isdir=await RNFetchBlob.fs.isDir(subpath);
									if(isdir){
										await showChildren(subpath);
									}
								}
								catch(ex){
									console.log(ex);
								}

							}
						}
						showChildren(RNAlivePush.CachePath+"/10001");
				}}>ls</Text>
				<Text
					onPress={async event=>{
						let exists = await RNFetchBlob.fs.exists(RNAlivePush.AlivePushConfigPath);
						let str = JSON.stringify({});
						if (exists) {
							let ws = await RNFetchBlob.fs.writeStream(RNAlivePush.AlivePushConfigPath, 'utf8');
							ws.write(str);
							return ws.close();
						}
						else {
							return RNFetchBlob.fs.createFile(RNAlivePush.AlivePushConfigPath, str, 'utf8');
						}
					}}
					style={styles.button}>clear alive push config</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	button: {
		backgroundColor: "black",
		color: "white",
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginTop: 10
	}
});

AppRegistry.registerComponent('test', () => test);
