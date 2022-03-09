import React, { useState, useEffect } from "react";
import { createProduct, updateProduct } from "./adminapicalls";
import { isAuthenticated } from "../../auth";
import Alert from "../../core/helper/Alert";
import { getProductById } from "../../user/helper/userapicalls";
import { useStoreActions, useStoreState } from "easy-peasy";

const CreateProductForm = ({ productId }) => {
	const { user, token } = isAuthenticated();

	const errorType = useStoreState((state) => state.errorType);
	const errorMsg = useStoreState((state) => state.errorMsg);
	const allCategories = useStoreState((state) => state.allCategories);
	const getAllCategories = useStoreActions((actions) => actions.getAllCategories);

	const [values, setValues] = useState({
		photo: "",
		name: "",
		company: "",
		category: "Select",
		price: "",
		formData: new FormData(),
		error: "",
		success: false,
		loading: false,
	});
	const { name, company, category, price, formData, error, success, loading } = values;

	const preload = async () => {
		getAllCategories();
		setValues({ ...values, loading: true });
		if (productId) {
			getProductById(productId).then((data) => {
				console.log(data);
				let { name, company, price } = data;
				let cat = data.category;
				setValues({
					...values,
					name: name,
					company: company,
					category: cat._id,
					price: price,
					formData: new FormData(),
				});
			});
		}
		setValues({ ...values, loading: false });
	};

	const handleChange = (name) => (event) => {
		const val = name === "photo" ? event.target.files[0] : event.target.value;
		formData.set(name, val);
		setValues({ ...values, [name]: val });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		console.log(formData);
		setValues({ ...values, error: false, loading: true });
		if (productId) {
			updateProduct(productId, isAuthenticated().user._id, isAuthenticated().token, formData)
				.then((data) => {
					console.log(data);
					if (data.error) {
						setValues({ ...values, error: data.error, loading: false, success: false });
					} else {
						setValues({
							...values,
							name: "",
							price: "",
							company: "",
							category: "Select",
							error: false,
							loading: false,
							success: true,
							formData: new FormData(),
						});
					}
				})
				.catch((err) => console.log("Error: ", err));
		} else {
			createProduct(user._id, token, formData)
				.then((data) => {
					console.log(data);
					if (data.error) {
						setValues({ ...values, error: data.error, loading: false, success: false });
					} else {
						setValues({
							...values,
							name: "",
							price: "",
							company: "",
							category: "Select",
							error: false,
							loading: false,
							success: true,
							formData: new FormData(),
						});
					}
				})
				.catch((err) => console.log("Error: ", err));
		}
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{loading && <Alert />}
			{error && <Alert msg={error} type={"danger"} />}
			{errorType && <Alert msg={errorMsg} type={"danger"} />}
			{success && <Alert msg={`Product ${productId ? "edited" : "added"} successfully`} type={"success"} />}
			<form action="">
				<div className="form-group">
					<div className="mb-3">
						<input
							onChange={handleChange("photo")}
							accept="image/*"
							className="form-control"
							type="file"
							id="photo"
							name="photo"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="name" className="primary-text form-label fw-bold">
							Product Name
						</label>
						<input
							required
							tabIndex="1"
							onChange={handleChange("name")}
							value={name}
							type="text"
							className="light-bg form-control"
							name="name"
							id="name"
							placeholder="Enter product name"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="company" className="primary-text form-label fw-bold">
							Company Name
						</label>
						<input
							required
							tabIndex="1"
							onChange={handleChange("company")}
							value={company}
							type="text"
							className="light-bg form-control"
							name="company"
							id="company"
							placeholder="Enter company name"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="Category" className="primary-text form-label fw-bold">
							Category
						</label>
						<select
							tabIndex="3"
							onChange={handleChange("category")}
							className="form-control form-select"
							placeholder="Category"
							value={category}
						>
							<option disabled hidden defaultValue={"Select"}>
								Select
							</option>
							{allCategories &&
								errorType !== "allCategories" &&
								allCategories.map((cat, index) => {
									return (
										<option key={index} value={cat._id}>
											{cat.name}
										</option>
									);
								})}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="price" className="primary-text form-label fw-bold">
							Price
						</label>
						<input
							tabIndex="4"
							onChange={handleChange("price")}
							value={price}
							type="text"
							className="form-control light-bg"
							name="price"
							id="price"
							placeholder="Enter your Phone number here"
						/>
					</div>
				</div>
				{(productId && (
					<div tabIndex="5" onClick={onSubmit} className="fw-bold border-0 d-block primary-btn">
						Edit
					</div>
				)) || (
					<div tabIndex="5" onClick={onSubmit} className="fw-bold border-0 d-block primary-btn">
						Add
					</div>
				)}
			</form>
		</>
	);
};

export default CreateProductForm;
