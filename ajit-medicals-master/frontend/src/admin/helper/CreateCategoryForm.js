import React, { useState, useEffect } from "react";
import { getAllCategories, createCategory, deleteCategory, getProductsByCategory } from "./adminapicalls";
import { isAuthenticated } from "../../auth";
import Alert from "../../core/helper/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CreateCategoryForm = () => {
	const { user, token } = isAuthenticated();

	const [values, setValues] = useState({
		name: "",
		categories: [],
		error: "",
		success: false,
		loading: false,
	});
	const { name, categories, error, success, loading } = values;

	const preload = () => {
		getAllCategories().then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error });
			} else {
				setValues({ ...values, categories: data });
			}
		});
	};

	const handleChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value });
	};

	const onSubmit = (event) => {
		event.preventDefault();
		setValues({ ...values, error: false, loading: true, success: false });
		createCategory(user._id, token, { name })
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false, success: false });
				} else {
					setValues({
						...values,
						name: "",
						error: false,
						loading: false,
						success: `Category ${name} added successfully`,
					});
				}
			})
			.catch((err) => console.log("Error: ", err));
	};

	const handleDelete = async (category) => {
		setValues({ ...values, loading: true });
		// console.log(e);
		let filteredProducts = await getProductsByCategory(category._id);
		setValues({ ...values, loading: false });
		let confirmation = window.confirm(
			`Are you sure you want to delete ${category.name} category? Deleting category will remove all the ${filteredProducts.length} products`
		);
		if (!confirmation) return;
		setValues({ ...values, error: false, loading: true, success: false });
		deleteCategory(category._id, user._id, token)
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false, success: false });
				} else {
					setValues({
						...values,
						error: false,
						loading: false,
						success: `Category ${category.name} deleted successfully`,
					});
				}
			})
			.catch((err) => console.log("Error: ", err));
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	return (
		<>
			{loading && <Alert />}
			{success && <Alert msg={success} type={"success"} />}
			{error && <Alert msg={error} type={"danger"} />}
			<form action="">
				<div className="form-group">
					<div className="mb-3">
						<label htmlFor="name" className="primary-text form-label fw-bold">
							Category Name
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
							placeholder="Enter category name"
						/>
					</div>
				</div>
				<div tabIndex="5" onClick={onSubmit} className="fw-bold border-0 d-block primary-btn">
					Add
				</div>
			</form>

			{categories && <h6 className="primary-text fw-bold mt-5">Existing Categories:</h6>}
			{categories &&
				categories.map((category, idx) => {
					return (
						<span key={idx} className="badge primary-btn me-3 mb-3">
							{category.name} &emsp;
							<span onClick={() => handleDelete(category)}>
								<FontAwesomeIcon icon={faTimes} />
							</span>
						</span>
					);
				})}
		</>
	);
};

export default CreateCategoryForm;
