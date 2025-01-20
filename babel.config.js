module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			'babel-preset-expo',
			['@babel/preset-typescript', { allowNamespaces: true }]
		],
		plugins: [
			'react-native-reanimated/plugin',
			['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
			[
				'module-resolver',
				{
					root: ['./'],
					extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
					alias: {
						'@types': './types'
					}
				}
			]
		]
	};
};

