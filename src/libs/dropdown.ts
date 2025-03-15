type EventType = 'open' | 'close';

interface EventData {
	sender: Dropdown;
	[key: string]: any;
}

type EventCallback = (e: EventData) => void;

export interface IDropdown {
	bind(eventType: EventType, callback: EventCallback): void;
	unbind(eventType: EventType, callback: EventCallback): void;
	toggleDropdown: (event?: MouseEvent, delay?: number) => void;
	closeDropdown: () => void;
	get(id: string): Dropdown | null;
	get isOpen(): boolean;
	get listWrapperElement(): HTMLElement;
	get wrapperElement(): HTMLElement;
	get triggerElement(): HTMLElement;
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
	private _eventHandlers = new Map<EventType, Set<EventCallback>>();
	private readonly _options: DropdownOptions;
	private _isOpen = false;
	private readonly _element: HTMLElement | null;
	private readonly _wrapper = document.createElement('div');
	private readonly _triggerElement = document.createElement('span');
	private readonly _listWrapperElement = document.createElement('div');

	constructor(selector: DropdownSelector, options: Partial<DropdownOptions> = {}) {
		this._element = selector instanceof HTMLElement ? selector : document.querySelector(selector);

		if (this._element === null) {
			throw new Error(`No dropdown element found for selector "${selector}"`);
		}

		this._options = Object.assign(DEFAULT_DROPDOWN_OPTIONS, options);
		this.init(this._element);
		Dropdown.instances.set(this._element.id, this);
	}

	private init(element: HTMLElement) {
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
		this._triggerElement.textContent = label;
		this._triggerElement.onclick = this.toggleDropdown.bind(this);

		this._listWrapperElement.classList.add(listWrapperClassName);

		this._wrapper.prepend(this._triggerElement);
		this._wrapper.append(this._listWrapperElement);
	}

	public toggleDropdown(_?: MouseEvent, delay?: number) {
		setTimeout(() => {
			this._isOpen = !this._isOpen;
			this._wrapper.classList.toggle(this._options.activeClassName);
			this._listWrapperElement.style.display = this._isOpen ? 'block' : 'none';
			this.trigger(this._isOpen ? 'open' : 'close', {
				wrapperElement: this._wrapper,
				listWrapperElement: this._listWrapperElement,
			});

			if (this._isOpen) {
				document.addEventListener('click', this.handleDocumentClick);
			}
			else {
				document.removeEventListener('click', this.handleDocumentClick);
			}
		}, delay);
	};

	private handleDocumentClick = ({ target }: MouseEvent) => {
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
			this.trigger('close', {
				wrapperElement: this._wrapper,
				listWrapperElement: this._listWrapperElement,
			});
		}
	}

	public bind(eventType: EventType, callback: EventCallback) {
		!this._eventHandlers.has(eventType) && (
			this._eventHandlers.set(eventType, new Set())
		);
		this._eventHandlers.get(eventType)?.add(callback);
	}

	public unbind(eventType: EventType, callback: EventCallback) {
		this._eventHandlers.get(eventType)?.delete(callback);
	}

	private trigger(eventType: EventType, data: Omit<EventData, 'sender'>) {
		const eventData: EventData = {
			sender: this,
			...data
		};
		this._eventHandlers.get(eventType)?.forEach(callback => callback(eventData));
	}
	
	public get wrapperElement() {
		return this._wrapper;
	}

	public get triggerElement() {
		return this._triggerElement;
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