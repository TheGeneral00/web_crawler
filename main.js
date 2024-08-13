import { argv } from 'node:process'
import { crawlPage } from './crawl.js'
import { printReport } from './report.js'

async function main() {
	if (process.argv.length < 3) {
		console.log(`Please try: npm start {startURL}`);	
	} else if (process.argv.length > 3) {
		console.log(`The command dosent accept more then one CLI argument`);
	} else {
		const baseURL = process.argv[2]
		console.log(`Starting web crawler with starting URL: ${baseURL}`);
		const pages = await crawlPage(baseURL)
		printReport(pages, baseURL)
	}
}

main()
