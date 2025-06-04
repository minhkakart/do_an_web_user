export interface PropsSelectForm<OptionType> {
	placeholder: string;
	label?: string | React.ReactNode;

	isSearch?: boolean;
	readOnly?: boolean;

	value: string | number | null;
	options: OptionType[];

	onClean?: () => void;
	onSelect: (option: OptionType) => void;
	getOptionLabel: (option: OptionType) => string;
	getOptionValue: (option: OptionType) => string | number;
}
