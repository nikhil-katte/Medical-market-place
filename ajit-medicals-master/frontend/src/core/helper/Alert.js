import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const Alert = ({ msg = "Processing...", type = "info" }) => {
	const iconMapper = {
		success: faCheckCircle,
		danger: faExclamationTriangle,
		info: faInfoCircle,
	};

	const icon = type in iconMapper ? iconMapper[type] : iconMapper["info"];

	return (
		<div className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center`} role="alert">
			<FontAwesomeIcon icon={icon} /> &emsp;
			<div>{msg}</div>
		</div>
	);
};

export default Alert;
