import { getCookie, setCookie, checkCookie } from "./cookieHelper"

const address = "https://ec2-54-89-38-48.compute-1.amazonaws.com:8000/"//"http://127.0.0.1:8000/" 

const get_url = (path, urlParams) => {
	let url = `${address}${path}`
	if (urlParams !== undefined) {
		for (let q in urlParams) {
			if (url.includes("?")) {
				url += `&${q}=${urlParams[q]}`
			} else {
				url += `?${q}=${urlParams[q]}`
			}
		}
	}
	////consolee.log(url)
	return url
}

const prepareFetchObject = (method, useHeader, data) => {
	return new Promise((resolve, reject) => {
		const fetchObject = {
			method: method,
		}
		if (method !== "GET") {
			fetchObject["body"] = data
		}
		if (useHeader) {
			if(getCookie("token").length === 0){
				console.log("no token");
				//resolve({})
			}else{
				fetchObject["headers"] = {
					Authorization: `Token ${getCookie("token")}`,
				}
				
				resolve(fetchObject)
			}
			
		} else {
			resolve(fetchObject)
		}
	})
}

export const manageServerCall = (
	method,
	path,
	data = {},
	useHeader = true,
	urlParams
) => {
	console.log("use header -- ", useHeader);
	return new Promise((resolve, reject) => {
		prepareFetchObject(method, useHeader, data).then(
			(returnedFetchObjectData) => {
				console.log(returnedFetchObjectData);
				fetch(get_url(path, urlParams), returnedFetchObjectData)
					.then((res) => {
						res.json().then((data) => {
							if (data.detail === undefined) {
								resolve(data)
							} else {
								reject(data.detail)
							}
						})
					})
					.catch((err) => {
						reject(err)
					})
			}
		)
	})
}
