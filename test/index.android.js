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
	NativeModules
} from 'react-native';
const {RNAlivePush}=NativeModules;
import {Restart} from 'react-native-restart'


export default class test extends Component {
	alivePushStatusChange(status) {
		console.log(`status:${status}`);
	}

	alivePushError(ex) {
		console.log(ex);
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.button}>Button</Text>
				<Text
					onPress={event=>{
						RNAlivePush.restart();
					}}
					style={styles.button}>restart</Text>
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
		paddingHorizontal: 20
	}
});

import alivePush from './alivePush'
const TestWrapper = alivePush({
	deploymentKey: "test"
})(test);
AppRegistry.registerComponent('test', () => TestWrapper);
// AppRegistry.registerComponent('test', () => test);
