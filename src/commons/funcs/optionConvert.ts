import moment from 'moment';

export function removeVietnameseTones(str: string): string {
	return str
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');
}

export function convertWeight(weight: number | null) {
	if (!weight) {
		return 0;
	}

	return (weight / 1000).toLocaleString('vi-VN', {minimumFractionDigits: 3, maximumFractionDigits: 3});
}

export function obfuscateEmail(email: string) {
	// Tách phần trước @ và phần tên miền
	const [username, domain] = email.split('@');

	// Giữ lại ký tự đầu tiên và cuối cùng của tên người dùng
	const firstChar = username[0];
	const lastChar = username[username.length - 1];

	// Tạo phần che giấu giữa
	const middleHidden = '...';

	// Tạo tên người dùng mới với phần che giấu
	const newUsername = firstChar + middleHidden + lastChar;

	// Kết hợp với tên miền để tạo email đã che giấu
	const obfuscatedEmail = newUsername + '@' + domain;

	return obfuscatedEmail;
}

export default function fancyTimeFormat(duration: number) {
	// Hours, minutes and seconds
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = '';

	if (hrs > 0) {
		ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
	}

	ret += '' + mins + ':' + (secs < 10 ? '0' : '');
	ret += '' + secs;
	return ret;
}

export function getTextAddress(detailAddress: any, address?: string): string {
	if (!detailAddress?.province && !detailAddress?.district && !detailAddress?.town && !address) {
		return '---';
	}

	const parts = [address, detailAddress?.town?.name, detailAddress?.district?.name, detailAddress?.province?.name].filter(Boolean);

	return parts.length ? parts.join(', ') : '---';
}

export function numberToWords(number: number) {
	if (typeof number !== 'number' || isNaN(number)) {
		return 'Không hợp lệ';
	}

	if (number === 0) {
		return 'Không đồng';
	}

	const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
	const levels = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ', 'tỷ tỷ'];

	function readThreeDigits(num: number) {
		let str = '';
		const hundred = Math.floor(num / 100);
		const ten = Math.floor((num % 100) / 10);
		const unit = num % 10;

		if (hundred > 0) {
			str += units[hundred] + ' trăm';
			if (ten === 0 && unit > 0) str += ' linh';
		}

		if (ten > 1) {
			str += ' ' + units[ten] + ' mươi';
			if (unit === 1) str += ' mốt';
			else if (unit === 5) str += ' lăm';
			else if (unit > 0) str += ' ' + units[unit];
		} else if (ten === 1) {
			str += ' mười';
			if (unit > 0) str += ' ' + units[unit];
		} else if (unit > 0) {
			str += ' ' + units[unit];
		}

		return str.trim();
	}

	function splitIntoChunks(num: number) {
		const chunks = [];
		while (num > 0) {
			chunks.push(num % 1000);
			num = Math.floor(num / 1000);
		}
		return chunks;
	}

	const chunks = splitIntoChunks(number);
	let result = '';

	for (let i = chunks.length - 1; i >= 0; i--) {
		if (chunks[i] > 0) {
			result += readThreeDigits(chunks[i]) + ' ' + levels[i] + ' ';
		}
	}

	result = result.trim().replace(/\s+/g, ' ');
	result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
	return result;
}
