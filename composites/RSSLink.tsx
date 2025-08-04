export default function RSSLink() {
    return (
        <a className="social-link" href="https://renfoc.us/rss.xml" target='_BLANK' aria-label="rss feed">
            <span className="hidden">rss feed link</span>
            <svg aria-hidden={true} role="img" width="1.25rem" height="1.25rem" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#E69375"><path d="M12 17C12 14 10 12 7 12" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17 17C17 11 13 7 7 7" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7 17.01L7.01 16.9989" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="#E69375" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </a>
    );
}
