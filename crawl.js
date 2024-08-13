import { URL }  from 'node:url';
import { JSDOM } from 'jsdom';


function normalizeURL (URLstring) {
	const URLobj = new URL(URLstring);
	let pathname = URLobj.pathname
	
	if ( pathname[pathname.length-1] === '/' ) {
		pathname = pathname.slice(0, pathname.length-1)
	} 

	const normalizedURL = URLobj.hostname.concat('', pathname); 
	return normalizedURL;
}

async function fetchHTML(url) {
	let response
	try {
		response = await fetch(url)
	} catch (err) {
		throw new Error(`Got Error: ${err.message}`)
	}

	if(response.status > 399) {
		throw new Error(`Got HTTP error: ${response.status} ${response.status}`)
	}

	const contentType = response.headers.get('content-type')
	if (!contentType || !contentType.includes('text/html')) {
		throw new Error(`Got non HTML-response: ${contentType}`)
	}

	return response.text()
}


function getURLsFromHTML(html, baseURL) {
  const urls = []
  const dom = new JSDOM(html)
  const anchors = dom.window.document.querySelectorAll('a')

  for (const anchor of anchors) {
    if (anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href')

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href
        urls.push(href)
      } catch(err) {
        console.log(`${err.message}: ${href}`)
      }
    }
  }

  return urls
}

async function crawlPage(baseURL, currentURL=baseURL, pages={}) {
	try {
		const currentURLObj = new URL(currentURL)
		const baseURLObj = new URL(baseURL)
		//check if currentURL includes baseURL, else return pages
		if (currentURLObj.hostname !== baseURLObj.hostname) {
			return pages
		}
		//normalize the URL 
		const normalizedURL = normalizeURL(currentURL)
		//if the normalized URL is included in pages increment count, else add normalizedURL with count 1 
		if (normalizedURL in pages) {
			pages[normalizedURL] += 1 
			return pages
		} 
		pages[normalizedURL] = 1 

		console.log(`crawling ${currentURL}`)
		let html = ''
		try {
			html = await fetchHTML(currentURL)
		} catch (err) {
			console.log(err.message)
			return pages
		}

		//for every new Url found in the body HTML recursicly call crawlPage
		const nextURLs = getURLsFromHTML(html, baseURL)	
		for (const nextURL of nextURLs) {
			//creating the current url for the next recursion step
			pages = await crawlPage(baseURL, nextURL, pages)
		}
		return pages
	}
	catch (error) {
		console.error(error.message)
	}
}

export {normalizeURL, getURLsFromHTML, crawlPage}
