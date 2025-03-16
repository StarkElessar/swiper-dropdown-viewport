import { Dropdown, DROPDOWN_EVENTS, DEFAULT_DROPDOWN_OPTIONS, type DropdownOptions, type Selector } from '../libs/dropdown.ts';

const RANGE_DROPDOWN_EVENTS = {
	...DROPDOWN_EVENTS,
	CHANGE: 'change'
} as const;

type Events = typeof RANGE_DROPDOWN_EVENTS[keyof typeof RANGE_DROPDOWN_EVENTS];

interface Options extends DropdownOptions {
	label: string;
	inputClassName: string;
	inputContainerClassName: string;
	nameFrom: string;
	nameTo: string;
	placeholderFrom?: string;
	placeholderTo?: string;
}

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_DROPDOWN_OPTIONS,
	label: 'Введите параметры',
	inputClassName: 'range-dropdown-input',
	inputContainerClassName: 'range-dropdown-inputs',
	nameFrom: 'from',
	nameTo: 'to',
	placeholderFrom: 'От',
	placeholderTo: 'До'
};

export class RangeDropdown extends Dropdown<Events> {
	protected override options: Options;
	private readonly _inputFromElement: HTMLInputElement;
	private readonly _inputToElement: HTMLInputElement;

	constructor(selector: Selector, options: Partial<Options> = {}) {
		super(selector, { ...DEFAULT_OPTIONS, ...options });
		this.options = { ...DEFAULT_OPTIONS, ...options };
		const { nameTo, nameFrom, placeholderFrom = '', placeholderTo = '' } = this.options;
		this._inputFromElement = this.getInputElement(nameFrom, placeholderFrom);
		this._inputToElement = this.getInputElement(nameTo, placeholderTo);
		this.initialize();
		this.bind('open', () => this._inputFromElement.select());
	}

	private initialize() {
		const { inputContainerClassName } = this.options;
		const box = document.createElement('div');
		box.classList.add(inputContainerClassName);
		box.append(this._inputFromElement, this._inputToElement);
		this.listWrapperElement.append(box);

		this._inputFromElement.oninput = ({ target }) => {
			if (target instanceof HTMLInputElement) {
				const value = target.value = target.value.replace(/\D/g, '');
				const toValue = Number(this._inputToElement.value) || null;

				(toValue !== null && Number(value) > toValue) && (
					this._inputToElement.value = ''
				);
			}

			this.changeTrigger();
		};

		this._inputToElement.oninput = ({ target }) => {
			if (target instanceof HTMLInputElement) {
				const value = target.value = target.value.replace(/\D/g, '');
				const fromValue = Number(this._inputFromElement.value) || null;

				(fromValue !== null && Number(value) < fromValue) && (
					this._inputFromElement.value = ''
				);
			}

			this.changeTrigger();
		};
	}

	private changeTrigger = () => {
		const from = Number(this._inputFromElement.value) || null;
		const to = Number(this._inputToElement.value) || null;
		this.trigger('change', { from, to });
	};

	private getInputElement(name: string, placeholder: string) {
		const input = document.createElement('input');

		input.classList.add(this.options.inputClassName);
		input.name = name;
		input.type = 'text';
		input.inputMode = 'numeric';
		input.placeholder = placeholder;

		return input;
	}
}