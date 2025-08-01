export default function EmailLink() {
    return (
        <a className="social-link" href="mailto:resume@renrocks.mozmail.com" target='_BLANK' aria-label="send me an email">
	    <span className="hidden">send me a link</span>
            <svg aria-hidden={true} role="img" width="1.25rem" height="1.25rem" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#E69375">
<path d="M9 9L13.5 12L18 9" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 13.5H5" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 10.5H5" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M5 7.5V7C5 5.89543 5.89543 5 7 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H7C5.89543 19 5 18.1046 5 17V16.5" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round"></path></svg>
        </a>
    );
}
