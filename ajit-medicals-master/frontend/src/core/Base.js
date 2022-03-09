import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreState } from "easy-peasy";
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Base = ({ children }) => {
	const cartCount = useStoreState((state) => state.cartCount);

	return (
		<div>
			<Navbar className="text-black" />
			<div className="container container-fluid my-5">{children}</div>
			<Link to={"/user/cart"} className="d-block d-lg-none w-100 danger-btn p-1 position-fixed bottom-0">
				<FontAwesomeIcon icon={faCartPlus} /> &emsp; Go to Cart ({cartCount})
			</Link>
		</div>
	);
};

export default Base;
