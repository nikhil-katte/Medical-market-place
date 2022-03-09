import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { getOnlyOrderById } from "./helper/userapicalls";
import CartCard from "../core/CartCard";
import Alert from "../core/helper/Alert";
import { updateStatus } from "../admin/helper/adminapicalls";
import { isAuthenticated } from "../auth";
import { GET_ORDER_BG } from "../core/helper/constants";

const SingleOrder = ({ match }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentOrder, setCurrentOrder] = useState(null);
	const [orderTotal, setOrderTotal] = useState(0);

	const preload = () => {
		setError(false);
		setLoading(true);
		getOnlyOrderById(match.params.orderId)
			.then((orderData) => {
				if (orderData?.error) {
					setError(orderData.error);
				} else {
					setCurrentOrder(orderData);
					let total = 0;
					orderData.products.forEach((product) => (total += product.count * product.price));
					setOrderTotal(total);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setLoading(false);
			});
	};

	const handleStatusChange = (toStatus) => {
		setLoading(true);
		updateStatus(isAuthenticated().user._id, isAuthenticated().token, currentOrder._id, toStatus)
			.then((data) => {
				if (data && data.error) {
					setError(data.error);
				}
				console.log(data);
				preload();
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Base>
			{error && <Alert msg={`Error: ${error}`} />}
			{loading && <Alert msg={`Loading...`} />}
			{currentOrder && (
				<div className="row flex-column flex-sm-row">
					<div className="col">
						<span className="fw-bold">Order Id: </span>
						<h3 className="primary-text fw-bold text-wrap text-break">{currentOrder._id}</h3>
					</div>
					<div className="col">
						<span className="fw-bold">Full Name: </span>
						<h3 className="primary-text fw-bold">
							{currentOrder.user.firstName + " " + currentOrder.user.lastName}
						</h3>
					</div>
					<div className="col">
						<span className="fw-bold">Contact: </span>
						<h3 className="primary-text fw-bold">{currentOrder.user.phoneNumber}</h3>
					</div>
				</div>
			)}
			{currentOrder?.products &&
				currentOrder.products.map((product, idx) => {
					return <CartCard key={idx} data={product} categoryId={product.category} isReadOnly={true} />;
				})}
			<hr />
			{currentOrder && (
				<>
					<div className="d-flex justify-content-between align-items center px-3">
						<h4 className="fw-bold primary-text">Total Price:</h4>
						<h4 className="fw-bold primary-text">Rs. {orderTotal}</h4>
					</div>
					<div className="mb-3">
						<label htmlFor="address" className="primary-text form-label">
							Address
						</label>
						<textarea
							tabIndex="4"
							value={currentOrder.address}
							className="light-bg form-control"
							name="address"
							id="address"
							cols="30"
							rows="6"
							placeholder="Enter your address"
						></textarea>
					</div>
					{(isAuthenticated() && isAuthenticated().user.role === 1 && (
						<>
							{loading && <Alert msg={`Loading...`} />}
							<div className="row flex-column flex-sm-row gap-3">
								<div className="col">
									{["Pending", "Delivering"].includes(currentOrder.status) && (
										<div
											className={"w-100 fw-bold btn " + GET_ORDER_BG("Cancelled")}
											onClick={() => handleStatusChange("Cancelled")}
										>
											Change To CANCELLED
										</div>
									)}
								</div>
								<div className="col">
									<div
										className={"w-100 fw-bold btn " + GET_ORDER_BG(currentOrder.status, true)}
									>
										{currentOrder.status}
									</div>
								</div>
								<div className="col">
									{currentOrder.status == "Pending" && (
										<div
											className={"w-100 fw-bold btn " + GET_ORDER_BG("Delivering")}
											onClick={() => handleStatusChange("Delivering")}
										>
											Change To DELIVERING
										</div>
									)}
									{currentOrder.status == "Delivering" && (
										<div
											className={"w-100 fw-bold btn " + GET_ORDER_BG("Completed")}
											onClick={() => handleStatusChange("Completed")}
										>
											Change To COMPLETED
										</div>
									)}
								</div>
							</div>
						</>
					)) || (
						<>
							<div className="col">
								<div
									className={"w-100 fw-bold btn " + GET_ORDER_BG(currentOrder.status, true)}
									style={{ cursor: "default" }}
								>
									{currentOrder.status}
								</div>
							</div>
						</>
					)}
				</>
			)}
		</Base>
	);
};

export default SingleOrder;
