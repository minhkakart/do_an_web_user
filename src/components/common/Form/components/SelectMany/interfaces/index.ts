import {Dispatch, SetStateAction} from 'react';

export interface PropsSelectMany<OptionType> {
	text: string;
	placeholder: string;
	label?: string | React.ReactNode;

	isSearch?: boolean;
	readOnly?: boolean;
	showSelectedItems?: boolean;

	disabledItems?: Array<string | number>;
	selectedItems: Array<string | number>;
	options: OptionType[];
	title?: string;

	onClickSelect?: () => void;
	setSelectedItems?: Dispatch<SetStateAction<Array<string | number>>>;
	getOptionLabel: (option: OptionType) => string;
	getOptionValue: (option: OptionType) => string | number;
	onRemove?: (item: string | number) => void;
}
