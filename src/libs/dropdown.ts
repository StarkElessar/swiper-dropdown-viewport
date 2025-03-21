export const DROPDOWN_EVENTS = {
	CLOSE: 'close',
	OPEN: 'open',
} as const;

type Events = typeof DROPDOWN_EVENTS[keyof typeof DROPDOWN_EVENTS];

interface EventData<T extends string = Events> {
	sender: Dropdown<T>;
	[key: string]: any;
}

type EventCallback<T extends string = Events> = (e: EventData<T>) => void;

export type Selector = string | HTMLElement;

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
	listWrapperClassName: 'dropdown-list-wrapper'
};

export class Dropdown<T extends string = Events> {
	private static instances = new Map<string, Dropdown<any>>();
	private _eventHandlers = new Map<T | Events, Set<EventCallback<T>>>();
	protected options: DropdownOptions;
	private _isOpen = false;
	private readonly _originalSelect: HTMLElement | null;
	private readonly _wrapper = document.createElement('div');
	private readonly _triggerElement = document.createElement('span');
	private readonly _listWrapperElement = document.createElement('div');

	constructor(selector: Selector, options: Partial<DropdownOptions> = {}) {
		this._originalSelect = selector instanceof HTMLElement ? selector : document.querySelector(selector);

		if (this._originalSelect === null) {
			throw new Error(`No dropdown element found for selector "${selector}"`);
		}

		this.options = { ...DEFAULT_DROPDOWN_OPTIONS, ...options };
		this.init(this._originalSelect);
		Dropdown.instances.set(this._originalSelect.id, this);
	}

	private init(element: HTMLElement) {
		const {
			label,
			triggerClassName,
			wrapperClassName,
			listWrapperClassName
		} = this.options;

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
			this._wrapper.classList.toggle(this.options.activeClassName);

			this.trigger(this._isOpen ? DROPDOWN_EVENTS.OPEN : DROPDOWN_EVENTS.CLOSE, {
				wrapperElement: this._wrapper,
				listWrapperElement: this._listWrapperElement
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
			this._wrapper.classList.remove(this.options.activeClassName);

			this.trigger(DROPDOWN_EVENTS.CLOSE, {
				wrapperElement: this._wrapper,
				listWrapperElement: this._listWrapperElement
			});
		}
	}

	public bind(eventType: T, callback: EventCallback<T>) {
		!this._eventHandlers.has(eventType) && (
			this._eventHandlers.set(eventType, new Set())
		);
		this._eventHandlers.get(eventType)?.add(callback);
	}

	public unbind(eventType: T, callback: EventCallback<T>) {
		this._eventHandlers.get(eventType)?.delete(callback);
	}

	protected trigger(eventType: T | Events, data: Omit<EventData<T | Events>, 'sender'>) {
		this._eventHandlers.get(eventType)?.forEach(callback => (
			callback({ sender: this, ...data }))
		);
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

	public get isOpen() {
		return this._isOpen;
	}
}