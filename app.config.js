export default {
	expo: {
	  name: "Hydro",
	  slug: "Hydro",
	  version: "1.0.0",
	  orientation: "portrait",
	  icon: "./assets/icon.png",
	  userInterfaceStyle: "light",
	  splash: {
		image: "./assets/splash.jpg",
		resizeMode: "cover",
		backgroundColor: "#ffffff",
	  },
	  assetBundlePatterns: ["**/*"],
	  ios: {
		supportsTablet: true,
		bundleIdentifier: "com.hydro.app",
	  },
	  android: {
		adaptiveIcon: {
		  foregroundImage: "./assets/adaptive-icon.png",
		  backgroundColor: "#ffffff",
		},
		package: "com.hydro.app",
	  },
	  extra: {
		eas: {
		  projectId: "5e2e44ca-e09d-405b-9839-e9abef0e427d",
		},
	  },
	},
  };
  