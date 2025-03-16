import { Dropdown, type DropdownOptions, type Selector, DEFAULT_DROPDOWN_OPTIONS, DROPDOWN_EVENTS } from '../../libs/dropdown.ts';

const EVENTS = {
	...DROPDOWN_EVENTS,
	CHANGE: 'change'
} as const;

type Events = typeof EVENTS[keyof typeof EVENTS];

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

const DEFAULT_TEXTS = {
	PLACEHOLDER: 'Выберите опции',
	ALL_SELECTED: 'Выбраны все',
	SELECTED_COUNT: 'Выбрано:',
	ALL_OPTION_TEXT: 'Все',
	ALL_OPTION_VALUE: '-1'
} as const;

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_DROPDOWN_OPTIONS,
	listClassName: 'dropdown-list',
	listItemClassName: 'dropdown-item',
	itemLabelClassName: 'dropdown-item-label',
	dataSource: [],
	scrollHint: true
};

export class CheckboxSelection extends Dropdown<Events> {
	protected override options: Options;
	private _selectedValues = new Set<string>();
	private readonly _listElement = document.createElement('ul');

	constructor(selector: Selector, options: Partial<Options> = {}) {
		super(selector, { ...DEFAULT_OPTIONS, ...options });
		this.options = { ...DEFAULT_OPTIONS, ...options };
		this.initialize();
	}

	private initialize() {
		const {
			dataSource,
			listItemClassName,
			listClassName,
			itemLabelClassName
		} = this.options;

		this._listElement.classList.add(listClassName);
		this._listElement.onchange = this.handleOptionsChange;
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
		this.options.scrollHint && (
			setTimeout(this.checkScroll)
		);
	}

	private handleOptionsChange = ({ target }: Event) => {
		if (target instanceof HTMLInputElement) {
			if (target.value === DEFAULT_TEXTS.ALL_OPTION_VALUE) {
				this.handleSelectAll(target.checked);
			}
			else {
				this.handleSingleOptionChange(target);
			}
			this.trigger(EVENTS.CHANGE, { selectedValues: this._selectedValues });
		}
	};

	private handleSelectAll(checked: boolean) {
		const selector = `input[type="checkbox"]:not([value="${DEFAULT_TEXTS.ALL_OPTION_VALUE}"])`;
		const checkboxes = this._listElement.querySelectorAll<HTMLInputElement>(selector);

		checkboxes.forEach(checkbox => {
			checkbox.checked = checked;
			checked ? this._selectedValues.add(checkbox.value) : this._selectedValues.delete(checkbox.value);
		});
	}

	private handleSingleOptionChange(checkbox: HTMLInputElement) {
		const allCheckbox = this._listElement.querySelector<HTMLInputElement>(`input[value="${DEFAULT_TEXTS.ALL_OPTION_VALUE}"]`);

		if (checkbox.checked) {
			this._selectedValues.add(checkbox.value);
		}
		else {
			allCheckbox && (allCheckbox.checked = false);
		}

		const checkboxSelector = `input[type="checkbox"]:not([value="${DEFAULT_TEXTS.ALL_OPTION_VALUE}"]`;
		const checkboxes = this._listElement.querySelectorAll<HTMLInputElement>(checkboxSelector);
		const allChecked = [...checkboxes].every(cb => cb.checked);
		allCheckbox && (allCheckbox.checked = allChecked);
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
		if (this.options.scrollHint) {
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