import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import { CheckboxSelection } from './modules/checkbox-selection';

document.addEventListener('DOMContentLoaded', () => {
	new CheckboxSelection('#test-1', {
		label: 'Тематика экскурсии',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: 'Спортивные' },
			{ id: '2', value: '2', label: 'Популярные' }
		]
	});

	new CheckboxSelection('#test-2', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-3', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-4', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-5', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-6', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-7', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-8', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-9', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	new CheckboxSelection('#test-10', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(8)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	const sliderContainer = document.getElementById('swiper');

	if (sliderContainer) {
		const swiper = new Swiper(sliderContainer, {
			modules: [FreeMode],
			spaceBetween: 30,
			slidesPerView: 'auto',
			freeMode: true
		});

		swiper.slides.forEach((slide, index) => {
			slide.addEventListener('click', () => {
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