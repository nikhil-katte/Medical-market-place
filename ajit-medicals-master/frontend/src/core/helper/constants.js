export const PAGESIZE = 5;

export const GET_ORDER_BG = (status, fullBg = false) => {
	switch (status) {
		case "Pending":
			return fullBg ? "btn-info" : "btn-outline-info";
		case "Cancelled":
			return fullBg ? "btn-danger" : "btn-outline-danger";
		case "Delivering":
			return fullBg ? "btn-warning" : "btn-outline-warning";
		case "Completed":
			return fullBg ? "btn-success" : "btn-outline-success";
		default:
			return fullBg ? "btn-secondary" : "btn-outline-secondary";
	}
};
