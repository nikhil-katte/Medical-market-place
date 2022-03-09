import React, { useState } from "react";
import Base from "../core/Base";
import { signup } from "../auth";
import { Link } from "react-router-dom";
import Alert from "../core/helper/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
	const [values, setValues] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		address: "",
		password: "",
		error: "",
		loading: false,
		success: false,
	});
	const { firstName, lastName, phoneNumber, address, loading, password, error, success } = values;
	// console.log(phoneNumber)

	const handleChange = (name) => (event) => {
		let val = event.target.value;
		if (name === "phoneNumber" && isNaN(val)) return;
		setValues({ ...values, error: false, [name]: val });
	};

	const onSubmit = (event) => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		if (!firstName) {
			setValues({ ...values, error: "Please enter a First Name number" });
			return;
		}
		if (!lastName) {
			setValues({ ...values, error: "Please enter a Last Name number" });
			return;
		}
		if (!phoneNumber || phoneNumber.length !== 10) {
			setValues({ ...values, error: "Please enter a valid phone number" });
			return;
		}
		if (!password.match(/^[a-z0-9]+$/i)) {
			setValues({ ...values, error: "Password can only contain letter and numbers" });
			return;
		}
		if (!address.match(/^[a-z0-9,.-\s]+$/i)) {
			setValues({ ...values, error: "Address can only contain letter, numbers and (,.-)" });
			return;
		}

		event.preventDefault();
		setValues({ ...values, error: false, loading: true });
		signup({ firstName, lastName, phoneNumber, address, password })
			.then((data) => {
				console.log(data);
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false, success: false });
				} else {
					setValues({
						...values,
						firstName: "",
						lastName: "",
						phoneNumber: "",
						address: "",
						password: "",
						error: "",
						success: true,
					});
				}
			})
			.catch((err) => console.log("Error: ", err));
	};

	const loader = () => {
		return loading && <div className="loading loading--full-height"></div>;
	};

	const successMessage = () => {
		return (
			<div
				className={`alert alert-success alert-dismissible fade show d-flex align-items-center`}
				role="alert"
			>
				<FontAwesomeIcon icon={faCheckCircle} /> &emsp;
				<div>
					New account was created successfully. Please <Link to="/signin">Login Here</Link>
				</div>
			</div>
		);
	};

	const signUpForm = () => {
		return (
			<section className="bg-white h-100">
				<div className="container d-flex">
					<div className="row">
						<div className="mb-3 mb-lg-0 col-lg-6 w-50 mx-auto">
							<img alt="authenticationImage" className="img-fluid" src="/images/Auth.svg"></img>
						</div>
						<div className="fw-bold col-lg-6">
							<div className="card rounded shadow p-3 p-md-4">
								<h3 className="text-center ">Register</h3>
								<form action="">
									<div className="form-group  ">
										<div className="mb-3">
											<label htmlFor="firstName" className="primary-text form-label">
												First Name
											</label>
											<input
												required
												tabIndex="0"
												onChange={handleChange("firstName")}
												value={firstName}
												type="text"
												className="light-bg form-control"
												name="firstName"
												id="firstName"
												placeholder="Enter your first name"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="lastName" className="primary-text form-label">
												Last Name
											</label>
											<input
												required
												tabIndex="0"
												onChange={handleChange("lastName")}
												value={lastName}
												type="text"
												className="light-bg form-control"
												name="lastName"
												id="lastName"
												placeholder="Enter your last name"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="phoneNumber" className="primary-text form-label">
												Phone number
											</label>
											<input
												required
												tabIndex="0"
												onChange={handleChange("phoneNumber")}
												value={phoneNumber}
												type="tel"
												maxLength="10"
												className="form-control light-bg"
												name="phoneNumber"
												id="phoneNumber"
												placeholder="Enter your Phone number here"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="password" className="primary-text form-label">
												Password
											</label>
											<input
												required
												tabIndex="0"
												onChange={handleChange("password")}
												value={password}
												type="password"
												className="light-bg form-control"
												name="password"
												id="password"
												placeholder="Enter your last password"
											/>
										</div>
										<div className="mb-3">
											<label htmlFor="address" className="primary-text form-label">
												Address
											</label>
											<textarea
												tabIndex="0"
												onChange={handleChange("address")}
												value={address}
												className="light-bg form-control"
												name="address"
												id="address"
												cols="30"
												rows="6"
												placeholder="Enter your address"
											></textarea>
										</div>
									</div>
									<button
										type="submit"
										tabIndex="0"
										onClick={onSubmit}
										className="fw-bold border-0 w-100 d-block primary-btn"
									>
										Submit
									</button>
									<hr />
									<div className="d-flex justify-content-center">
										<Link tabIndex="0" to={"/signin"} className="fw-bold border-0">
											Or Log In here
										</Link>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	};
	return (
		<Base>
			{loader()}
			{error && <Alert msg={error} type={"danger"} />}
			{success && successMessage()}
			{signUpForm()}
		</Base>
	);
};

export default Signup;
