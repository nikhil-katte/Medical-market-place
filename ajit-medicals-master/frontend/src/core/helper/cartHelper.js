export const addItemToCart = (item) => {
	let cart = [];
	if (typeof window !== undefined) {
		if (localStorage.getItem("cart")) {
			cart = JSON.parse(localStorage.getItem("cart"));
		}
		cart.push({
			...item,
			count: item.count ? item.count : 1,
		});
		localStorage.setItem("cart", JSON.stringify(cart));
	}
};

export const loadCart = () => {
	if (typeof window !== undefined) {
		if (localStorage.getItem("cart")) {
			return JSON.parse(localStorage.getItem("cart"));
		}
	}
};

export const removeItemFromCart = (productId) => {
	let cart = [];
	if (typeof window !== undefined) {
		if (localStorage.getItem("cart")) {
			cart = JSON.parse(localStorage.getItem("cart"));
		}
		cart.forEach((product, i) => {
			if (product._id === productId) {
				return cart.splice(i, 1);
			}
		});
		localStorage.setItem("cart", JSON.stringify(cart));
	}
	return cart;
};

export const cartEmpty = (next) => {
	if (typeof window !== undefined) {
		localStorage.removeItem("cart");
		let cart = [];
		localStorage.setItem("cart", JSON.stringify(cart));

		next();
	}
};
