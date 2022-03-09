import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { isAuthenticated } from "../auth";
import Base from "../core/Base";
import CartCard from "../core/CartCard";
import Alert from "../core/helper/Alert";
import { loadCart, removeItemFromCart } from "../core/helper/cartHelper";
import { getProductById, placeOrder } from "./helper/userapicalls";
import { useStoreActions } from "easy-peasy";

const UserCart = () => {
	const history = useHistory();

	const updateCartCount = useStoreActions((actions) => actions.updateCartCount);

	const [cartData, setCartData] = useState([]);
	const [cartTotal, setCartTotal] = useState(0);
	const [address, setAddress] = useState("");
	const [error, seterror] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (event) => {
		setAddress(event.target.value);
	};

	const loader = () => {
		return loading && <div className="loading loading--full-height"></div>;
	};

	const updateProductCount = (productId, change) => {
		// console.log("updating....");
		setLoading(true);
		let data = loadCart();
		if (data !== undefined) {
			data.forEach((ele) => {
				if (ele._id === productId) {
					ele.count += change;
				}
			});
			data = data.filter((ele) => ele.count);
		}
		localStorage.setItem("cart", JSON.stringify(data));
		preload();
		updateCartCount();
	};

	const preload = async () => {
		setLoading(true);
		let data = loadCart();
		// let verified = verifyProds(data);
		if (data !== undefined) {
			let tempArr = {};
			await Promise.all(
				data.map(async (prod) => {
					let res = await getProductById(prod._id);
					console.log("============>", res);
					if (res !== undefined) {
						tempArr[res._id] = true;
					} else {
						removeItemFromCart(prod._id);
					}
				})
			);
			data = data.filter((ele) => ele._id in tempArr);
			console.log(data);
			setCartData(data);
			updateCartCount();
			let total = 0;
			data.forEach((ele) => {
				total += ele.price * ele.count;
			});
			setCartTotal(total);
		}
		if (isAuthenticated()) {
			setAddress(isAuthenticated().user.address);
		}
		setLoading(false);
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = () => {
		if (!address.match(/^[a-z0-9,.-\s]+$/i)) {
			seterror("Address can only contain letter, numbers and (,.-)");
			return;
		}
		let confirmation = confirm("Are you sure to place this order in given address?");
		if (confirmation) {
			placeOrder(cartData, isAuthenticated().user._id, cartTotal, address, isAuthenticated().token)
				.then((data) => {
					localStorage.removeItem("cart");
					console.log("SUCEss", data);
					history.push({
						pathname: "/user/orders",
					});
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<Base>
			{loading && loader()}
			{error && <Alert msg={error} type="danger" />}
			{!loading && !cartData.length && <Alert msg={"Your cart is empty!"} />}
			{cartData.length !== 0 &&
				cartData.map((ele, idx) => {
					return <CartCard key={idx} data={ele} updateProductCount={updateProductCount} />;
				})}
			{cartData.length !== 0 && (
				<>
					<hr />
					<div className="d-flex justify-content-between align-items center px-3">
						<h4 className="fw-bold primary-text">Total Price:</h4>
						<h4 className="fw-bold primary-text">Rs. {cartTotal}</h4>
					</div>
					{(isAuthenticated() && (
						<>
							<div className="mb-3">
								<label htmlFor="address" className="primary-text form-label">
									Address
								</label>
								<textarea
									tabIndex="4"
									onChange={handleChange}
									value={address}
									className="light-bg form-control"
									name="address"
									id="address"
									cols="30"
									rows="6"
									placeholder="Enter your address"
								></textarea>
							</div>
							<div onClick={handleSubmit} className="primary-btn fw-bold mt-5">
								Confirm Order
							</div>
						</>
					)) || (
						<Link style={{ textDecoration: "none", color: "#fff" }} to="/signin">
							<div className="primary-btn fw-bold mt-5">Signin to place order</div>
						</Link>
					)}
				</>
			)}
		</Base>
	);
};

export default UserCart;
