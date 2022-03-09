import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
// import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminManage from "./admin/AdminManage";
import PageNotFound from "./core/PageNotFound";
import UserCart from "./user/UserCart";
import AllOrders from "./user/AllOrders";
import SingleOrder from "./user/SingleOrder";

import { StoreProvider, createStore } from "easy-peasy";
import baseStore from "./baseStore";

const store = createStore(baseStore);

const Routes = () => {
	return (
		<StoreProvider store={store}>
			<HashRouter>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/signup" exact component={Signup} />
					<Route path="/signin" exact component={Signin} />
					<AdminRoute path="/admin/dashboard" exact component={AllOrders} />
					<AdminRoute path="/admin/manage" exact component={AdminManage} />
					<Route path="/user/cart" exact component={UserCart} />
					<Route path="/user/orders" exact component={AllOrders} />
					<Route path="/user/orders/:orderId" exact component={SingleOrder} />
					<Route component={PageNotFound} />
				</Switch>
			</HashRouter>
		</StoreProvider>
	);
};
export default Routes;
