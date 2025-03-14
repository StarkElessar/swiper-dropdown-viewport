import Swiper from 'swiper';
import { Dropdown } from './modules/dropdown';

document.addEventListener('DOMContentLoaded', () => {
	const dropdown1 = new Dropdown('#test-1', {
		label: 'Тематика экскурсии',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: 'Спортивные' },
			{ id: '2', value: '2', label: 'Популярные' }
		]
	});

	const dropdown2 = new Dropdown('#test-2', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown3 = new Dropdown('#test-3', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown4 = new Dropdown('#test-4', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown5 = new Dropdown('#test-5', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown6 = new Dropdown('#test-6', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown7 = new Dropdown('#test-7', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown8 = new Dropdown('#test-8', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown9 = new Dropdown('#test-9', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const dropdown10 = new Dropdown('#test-10', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`,
			}))
		]
	});

	const sliderContainer = document.getElementById('swiper');

	if (sliderContainer) {
		const swiper = new Swiper(sliderContainer, {
			spaceBetween: 30,
			slidesPerView: 'auto',
			grabCursor: true
		});

		swiper.slides.forEach((slide, index) => {
			slide.addEventListener('click', () => {
				console.log('clicked >> ', slide, index);
				const slideRect = slide.getBoundingClientRect();
				const swiperRect = swiper.el.getBoundingClientRect();

				// Проверяем, если слайд частично выходит за границы контейнера
				if (slideRect.left < swiperRect.left || slideRect.right > swiperRect.right) {
					swiper.slideTo(index);
				}
			});
		});
	}
});