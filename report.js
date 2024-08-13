function printReport(obj, baseURL) {
	let array = Object.entries(obj)
	array = array.sort((a,b) => b[1] - a[1])
	console.log(`--Report for base URL: ${baseURL}--`)
	for (const entry of array) {
		console.log(`Found ${entry[1]} internal links to ${entry[0]}`)
	}
	console.log('--End of report--')
}


export {printReport}
