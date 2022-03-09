import React, { useState } from "react";
import Base from "../core/Base";
import { Redirect, Link } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../auth";
import Alert from "../core/helper/Alert";

const Signin = () => {
	const [values, setValues] = useState({
		phoneNumber: "",
		password: "",
		error: "",
		loading: false,
		didRedirect: false,
	});

	const { phoneNumber, password, error, loading, didRedirect } = values;
	const { user } = isAuthenticated();

	const handleChange = (name) => (event) => {
		let val = event.target.value;
		if (name === "phoneNumber" && isNaN(val)) return;
		setValues({ ...values, error: false, [name]: val });
	};

	const onSubmit = (event) => {
		if (!phoneNumber || phoneNumber.length !== 10) {
			setValues({ ...values, error: "Please enter a valid phone number" });
			return;
		}
		if (!password) {
			setValues({ ...values, error: "Please enter a password" });
			return;
		}
		if (!password.match(/^[a-z0-9]+$/i)) {
			setValues({ ...values, error: "Password can only contain letter and numbers" });
			return;
		}

		event.preventDefault();
		setValues({ ...values, error: false, loading: true });
		signin({ phoneNumber, password })
			.then((data) => {
				if (data.error) {
					setValues({ ...values, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						setValues({ ...values, didRedirect: true });
					});
				}
			})
			.catch((err) => console.log("Sigin in request failed: ", err));
	};

	const performRedirect = () => {
		if (didRedirect) {
			if (user && user.role === 1) {
				return <Redirect to="/admin/dashboard" />;
			} else {
				return <Redirect to="/" />;
			}
		}
		if (isAuthenticated()) {
			return <Redirect to="/" />;
		}
	};

	const loader = () => {
		return loading && <div className="loading loading--full-height"></div>;
	};

	const signInForm = () => {
		return (
			<section className="bg-white h-100 ">
				<div className="container">
					<div className="row mt-5">
						<div className="mb-3 mb-lg-0 col-lg-6 mx-auto">
							<img alt="authenticateImage" className="img-fluid" src="/images/Auth.svg"></img>
						</div>
						<div className="fw-bold col-lg-6">
							<div className="card rounded shadow p-3 p-md-4">
								<h3 className="text-center ">Login</h3>
								<form action="" className="d-flex flex-column gap-3">
									<div className="form-group">
										<label htmlFor="phoneNumber" className="primary-text form-label">
											Phone Number
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
											placeholder="Enter your phone number"
										/>
									</div>
									<div className="form-group">
										<label htmlFor="name" className="primary-text form-label">
											Password
										</label>
										<input
											required
											tabIndex="0"
											onChange={handleChange("password")}
											value={password}
											type="password"
											className="form-control light-bg"
											name="password"
											id="password"
											placeholder="Enter your password"
										/>
									</div>
									<button
										type="submit"
										tabIndex="0"
										onClick={onSubmit}
										className="fw-bold border-0 d-block primary-btn"
									>
										Login
									</button>
									<hr />
									<div className="d-flex justify-content-center">
										<Link tabIndex="0" to={"/signup"} className="fw-bold border-0">
											Or Register here
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
		<Base title="Signin page">
			{loader()}
			{error && <Alert msg={error} type={"danger"} />}
			{signInForm()}
			{performRedirect()}
		</Base>
	);
};

export default Signin;
