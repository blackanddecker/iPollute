const FALLBACK_COUNTRY = 'GB';

const COUNTRY_CURRENCY = {
  'AX': 'EUR',
  'AL': 'EUR',
  'AS': 'USD',
  'AD': 'EUR',
  'AI': 'USD',
  'AG': 'USD',
  'AW': 'USD',
  'AU': 'AUD',
  'AT': 'EUR',
  'BS': 'USD',
  'BB': 'USD',
  'BY': 'EUR',
  'BE': 'EUR',
  'BZ': 'USD',
  'BM': 'USD',
  'BA': 'EUR',
  'BG': 'EUR',
  'CA': 'USD',
  'KY': 'USD',
  'CC': 'AUD',
  'CK': 'AUD',
  'CR': 'USD',
  'HR': 'EUR',
  'CU': 'USD',
  'CX': 'AUD',
  'CZ': 'EUR',
  'DK': 'EUR',
  'DM': 'USD',
  'DO': 'USD',
  'SV': 'USD',
  'EE': 'EUR',
  'FO': 'EUR',
  'FJ': 'AUD',
  'FI': 'EUR',
  'FR': 'EUR',
  'PF': 'AUD',
  'DE': 'EUR',
  'GB': 'GBP',
  'GI': 'EUR',
  'GR': 'EUR',
  'GL': 'USD',
  'GD': 'USD',
  'GP': 'EUR',
  'GU': 'AUD',
  'GT': 'USD',
  'GG': 'GBP',
  'HT': 'USD',
  'HM': 'AUD',
  'VA': 'EUR',
  'HN': 'USD',
  'HU': 'EUR',
  'IS': 'EUR',
  'IE': 'EUR',
  'IM': 'GBP',
  'IT': 'EUR',
  'JM': 'USD',
  'JE': 'GBP',
  'KI': 'AUD',
  'LV': 'EUR',
  'LI': 'EUR',
  'LT': 'EUR',
  'LU': 'EUR',
  'MK': 'EUR',
  'MT': 'EUR',
  'MH': 'USD',
  'MQ': 'EUR',
  'MX': 'USD',
  'FM': 'USD',
  'MD': 'EUR',
  'MC': 'EUR',
  'ME': 'EUR',
  'MS': 'USD',
  'NR': 'AUD',
  'AN': 'USD',
  'NL': 'EUR',
  'NC': 'AUD',
  'NZ': 'AUD',
  'NI': 'USD',
  'NU': 'AUD',
  'NF': 'AUD',
  'MP': 'USD',
  'NO': 'EUR',
  'PW': 'USD',
  'PA': 'USD',
  'PG': 'AUD',
  'PN': 'AUD',
  'PL': 'EUR',
  'PT': 'EUR',
  'PR': 'USD',
  'RO': 'EUR',
  'KN': 'USD',
  'LC': 'USD',
  'PM': 'EUR',
  'VC': 'USD',
  'WS': 'AUD',
  'SM': 'EUR',
  'RS': 'EUR',
  'SK': 'EUR',
  'SI': 'EUR',
  'SB': 'AUD',
  'ES': 'EUR',
  'SJ': 'EUR',
  'SE': 'EUR',
  'CH': 'EUR',
  'TK': 'AUD',
  'TO': 'AUD',
  'TT': 'USD',
  'TC': 'USD',
  'TV': 'AUD',
  'UA': 'EUR',
  'UM': 'USD',
  'US': 'USD',
  'VU': 'AUD',
  'VG': 'USD',
  'VI': 'USD',
  'WF': 'AUD',
  'BQ': 'USD',
  'IO': 'USD',
  'TL': 'USD',
  'EU': 'EUR',
  'CY': 'EUR',
  'GF': 'EUR',
  'TF': 'EUR',
  'YT': 'EUR',
  'RE': 'EUR',
  'BL': 'EUR',
};

const VALID_CURRENCIES = ['AUD', 'EUR', 'GBP', 'USD'];

function ipLookUp() {
  fetch('https://geoip.immediatemedia.co.uk/country-code')
    .then(res => res.json())
    .then(json => cleanUpCurrencies(json))
    .catch(() => ShowActiveCurrency(FALLBACK_COUNTRY));
}

function cleanUpCurrencies(response) {
  if (VALID_CURRENCIES.indexOf(COUNTRY_CURRENCY[response.countryCode]) >= 0) {
    ShowActiveCurrency(response.countryCode);
    return;
  }
  ShowActiveCurrency(FALLBACK_COUNTRY);
}

function ShowActiveCurrency(countryCode) {
  const priceGroup = document.querySelectorAll('.geo-prices');

  if (priceGroup.length === 0) {
    return;
  }

  priceGroup.forEach(el => {
    const activeCurrency = [...el.querySelectorAll('[data-currency=' + '\'' + COUNTRY_CURRENCY[countryCode] + '\']')];
    const fallbackCurrency = [...el.querySelectorAll('[data-currency=' + '\'' + COUNTRY_CURRENCY[FALLBACK_COUNTRY] + '\']')];

    if (activeCurrency.length > 0) {
      renderCurrency(activeCurrency);
      return;
    }

    if (fallbackCurrency.length > 0) {
      renderCurrency(fallbackCurrency);
    }
  });
}

function renderCurrency(currencyWrapper) {
  currencyWrapper.map(el => {
    el.innerHTML = el.innerHTML.replace('|', '');
    el.style = 'display: inline';
  });
}

document.addEventListener("DOMContentLoaded", () => ipLookUp());
