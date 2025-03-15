import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';
import { CheckboxSelection } from './modules/checkbox-selection';
import { tematics } from './modules/data.ts';

document.addEventListener('DOMContentLoaded', () => {
	new CheckboxSelection('#test-1', {
		label: 'Тематика экскурсии',
		dataSource: tematics
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

	function generateRanges(start: number, end: number, step: number) {
		let ranges = [];
		for (let i = start; i <= end; i += step) {
			let rangeEnd = i + step - 1;
			if (rangeEnd > end) {
				rangeEnd = end;
			} // Убедимся, что последний диапазон не превышает end
			ranges.push({
				id: `${i}-${rangeEnd}`,
				value: `${i}-${rangeEnd}`,
				label: `${i}-${rangeEnd} детей`
			});
		}
		return ranges;
	}

	new CheckboxSelection('#test-3', {
		label: 'Количество детей',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			...generateRanges(1, 50, 5)
		]
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

	new CheckboxSelection('#test-6', {
		label: 'Время экскурсии, час',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: '0-5 часа' },
			{ id: '2', value: '2', label: '6-10 часа' },
			{ id: '3', value: '3', label: '11-20 часа' },
		]
	});

	new CheckboxSelection('#test-7', {
		label: 'Цена',
		dataSource: [
			{ id: 'all', value: '-1', label: 'Все' },
			{ id: '1', value: '1', label: '1000-2500 руб.' },
			{ id: '2', value: '2', label: '2501-4000 руб.' },
			{ id: '3', value: '3', label: '4001+ руб.' },
		]
	});

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
						console.log('right position');
						listWrapperElement.style.right = '0';
					}
					else if (dropdownListRect.left <= swiperContainerRect.left) {
						console.log('left position');
						listWrapperElement.style.left = '0';
					}
				};

				updatePosition();
				(swiperEvents.isAnimating) && (
					swiper.once('slideChangeTransitionEnd', updatePosition)
				);
			});

			dropdown?.bind('close', ({ listWrapperElement }) => {
				listWrapperElement.style.left = 'unset';
				listWrapperElement.style.right = 'unset';
			});
		});
	}
});