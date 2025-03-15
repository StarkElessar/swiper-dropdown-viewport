import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
	return {
		base: command === 'serve' ? '/' : '/swiper-dropdown-viewport/',
		server: {
			host: '0.0.0.0',
			port: 3000
		}
	};
});