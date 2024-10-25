const config = require("../config.json")

module.exports = (placeholder, data) => {
	return placeholder.replace(/{{(.*?)}}/g, (match, p1) => {
		// Trim the property name to avoid issues with extra spaces
		const propName = p1.trim()
		// Return the value from the data object or the original match if not found
		return propName in data ? data[propName] : match
	})
}
