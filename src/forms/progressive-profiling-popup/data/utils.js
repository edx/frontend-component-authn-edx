import Cookies from 'js-cookie';

const languageCookieValue = Cookies.get('prod-edx-language-preference');
export default languageCookieValue;
