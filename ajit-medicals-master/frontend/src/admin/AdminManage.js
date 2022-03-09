import React from "react";
import Base from "../core/Base";
import CreateProductForm from "./helper/CreateProductForm";
import CreateCategoryForm from "./helper/CreateCategoryForm";
import { useLocation } from "react-router-dom";

const AdminManage = () => {
	let location = useLocation().search;
	let productId;
	if (location !== "") {
		productId = location.toString().slice(6);
	}

	return (
		<Base>
			<ul className="nav nav-tabs nav-fill" id="manageTab" role="tablist">
				<li className="nav-item" role="presentation">
					<button
						className="nav-link primary-text fw-bold fs-4 active"
						id="product-tab"
						data-bs-toggle="tab"
						data-bs-target="#product"
						type="button"
						role="tab"
						aria-controls="product"
						aria-selected="true"
					>
						Product
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className="nav-link primary-text fw-bold fs-4"
						id="category-tab"
						data-bs-toggle="tab"
						data-bs-target="#category"
						type="button"
						role="tab"
						aria-controls="category"
						aria-selected="false"
					>
						Category
					</button>
				</li>
			</ul>
			<div className="tab-content" id="manageTabContent">
				<div
					className="tab-pane fade show active"
					id="product"
					role="tabpanel"
					aria-labelledby="product-tab"
				>
					<h4 className="primary-text fw-bold mt-3">Add Product</h4>
					<CreateProductForm productId={productId} />
				</div>
				<div className="tab-pane fade" id="category" role="tabpanel" aria-labelledby="category-tab">
					<h4 className="primary-text fw-bold mt-3">Add Category</h4>
					<CreateCategoryForm />
				</div>
			</div>
		</Base>
	);
};

export default AdminManage;
