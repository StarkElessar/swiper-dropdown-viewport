export interface IDropdown {
	toggleDropdown: (event: MouseEvent, delay?: number) => void;
	closeDropdown: () => void;
	get(id: string): Dropdown | null;
	get isOpen(): boolean;
	get listWrapperElement(): HTMLElement;
	get wrapperElement(): HTMLElement;
}

export type DropdownSelector = string | HTMLElement;

export interface DropdownOptions {
	label: string;
	triggerClassName: string;
	wrapperClassName: string;
	activeClassName: string;
	listWrapperClassName: string;
}

export const DEFAULT_DROPDOWN_OPTIONS: DropdownOptions = {
	label: 'Выберите элемент',
	triggerClassName: 'dropdown-trigger',
	wrapperClassName: 'dropdown-wrapper',
	activeClassName: 'dropdown-active',
	listWrapperClassName: 'dropdown-list-wrapper',
};

export class Dropdown implements IDropdown {
	private static instances = new Map<string, Dropdown>();
	private readonly _options: DropdownOptions;
	private _isOpen = false;
	private readonly _element: HTMLElement | null;
	private readonly _wrapper = document.createElement('div');
	private readonly _triggerElement = document.createElement('button');
	private readonly _listWrapperElement = document.createElement('div');

	constructor(selector: DropdownSelector, options: Partial<DropdownOptions> = {}) {
		this._element = selector instanceof HTMLElement ? selector : document.querySelector(selector);

		if (this._element === null) {
			throw new Error(`No dropdown element found for selector "${selector}"`);
		}

		this._options = Object.assign(DEFAULT_DROPDOWN_OPTIONS, options);
		this.init(this._element).then(() => {
			const id = this._element?.id;
			id && (Dropdown.instances.set(id, this));
		});
	}

	private async init(element: HTMLElement) {
		const {
			label,
			triggerClassName,
			wrapperClassName,
			listWrapperClassName
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

		this._wrapper.prepend(this._triggerElement);
		this._wrapper.append(this._listWrapperElement);
	}

	public toggleDropdown = (_: MouseEvent, delay?: number) => {
		setTimeout(() => {
			this._isOpen = !this._isOpen;
			this._wrapper.classList.toggle(this._options.activeClassName);
			this._listWrapperElement.style.display = this._isOpen ? 'block' : 'none';

			if (this._isOpen) {
				document.addEventListener('click', this.handleDocumentClick);
			}
			else {
				document.removeEventListener('click', this.handleDocumentClick);
			}
		}, delay);
	};

	private handleDocumentClick = (e: MouseEvent) => {
		const target = e.target;

		if (target instanceof Node && !this._wrapper.contains(target)) {
			this.closeDropdown();
			document.removeEventListener('click', this.handleDocumentClick);
		}
	};

	public closeDropdown() {
		if (this._isOpen) {
			this._isOpen = false;
			this._wrapper.classList.remove(this._options.activeClassName);
			this._listWrapperElement.style.display = 'none';
		}
	}
	
	public get wrapperElement() {
		return this._wrapper;
	}
	
	public get listWrapperElement() {
		return this._listWrapperElement;
	}

	public static get(id: string): Dropdown | null {
		return this.instances.get(id) ?? null;
	}

	public get(id: string): Dropdown | null {
		return Dropdown.instances.get(id) ?? null;
	}

	public get isOpen() {
		return this._isOpen;
	}
}