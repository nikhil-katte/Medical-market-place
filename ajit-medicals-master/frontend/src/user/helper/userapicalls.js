import { API } from "../../backend";

export const getProductById = (id) => {
	// console.log("ID: ", id);
	return fetch(`${API}/product/${id}`, {
		method: "GET",
	})
		.then((res) => res.json())
		.catch((err) => console.log(err));
};

export const placeOrder = (cartData, userId, cartTotal, address, token) => {
	return fetch(`${API}/order/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ cartData, cartTotal, address }),
	});
};

export const getOrdersByUserId = (userId, token) => {
	// console.log(userId, token);
	return fetch(`${API}/orders/user/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => res.json())
		.catch((err) => console.log("ERRORRR", err));
};

export const getOnlyOrderById = (orderId) => {
	return fetch(`${API}/orders/${orderId}`)
		.then((res) => res.json())
		.catch((err) => console.log("ERRORRR", err));
};

export const getCategoryById = (categoryId) => {
	return fetch(`${API}/category/${categoryId}`)
		.then((res) => res.json())
		.catch((err) => console.log("ERRORR", err));
};
