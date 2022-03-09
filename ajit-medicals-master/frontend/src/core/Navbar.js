import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreActions, useStoreState } from "easy-peasy";
import React, { useState, Fragment, useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { loadCart } from "./helper/cartHelper";
import SearchForm from "./SearchForm";

const Navbar = ({ history }) => {
	const [isNavToggled, setIsNavToggled] = useState(false);

	const cartCount = useStoreState((state) => state.cartCount);
	const updateCartCount = useStoreActions((actions) => actions.updateCartCount);

	useEffect(() => {
		let data = loadCart();
		updateCartCount(data ? data.length : 0);
	}, []);

	return (
		<nav className="navbar navbar-expand-lg shadow navbar-light-bg bg-white sticky-top py-0">
			<div className="container d-flex justify-content-between">
				<div className="d-flex flex-nowrap w-100">
					<NavLink to="/" className="navbar-brand me-0" style={{ cursor: "pointer" }}>
						<div className="row h-100 align-items-center">
							<div className="imgContainer" style={{ width: "6rem" }}>
								<img src="../images/logo.png" alt="logo" />
							</div>
						</div>
					</NavLink>
					{<SearchForm />}
					<button
						className="navbar-toggler pe-0"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarToggler"
						aria-controls="navbarToggler"
						aria-expanded="false"
						aria-label="Toggle navigation"
						onClick={() => setIsNavToggled(!isNavToggled)}
					>
						<FontAwesomeIcon icon={isNavToggled ? faTimes : faBars} />
					</button>
				</div>
				<div className="collapse navbar-collapse justify-content-end" id="navbarToggler">
					<ul className="nav d-flex flex-wrap flex-lg-nowrap pb-3 py-lg-0 flex-column flex-lg-row align-items-start align-items-lg-center">
						{
							<li className="nav-item ms-2">
								<NavLink exact className="nav-link primary-text fw-bold ps-0 ps-lg-3" to="/">
									Home
								</NavLink>
							</li>
						}

						{((isAuthenticated() && isAuthenticated().user.role === 0) || !isAuthenticated()) && (
							<li className="nav-item ms-2 nav-cart">
								<NavLink
									exact
									className="nav-link primary-text fw-bold ps-0 ps-lg-3"
									to="/user/cart"
								>
									Cart
								</NavLink>
								<div>{cartCount}</div>
							</li>
						)}

						{isAuthenticated() && isAuthenticated().user.role === 0 && (
							<>
								<li className="nav-item ms-2">
									<NavLink
										exact
										className="nav-link primary-text fw-bold ps-0 ps-lg-3"
										to="/user/orders"
									>
										Orders
									</NavLink>
								</li>
							</>
						)}
						{isAuthenticated() && isAuthenticated().user.role === 1 && (
							<li className="nav-item ms-2">
								<NavLink
									exact
									className="nav-link primary-text fw-bold ps-0 ps-lg-3"
									to="/admin/dashboard"
								>
									Dashboard
								</NavLink>
							</li>
						)}
						{isAuthenticated() && isAuthenticated().user.role === 1 && (
							<li className="nav-item ms-2">
								<NavLink
									exact
									className="nav-link primary-text fw-bold ps-0 ps-lg-3"
									to="/admin/manage"
								>
									Manage
								</NavLink>
							</li>
						)}
						{!isAuthenticated() && (
							<Fragment>
								<li className="nav-item ms-2">
									<NavLink className="nav-link primary-text fw-bold ps-0 ps-lg-3" to="/signup">
										Register
									</NavLink>
								</li>
								<li style={{ width: "6rem" }} className="nav-item ms-2">
									<NavLink className="nav-link fw-bold primary-btn rounded" to="/signin">
										Sign In
									</NavLink>
								</li>
							</Fragment>
						)}
						{isAuthenticated() && (
							<li className="nav-item ms-2">
								<span
									style={{ width: "6rem" }}
									className="fw-bold btn btn-outline-danger rounded"
									onClick={() => {
										signout(() => {
											history.push("/");
										});
									}}
								>
									Log Out
								</span>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default withRouter(Navbar);
