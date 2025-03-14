interface DataSourceItem {
	id: string;
	value: string;
	label: string;
}

interface Options {
	label: string;
	triggerClassName: string;
	wrapperClassName: string;
	listClassName: string;
	listWrapperClassName: string;
	listItemClassName: string;
	itemLabelClassName: string;
	dropdownActiveClassName: string;
	dataSource: DataSourceItem[];
}

const DEFAULT_OPTIONS: Options = {
	label: 'Выберите элемент',
	triggerClassName: 'dropdown-trigger',
	wrapperClassName: 'dropdown-wrapper',
	listClassName: 'dropdown-list',
	listWrapperClassName: 'dropdown-list-wrapper',
	listItemClassName: 'dropdown-item',
	itemLabelClassName: 'dropdown-item-label',
	dropdownActiveClassName: 'active',
	dataSource: [],
};

export class Dropdown {
	private readonly _element: HTMLElement | null;
	private readonly _options: Options;
	private _isOpen = false;
	private readonly _wrapper = document.createElement('div');
	private readonly _triggerElement = document.createElement('button');
	private readonly _listWrapperElement = document.createElement('div');
	private readonly _listElement = document.createElement('ul');

	constructor(selector: string | HTMLElement, options: Partial<Options> = {}) {
		this._element = selector instanceof HTMLElement ? selector : document.querySelector(selector);

		if (this._element === null) {
			throw new Error(`No element found for selector "${selector}"`);
		}

		this._options = Object.assign(DEFAULT_OPTIONS, options);

		this.init(this._element);
	}

	private init(element: HTMLElement) {
		const {
			label,
			triggerClassName,
			wrapperClassName,
			dataSource,
			listItemClassName,
			listClassName,
			itemLabelClassName,
			listWrapperClassName,
		} = this._options;

		this._wrapper.classList.add(wrapperClassName);
		element.parentNode?.insertBefore(this._wrapper, element);
		element.style.display = 'none';
		this._wrapper.appendChild(element);

		this._triggerElement.classList.add(triggerClassName);
		this._triggerElement.type = 'button';
		this._triggerElement.textContent = label;
		this._triggerElement.onclick = this.toggleDropdown;

		this._listWrapperElement.classList.add(listWrapperClassName);

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

		this._listWrapperElement.append(this._listElement);
		this._wrapper.prepend(this._triggerElement);
		this._wrapper.append(this._listWrapperElement);
	}

	private toggleDropdown = () => {
		this._isOpen = !this._isOpen;
		this._wrapper.classList.toggle(this._options.dropdownActiveClassName);

		if (this._isOpen) {
			document.addEventListener('click', this.handleDocumentClick);
		}
		else {
			document.removeEventListener('click', this.handleDocumentClick);
		}
	}

	private handleDocumentClick = (e: MouseEvent) => {
		const target = e.target;

		if (target instanceof Node && !this._wrapper.contains(target)) {
			this.closeDropdown();
			document.removeEventListener('click', this.handleDocumentClick);
		}
	}

	private closeDropdown() {
		if (this._isOpen) {
			this._isOpen = false;
			this._wrapper.classList.remove(this._options.dropdownActiveClassName);
		}
	}
}