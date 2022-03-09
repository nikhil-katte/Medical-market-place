import { useStoreActions } from "easy-peasy";
import React, { useState, useEffect } from "react";

const SearchForm = () => {
	const getSearchQueryResults = useStoreActions((actions) => actions.getSearchQueryResults);
	const updateSelectedCategory = useStoreActions((actions) => actions.updateSelectedCategory);
	const getAllProducts = useStoreActions((actions) => actions.getAllProducts);
	const getAllPageCount = useStoreActions((actions) => actions.getAllPageCount);

	var delayTimer;
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);

	const loadingMsg = () => {
		return (
			<img
				className="col-1"
				src="../images/loading.gif"
				style={{ visibility: loading ? "visible" : "hidden", width: "3rem" }}
			/>
		);
	};

	useEffect(() => {
		if (query) {
			setLoading(true);
			delayTimer = setTimeout(() => {
				console.log("SEACRHING: ", query);
				updateSelectedCategory("all");
				getSearchQueryResults({ query });
				setLoading(false);
			}, 1000);
		} else {
			clearTimeout(delayTimer);
			getAllProducts({ currentPage: 1, pageSize: 5 });
			getAllPageCount();
			setLoading(false);
		}
		return () => clearTimeout(delayTimer);
	}, [query]);

	return (
		<div className="d-flex flex-grow-1 align-items-center justify-content-between">
			{loading && loadingMsg()}
			<div className="input-group flex-grow-1">
				<input
					onChange={(e) => setQuery(e.target.value)}
					value={query}
					type="text"
					className="light-bg form-control d-inline-block ms-3"
					name="searchQuery"
					id="searchQuery"
					placeholder="Search something here"
				/>
			</div>
		</div>
	);
};

export default SearchForm;
