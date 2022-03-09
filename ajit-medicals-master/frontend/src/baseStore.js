import { action, computed, thunk } from "easy-peasy";
import {
	getAllProducts,
	getAllCategories,
	getProductsByCategory,
	getAllPageCount,
} from "./admin/helper/adminapicalls";
import { loadCart } from "./core/helper/cartHelper";
import { PAGESIZE } from "./core/helper/constants";
import { getSearchQueryResults } from "./core/helper/coreapicalls";

export default {
	//--------------------------------------------------------------------------------------------------
	//												STATE
	//--------------------------------------------------------------------------------------------------
	allProducts: [],
	allCategoryWiseProducts: {},
	allCategories: [],
	selectedCategory: "all",
	pageCountMap: {},
	errorType: "",
	errorMsg: "",
	cartCount: 0,

	//--------------------------------------------------------------------------------------------------
	//												THUNKS
	//--------------------------------------------------------------------------------------------------
	getAllProducts: thunk(async (actions, { currentPage = 1, pageSize = PAGESIZE }) => {
		console.log("FETCHING!!!!");
		if (currentPage && pageSize) {
			let products = await getAllProducts(currentPage, pageSize);
			console.log("Products are:-", products);
			if (products.error) {
				actions.setError({ type: "allProducts", msg: products.error });
			} else {
				actions.setAllProducts(products);
			}
		}
	}),
	getAllCategories: thunk(async (actions) => {
		let categories = await getAllCategories();
		if (categories.error) {
			actions.setError({ type: "allCategories", msg: categories.error });
		} else {
			actions.setAllCategories(categories);
		}
	}),
	getAllCategoryWiseProducts: thunk(async (actions, { selectedCategory, pageNum, pageSize }) => {
		if (!(selectedCategory in computed((state) => state.allCategoryWiseProducts))) {
			let filteredProducts = await getProductsByCategory(selectedCategory, pageNum, pageSize);
			if (filteredProducts.error) {
				actions.setError({ type: "allCategoriyWiseProducts", msg: filteredProducts.error });
			} else {
				actions.setAllCategoryWiseProducts({ selectedCategory, filteredProducts });
			}
		}
	}),
	getSearchQueryResults: thunk(async (actions, { query }) => {
		let queryResults = await getSearchQueryResults(query);
		if (queryResults?.error) {
			actions.setError({ type: "searchQuery", msg: queryResults.error });
		} else {
			actions.setAllProducts(queryResults.products);
			actions.updatePageCount({ cat: "all", count: queryResults.productCount });
		}
	}),
	getAllPageCount: thunk(async (actions) => {
		let pageCounts = await getAllPageCount();
		if (pageCounts.error) {
			actions.setError({ type: "pageCount", msg: pageCounts.error });
		} else {
			actions.setPageCount(pageCounts);
		}
	}),

	//--------------------------------------------------------------------------------------------------
	//												ACTIONS
	//--------------------------------------------------------------------------------------------------
	setAllProducts: action((state, products) => {
		state.allProducts = products;
	}),
	setAllCategories: action((state, categories) => {
		state.allCategories = categories;
	}),
	setAllCategoryWiseProducts: action((state, { selectedCategory, filteredProducts }) => {
		console.log("FETCHED AGAIN!!!!!!!!!!!!!!!!!!");
		state.allCategoryWiseProducts[selectedCategory] = filteredProducts;
	}),
	setPageCount: action((state, pageCounts) => {
		state.pageCountMap = pageCounts;
	}),

	updatePageCount: action((state, { cat, count }) => {
		state.pageCountMap[cat] = count;
	}),
	updateSelectedCategory: action((state, newCategory) => {
		state.selectedCategory = newCategory;
	}),
	updateCartCount: action((state) => {
		let data = loadCart();
		state.cartCount = data ? data.length : 0;
	}),

	setError: action((state, { type, msg }) => {
		state.errorType = type;
		state.errorMsg = msg;
	}),
};
