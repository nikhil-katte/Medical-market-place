import React, { useEffect, useState } from "react";
import Base from "./Base";
import Alert from "./helper/Alert";
import ProductCard from "./ProductCard";
import ReactPaginate from "react-paginate";
import { useStoreState, useStoreActions } from "easy-peasy";
import { PAGESIZE } from "./helper/constants";

const Home = () => {
	const allProducts = useStoreState((state) => state.allProducts);
	const allCategories = useStoreState((state) => state.allCategories);
	const allCategoryWiseProducts = useStoreState((state) => state.allCategoryWiseProducts);
	const selectedCategory = useStoreState((state) => state.selectedCategory);
	const pageCountMap = useStoreState((state) => state.pageCountMap);
	const errorType = useStoreState((state) => state.errorType);
	const errorMsg = useStoreState((state) => state.errorMsg);

	const getAllProducts = useStoreActions((actions) => actions.getAllProducts);
	const getAllCategories = useStoreActions((actions) => actions.getAllCategories);
	const getAllCategoryWiseProducts = useStoreActions((actions) => actions.getAllCategoryWiseProducts);
	const updateSelectedCategory = useStoreActions((actions) => actions.updateSelectedCategory);
	const getAllPageCount = useStoreActions((actions) => actions.getAllPageCount);

	const [values, setValues] = useState({
		loading: true,
		currentPage: 1,
		pageSize: PAGESIZE,
	});
	const { loading, currentPage, pageSize } = values;

	const preload = async () => {
		setValues({ ...values, loading: true });
		console.log("CALLING from Preload");
		getAllProducts({ currentPage, pageSize });
		getAllCategories();
		getAllPageCount();
		setValues({
			...values,
			loading: false,
		});
	};

	const changePageNumber = (page) => {
		console.log(page);
		setValues({ ...values, currentPage: page.selected + 1 });
	};

	const updateProductData = (pageNum) => {
		if (selectedCategory === "all") {
			setValues({ ...values, loading: true });
			console.log("CALLING from UpdateProdData");
			getAllProducts({ currentPage, pageSize });
			setValues({ ...values, loading: false });
		} else {
			setValues({ ...values, loading: true });
			getAllCategoryWiseProducts({ selectedCategory, pageNum, pageSize });
			setValues({
				...values,
				loading: false,
			});
		}
	};

	useEffect(() => {
		setValues({ ...values, currentPage: 1 });
		updateProductData(1);
	}, [selectedCategory]);

	useEffect(() => {
		console.log("CALLING from useefect currentpage");
		updateProductData(currentPage);
	}, [currentPage]);

	useEffect(() => {
		console.log("CALLING from useeffect");
		preload();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Base>
			{loading && <Alert msg={"Loading products..."} />}
			{errorType && <Alert msg={errorMsg} type={"danger"} />}
			{console.log("AP", allProducts && true)}
			{/* {console.log("Cat: ", selectedCategory)} */}
			{/* {allCategoryWiseProducts && console.log(allCategoryWiseProducts)} */}
			<div className="d-flex flex-column flex-sm-row gap-3 gap-sm-5 justify-content-between align-items-center">
				<select
					className="form-select"
					onChange={(e) => updateSelectedCategory(e.target.value)}
					aria-label="Default select example"
				>
					<option value={"all"}>All categories</option>
					{allCategories &&
						errorType !== "allCategories" &&
						allCategories.map((category, idx) => {
							return (
								<option
									key={idx}
									value={category._id}
									selected={selectedCategory === category._id}
								>
									{category.name}
								</option>
							);
						})}
				</select>
				<ReactPaginate
					previousLabel={"Prev"}
					nextLabel={"Next"}
					breakLabel={"..."}
					breakClassName={"break-me"}
					pageCount={Math.ceil(pageCountMap[selectedCategory] / pageSize)}
					marginPagesDisplayed={1}
					pageRangeDisplayed={2}
					onPageChange={changePageNumber}
					containerClassName={"pagination mb-0"}
					subContainerClassName={"pages pagination"}
					activeClassName={"active"}
					disabledClassName={"disabled"}
				/>
			</div>
			{selectedCategory === "all" && (
				<div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mt-5">
					{allProducts &&
						errorType !== "allProducts" &&
						((allProducts.length === 0 && <Alert msg={"No Products exist with this name"} />) ||
							allProducts.map((product, idx) => {
								return (
									<div key={idx} className="col">
										<ProductCard data={product} />
									</div>
								);
							}))}
				</div>
			)}
			{selectedCategory !== "all" && (
				<div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mt-5">
					{selectedCategory in allCategoryWiseProducts &&
						errorType !== "allCategoryWiseProducts" &&
						allCategoryWiseProducts[selectedCategory].map((product, idx) => {
							return (
								<div key={idx} className="col">
									<ProductCard data={product} />
								</div>
							);
						})}
				</div>
			)}
		</Base>
	);
};

export default Home;
