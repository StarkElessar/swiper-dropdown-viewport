import { Dropdown, type DropdownOptions, DEFAULT_DROPDOWN_OPTIONS } from '../../libs/dropdown.ts';

interface DataSourceItem {
	id: string;
	value: string;
	label: string;
}

interface Options extends DropdownOptions {
	listClassName: string;
	listItemClassName: string;
	itemLabelClassName: string;
	dataSource: DataSourceItem[];
	scrollHint: boolean;
}

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_DROPDOWN_OPTIONS,
	listClassName: 'dropdown-list',
	listItemClassName: 'dropdown-item',
	itemLabelClassName: 'dropdown-item-label',
	dataSource: [],
	scrollHint: true
};

export class CheckboxSelection extends Dropdown {
	private readonly _checkboxSelectionOptions: Options;
	private readonly _listElement = document.createElement('ul');

	constructor(selector: string | HTMLElement, options: Partial<Options> = {}) {
		super(selector, options);
		this._checkboxSelectionOptions = Object.assign(DEFAULT_OPTIONS, options);
		this.initialize();
	}

	private initialize() {
		const {
			dataSource,
			listItemClassName,
			listClassName,
			itemLabelClassName
		} = this._checkboxSelectionOptions;

		this._listElement.classList.add(listClassName);
		this._listElement.innerHTML = dataSource.reduce((acc, item) => {
			return acc + `
				<li id="${item.id}" class="${listItemClassName}">
					<label class="${itemLabelClassName}">
						<input type="checkbox" value="${item.value}">
						${item.label}
					</label>
				</li>
			`;
		}, '');

		this.listWrapperElement.append(this._listElement);
		this.observeScrollHint();
	}

	public toggleDropdown() {
		super.toggleDropdown.call(this);
		this._checkboxSelectionOptions.scrollHint && (
			setTimeout(this.checkScroll)
		);
	}

	private checkScroll = () => {
		const list = this._listElement;
		const scrollHint = list.querySelector<HTMLLIElement>('#scrollHint');
		const observeTarget = list.querySelector<HTMLLIElement>('#observeTarget');

		if (list.scrollHeight <= list.clientHeight + 5) {
			observeTarget?.remove();
			scrollHint?.remove();
		}
	};

	private observeScrollHint = () => {
		if (this._checkboxSelectionOptions.scrollHint) {
			this._listElement.insertAdjacentHTML('beforeend', `
				<li class="scroll-hint" id="scrollHint"></li>
				<li id="observeTarget" style="height: 1px"></li>
			`);

			const observerTarget = this._listElement.querySelector<HTMLLIElement>('#observeTarget');
			const scrollHint = this._listElement.querySelector<HTMLLIElement>('#scrollHint');

			if (observerTarget && scrollHint) {
				const observer = new IntersectionObserver(([entry]) => {
					scrollHint?.classList.toggle('hidden', entry.isIntersecting);
				}, {
					root: this._listElement,
					threshold: [0.2],
					rootMargin: '5px'
				});

				observer.observe(observerTarget);
			}
		}
	};
}