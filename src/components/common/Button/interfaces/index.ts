export interface PropsButton {
	onClick?: (e?: any) => void;
	children?: React.ReactNode;
	href?: any;
	div?: boolean;
	icon?: React.ReactNode;
	wrapperClasses?: string;
	[props: string]: any;
}
