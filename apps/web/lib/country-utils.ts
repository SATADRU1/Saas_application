import * as ct from "countries-and-timezones"

export function getCountryFromTimeZone(timeZone?: string) {
    if(!timeZone) {
        return null;
    }
    
    const timezoneinfo = ct.getTimezone(timeZone);
    if(!timezoneinfo?.countries?.length) {
        return null;
    }
    
    const countryCode = timezoneinfo.countries[0];
    const country = ct.getCountry(countryCode as string);
    return {
        code: countryCode,
        name: country?.name || countryCode
    }
}   


export function getCountryFlagUrl(countryCode: string) {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}