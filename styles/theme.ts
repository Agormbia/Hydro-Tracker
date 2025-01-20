export const lightTheme = {
	colors: {
		background: '#f5f5f5',
		surface: '#ffffff',
		primary: '#2196F3',
		text: '#333333',
		textSecondary: '#666666',
		border: '#f0f0f0',
		danger: '#ff4444',
		success: '#4caf50',
		warning: '#ff9800',
	},
};

export const darkTheme = {
	colors: {
		background: '#121212',
		surface: '#1e1e1e',
		primary: '#90caf9',
		text: '#ffffff',
		textSecondary: '#b0b0b0',
		border: '#2c2c2c',
		danger: '#ff5252',
		success: '#69f0ae',
		warning: '#ffb74d',
	},
};

export type Theme = typeof lightTheme;