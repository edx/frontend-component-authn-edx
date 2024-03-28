import React from 'react';

const socialLogos = {
  Apple: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fill="white" d="M21.2806 18.424C20.9328 19.2275 20.5211 19.9672 20.0441 20.6473C19.3938 21.5743 18.8614 22.216 18.4511 22.5724C17.8151 23.1573 17.1336 23.4569 16.4039 23.4739C15.88 23.4739 15.2483 23.3248 14.5129 23.0224C13.775 22.7214 13.097 22.5724 12.477 22.5724C11.8268 22.5724 11.1294 22.7214 10.3835 23.0224C9.63644 23.3248 9.03463 23.4824 8.5745 23.498C7.87472 23.5278 7.17722 23.2198 6.48099 22.5724C6.03662 22.1848 5.48081 21.5204 4.81496 20.5791C4.10057 19.574 3.51323 18.4084 3.0531 17.0795C2.56032 15.6442 2.31329 14.2543 2.31329 12.9087C2.31329 11.3673 2.64636 10.0379 3.31348 8.92386C3.83778 8.02902 4.53528 7.32314 5.40826 6.80495C6.28124 6.28675 7.2245 6.02269 8.2403 6.00579C8.79611 6.00579 9.52499 6.17772 10.4308 6.51561C11.334 6.85464 11.9139 7.02656 12.1682 7.02656C12.3583 7.02656 13.0026 6.82553 14.0948 6.42475C15.1276 6.05307 15.9993 5.89917 16.7134 5.95979C18.6485 6.11596 20.1023 6.87877 21.0691 8.25305C19.3385 9.30165 18.4824 10.7703 18.4994 12.6544C18.515 14.122 19.0474 15.3432 20.0937 16.3129C20.5679 16.7629 21.0975 17.1108 21.6867 17.3578C21.5589 17.7283 21.424 18.0833 21.2806 18.424ZM16.8426 0.960146C16.8426 2.11041 16.4224 3.1844 15.5847 4.17848C14.5739 5.36025 13.3513 6.04313 12.0254 5.93537C12.0085 5.79738 11.9987 5.65214 11.9987 5.49952C11.9987 4.39527 12.4794 3.21351 13.3331 2.24725C13.7593 1.75802 14.3013 1.35123 14.9586 1.02673C15.6146 0.707068 16.235 0.530288 16.8185 0.500015C16.8355 0.653787 16.8426 0.807569 16.8426 0.960131V0.960146Z" />
    </svg>
  ),
  Facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g>
        <path fill="white" d="M23.5 12.0698C23.5 5.71857 18.3513 0.569849 12 0.569849C5.64872 0.569849 0.5 5.71857 0.5 12.0698C0.5 17.8098 4.70538 22.5674 10.2031 23.4301V15.3941H7.2832V12.0698H10.2031V9.53626C10.2031 6.65407 11.92 5.06204 14.5468 5.06204C15.805 5.06204 17.1211 5.28665 17.1211 5.28665V8.11672H15.671C14.2424 8.11672 13.7969 9.00319 13.7969 9.91263V12.0698H16.9863L16.4765 15.3941H13.7969V23.4301C19.2946 22.5674 23.5 17.8098 23.5 12.0698Z" />
      </g>
      <defs>
        <clipPath id="clip0_877_9222">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  Google: (
    <svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  ),
  Microsoft: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  ),
};

export default socialLogos;
