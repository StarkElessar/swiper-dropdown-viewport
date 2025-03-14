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
}

const DEFAULT_OPTIONS: Options = {
	...DEFAULT_DROPDOWN_OPTIONS,
	listClassName: 'dropdown-list',
	listItemClassName: 'dropdown-item',
	itemLabelClassName: 'dropdown-item-label',
	dataSource: []
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
			itemLabelClassName,
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
	}
}

// @ts-ignore
window.CheckboxSelection = CheckboxSelection;