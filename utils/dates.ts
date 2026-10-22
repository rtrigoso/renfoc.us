const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateWithOffset(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');

    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);

    const day = DAYS[date.getDay()];
    const month = MONTHS[date.getMonth()];
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const offset = `${sign}${pad(Math.floor(absOffset / 60))}${pad(absOffset % 60)}`;

    return `${day} ${month} ${pad(date.getDate())} ${time} ${date.getFullYear()} ${offset}`;
}
