import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

const HTMLtext = `<html>
    <body>
        <a href="https://example.com">Example</a>
        <a href="/relative-link">Relative Link</a>
    </body>
</html>`

const expectedURLs = ['https://example.com/', 'https://example.com/relative-link']

test('normalizes https://test.url/', () => {
	expect(normalizeURL('https://test.url/')).toBe('test.url')
});

test('return absolut URLs from an HTML body', () => {
	expect(getURLsFromHTML(HTMLtext, 'https://example.com')).toEqual(expectedURLs)
})
