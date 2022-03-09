import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { API } from "../backend";
import { getCategoryById } from "../user/helper/userapicalls";
// import { addItemToCart, loadCart } from "./helper/cartHelper";

const CartCard = ({ data, categoryId, updateProductCount = null, isReadOnly = false }) => {
	const { _id, name, company, price, count } = data;

	const [category, setCategory] = useState("");
	const incCount = (productId) => {
		updateProductCount(productId, 1);
	};

	const decCount = (productId) => {
		updateProductCount(productId, -1);
	};
	const getDefaultImg = (e) => {
		e.target.src = "../images/logo.png";
	};

	const preload = () => {
		if (categoryId) {
			getCategoryById(categoryId).then((data) => {
				setCategory(data.name);
			});
		} else if (data && data.category) {
			setCategory(data.category.name);
		}
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="card d-flex justify-content-between mb-3">
			<div className="row flex-nowrap">
				<div className="col-5 col-lg-3">
					<div className="ps-3 py-3 w-100 h-100">
						<img
							src={`${API}/product/photo/${_id}`}
							onError={(e) => getDefaultImg(e)}
							className="card-img-top product-img"
							alt="Product Name"
						/>
					</div>
				</div>
				<div className="col ps-0">
					<div className="card-body h-100 d-flex flex-column justify-content-between flex-grow-0 ps-0 p-sm-3">
						<p className="card-category text-muted mb-0">{category ? category : "General"}</p>
						<h5 className="card-title">{name}</h5>
						<p className="card-text">{company ? company : "NA"}</p>
						{(!isReadOnly && (
							<div className="d-flex justify-content-between align-items-center">
								<div className="light-bg px-2">
									<FontAwesomeIcon
										style={{ cursor: "pointer" }}
										className="secondary-text"
										onClick={() => decCount(_id)}
										icon={faMinus}
									/>
									<span style={{ userSelect: "none" }}>&emsp;{count}&emsp;</span>
									<FontAwesomeIcon
										style={{ cursor: "pointer" }}
										className="primary-text"
										onClick={() => incCount(_id)}
										icon={faPlus}
									/>
								</div>
								<div style={{ userSelect: "none" }} className="card-price primary-text fw-bold">
									Rs. {price * count}
								</div>
							</div>
						)) || (
							<div className="d-flex gap-3 justify-content-between align-items-center">
								<div className="light-bg px-2">
									<span className="card-price primary-text fw-bold">Quantity:</span>
									<span className="">&emsp;{count}&emsp;</span>
								</div>
								<div style={{ userSelect: "none" }} className="card-price primary-text fw-bold">
									Rs. {price * count}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartCard;
