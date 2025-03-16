import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import { CheckboxSelection } from './modules/checkbox-selection';
import { tematics } from './modules/data';
import { RangeDropdown } from './modules/range-dropdown';

document.addEventListener('DOMContentLoaded', () => {
	const ddTematics = new CheckboxSelection('#test-1', {
		label: 'Тематика экскурсии',
		dataSource: tematics
	});

	ddTematics.bind('change', (data) => {
		console.log('change >> ', data);
	});

	new CheckboxSelection('#test-2', {
		label: 'Возраст детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...[...Array(11)].map((_, index) => ({
				id: `${index + 1}`,
				value: `${index + 1}`,
				label: `${index + 1} класс`
			}))
		]
	});

	const childrenDropdown = new RangeDropdown('#test-3', {
		label: 'Количество детей',
		nameFrom: 'childFrom',
		nameTo: 'childTo',
	});

	childrenDropdown.bind('change', (data) => {
		console.log('childrenDropdown change >> ', data);
	});

	new CheckboxSelection('#test-4', {
		label: 'Как далеко едем?',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: 'Город' },
			{ id: '2', value: '2', label: 'Пригород' },
			{ id: '3', value: '3', label: 'Межгород' }
		]
	});

	new CheckboxSelection('#test-5', {
		label: 'Время года',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: 'Зима' },
			{ id: '2', value: '2', label: 'Весна' },
			{ id: '3', value: '3', label: 'Лето' },
			{ id: '4', value: '4', label: 'Осень' },
		]
	});

	const timeDropdown = new RangeDropdown('#test-6', {
		label: 'Время экскурсии, час',
		nameFrom: 'timeFrom',
		nameTo: 'timeTo',
	});

	timeDropdown.bind('change', (data) => {
		console.log('timeDropdown change >> ', data);
	});

	const priceDropdown = new RangeDropdown('#test-7', {
		label: 'Цена, ₽',
		nameFrom: 'priceFrom',
		nameTo: 'priceTo',
	});

	priceDropdown.bind('change', (data) => {
		console.log('priceDropdown change >> ', data);
	})

	const sliderContainer = document.getElementById('swiper');

	if (sliderContainer) {
		const swiperEvents = { isAnimating: false };
		const swiper = new Swiper(sliderContainer, {
			modules: [FreeMode],
			spaceBetween: 30,
			slidesPerView: 'auto',
			freeMode: true,
			on: {
				slideChangeTransitionStart: () => swiperEvents.isAnimating = true,
				slideChangeTransitionEnd: () => swiperEvents.isAnimating = false
			}
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

		document.querySelectorAll('select').forEach((el) => {
			const dropdown = CheckboxSelection.get(el.id);
			dropdown?.bind('open', ({ listWrapperElement }) => {
				const updatePosition = () => {
					const swiperContainerRect = swiper.el.getBoundingClientRect();
					const dropdownListRect = listWrapperElement.getBoundingClientRect();

					if (swiperContainerRect.right <= dropdownListRect.right) {
						listWrapperElement.style.right = '0';
					}
					else if (dropdownListRect.left <= swiperContainerRect.left) {
						listWrapperElement.style.left = '0';
					}
				};

				updatePosition();
				(swiperEvents.isAnimating) && (
					swiper.once('slideChangeTransitionEnd', updatePosition)
				);
			});
		});
	}
});