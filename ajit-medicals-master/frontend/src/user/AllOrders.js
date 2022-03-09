import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth";
import Base from "../core/Base";
import { getOrdersByUserId } from "./helper/userapicalls";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { Link } from "react-router-dom";
import Alert from "../core/helper/Alert";
import { getAllOrders } from "../admin/helper/adminapicalls";
import { GET_ORDER_BG } from "../core/helper/constants";

TimeAgo.addDefaultLocale(en);

const AllOrders = () => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);
	const [sortBy, setSortBy] = useState("Select");

	const preload = () => {
		setError(false);
		setLoading(true);
		if (isAuthenticated() && isAuthenticated().user.role === 0) {
			getOrdersByUserId(isAuthenticated().user._id, isAuthenticated().token)
				.then((res) => {
					console.log(res);
					if (res?.error) {
						setError(res.error);
					} else {
						setOrders(res);
					}
					setLoading(false);
				})
				.catch((err) => console.log(err));
		} else if (isAuthenticated() && isAuthenticated().user.role === 1) {
			getAllOrders(isAuthenticated().user._id, isAuthenticated().token)
				.then((res) => {
					console.log(res);
					if (res?.error) {
						setError(res.error);
					} else {
						setOrders(res);
					}
					setLoading(false);
				})
				.catch((err) => console.log(err));
		}
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getFormattedDate = (dateString) => {
		let date = new Date(dateString);
		return `${date.toLocaleTimeString()}, ${date.toDateString()}`;
	};

	const sortOrders = (val) => {
		setSortBy(val);
		let sortedOrders = orders.sort((a, b) => {
			if (val === "amount" ? parseInt(a[val]) > parseInt(b[val]) : a[val] > b[val]) return -1;
			if (val === "amount" ? parseInt(a[val]) < parseInt(b[val]) : a[val] < b[val]) return 1;
			return 0;
		});
		setOrders(sortedOrders);
	};

	return (
		<Base>
			{error && <Alert msg={`Error: ${error}`} />}
			{loading && <Alert msg={"Loading..."} />}
			<h1 className="primary-text fw-bold">{isAuthenticated().user.role ? "All" : "Your"} Orders</h1>
			<hr />
			{!loading && (
				<select className="form-select mb-3" onChange={(e) => sortOrders(e.target.value)} value={sortBy}>
					<option value={"Select"} hidden disabled>
						Sort by
					</option>
					<option value={"amount"}>Amount</option>
					<option value={"createdAt"}>Created At</option>
					<option value={"status"}>Status</option>
				</select>
			)}
			{orders &&
				orders.map((order, idx) => {
					return (
						<Link key={idx} className="card mb-2 allOrdersCard" to={`/user/orders/${order._id}`}>
							<div className="card-body shadow-sm">
								<div className="row flex-column flex-sm-row">
									<div className="col-12 col-sm-9">
										<div className="row flex-column flex-sm-row mb-1 mb-sm-0">
											<div className="col-12 col-sm-4">
												<span className="primary-text fw-bold">Order Id: </span>
											</div>
											<div className="col">
												<span className="fw-bold">{order._id}</span>
											</div>
										</div>
										<div className="row flex-column flex-sm-row mb-1 mb-sm-0">
											<div className="col-12 col-sm-4">
												<span className="primary-text fw-bold">Amount:</span>
											</div>
											<div className="col">
												Rs. <span>{order.amount}</span>
											</div>
										</div>
										<div className="row flex-column flex-sm-row mb-1 mb-sm-0">
											<div className="col-12 col-sm-4">
												<span className="primary-text fw-bold">Placed at:</span>
											</div>
											<div className="col">
												<small className="d-inline-block">
													{getFormattedDate(order.createdAt)}
												</small>{" "}
												&emsp;
												<small className="text-muted d-block d-sm-inline-block">
													(<ReactTimeAgo date={order.createdAt} locale="en-US" />)
												</small>
											</div>
										</div>
										<div className="row flex-column flex-sm-row mb-1 mb-sm-0">
											<div className="col-12 col-sm-4">
												<span className="primary-text fw-bold">Updated at:</span>
											</div>
											<div className="col">
												<small className="d-inline-block">
													{getFormattedDate(order.updatedAt)}
												</small>{" "}
												&emsp;
												<small className="text-muted d-block d-sm-inline-block">
													(<ReactTimeAgo date={order.updatedAt} locale="en-US" />)
												</small>
											</div>
										</div>
									</div>
									<div className="col d-flex align-items-center justify-content-end">
										<div
											className={"w-100 fw-bold btn " + GET_ORDER_BG(order.status, true)}
											style={{ cursor: "default" }}
										>
											{order.status}
										</div>
									</div>
								</div>
							</div>
						</Link>
					);
				})}
		</Base>
	);
};

export default AllOrders;
