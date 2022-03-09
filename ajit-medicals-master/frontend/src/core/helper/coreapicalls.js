import { API } from "../../backend";

export const getSearchQueryResults = (querystring, currentPage = 1, pageSize = 5) => {
	console.log(currentPage, pageSize);
	return fetch(`${API}/products/search?q=${querystring}&currentPage=${currentPage}&pageSize=${pageSize}`, {
		method: "GET",
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
};
