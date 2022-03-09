import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth";
import { API } from "../backend";
import { addItemToCart, loadCart, removeItemFromCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { deleteProduct } from "../admin/helper/adminapicalls";
import { useStoreActions } from "easy-peasy";

const ProductCard = ({ data }) => {
	const { _id, name, company, price, category } = data;
	const [inCart, setInCart] = useState(false);

	const getAllProducts = useStoreActions((actions) => actions.getAllProducts);
	const getAllPageCount = useStoreActions((actions) => actions.getAllPageCount);
	const updateCartCount = useStoreActions((actions) => actions.updateCartCount);

	const preload = () => {
		const cartData = loadCart();
		if (cartData !== undefined) {
			cartData.forEach((item) => {
				if (item._id === data._id) setInCart(true);
			});
		}
	};

	const addThisToCart = () => {
		setInCart(true);
		addItemToCart(data);
		updateCartCount();
	};

	const deleteProd = () => {
		let confirmation = window.confirm(`Confirm to delte "${name}" product`);
		if (confirmation) {
			deleteProduct(_id, isAuthenticated().user._id, isAuthenticated().token).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					getAllProducts({ currenPage: 1, pageSize: 5 });
					getAllPageCount();
				}
			});
		}
	};

	const removeThis = () => {
		setInCart(false);
		removeItemFromCart(data._id);
		updateCartCount();
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inCart]);
	const getDefaultImg = (e) => {
		// console.log(e);
		e.target.src = "../images/logo.png";
	};

	return (
		<div className="card h-100 d-flex flex-column">
			<img
				src={`${API}/product/photo/${_id}`}
				onError={(e) => getDefaultImg(e)}
				className="card-img-top"
				alt="Product Name"
			/>
			{/* <img src="../images/logo.png" className="card-img-top" alt={name} /> */}
			<div className="card-body d-flex flex-column flex-grow-1 p-2 p-sm-3 justify-content-between">
				<p className="card-category text-muted mb-0">{category.name}</p>
				<h5 className="card-title">{name}</h5>
				<p className="card-text">{company ? company : "NA"}</p>
				<div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
					<div style={{ width: "8rem" }} className="card-price primary-text fw-bold mb-1 mb-lg-0">
						Rs. {price}
					</div>
					{(!isAuthenticated() || (isAuthenticated() && isAuthenticated().user.role === 0)) &&
						((!inCart && (
							<div className="card-btn primary-btn fw-bold" onClick={() => addThisToCart()}>
								Add
							</div>
						)) || (
							<div className="card-btn danger-btn fw-bold" onClick={removeThis}>
								Remove
							</div>
						))}
					{isAuthenticated() && isAuthenticated().user.role === 1 && (
						<div className="d-flex justify-content-between w-100">
							<Link
								className="card-btn btn btn-outline-secondary fw-bold"
								to={`/admin/manage?edit=${_id}`}
							>
								Edit
							</Link>
							<div className="card-btn btn btn-outline-danger fw-bold" onClick={deleteProd}>
								Delete
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
