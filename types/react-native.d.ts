import 'react-native';

declare module 'react-native' {
	export interface ViewProps {
		style?: any;
		children?: React.ReactNode;
	}

	export interface TextProps {
		style?: any;
		children?: React.ReactNode;
	}

	export interface TouchableOpacityProps {
		style?: any;
		onPress?: () => void;
		disabled?: boolean;
		children?: React.ReactNode;
	}

	export interface ScrollViewProps {
		style?: any;
		contentContainerStyle?: any;
		showsVerticalScrollIndicator?: boolean;
		children?: React.ReactNode;
	}

	export interface TextInputProps {
		style?: any;
		value?: string;
		onChangeText?: (text: string) => void;
		placeholder?: string;
		placeholderTextColor?: string;
		keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
	}

	export interface ImageProps {
		style?: any;
		source: { uri: string } | number;
	}

	export interface ModalProps {
		visible?: boolean;
		transparent?: boolean;
		animationType?: 'none' | 'slide' | 'fade';
		onRequestClose?: () => void;
		children?: React.ReactNode;
	}
}