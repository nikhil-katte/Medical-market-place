import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth";
import Base from "../core/Base";
import { getAllOrders } from "./helper/adminapicalls";

const AdminDashboard = () => {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);

	const loader = () => {
		return loading && <div className="loading loading--full-height"></div>;
	};

	const preload = () => {
		setLoading(true);
		getAllOrders(isAuthenticated().user._id, isAuthenticated().token)
			.then((res) => {
				setOrders(res);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Base>
			{loader()}
			{orders.length}
			<section className="container border rounded" id=""></section>
		</Base>
	);
};

export default AdminDashboard;
