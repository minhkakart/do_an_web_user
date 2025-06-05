export interface PropsDialog {
	open: boolean;
	title: string;
	note?: string | React.ReactNode;
	icon?: React.ReactNode;
	onClose: () => any;
	onSubmit: () => any;
	titleCancel?: string;
	titleSubmit?: string;
	type?: 'primary' | 'error' | 'warning';
}
