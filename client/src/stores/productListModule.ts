import { useReducer } from 'react';
import { ProductsGetRequestQuery } from '~/lib/api/types';

export type CategoryType = ProductsGetRequestQuery['category'];
export type OrderType = ProductsGetRequestQuery['order'];
export type SearchValueType = ProductsGetRequestQuery['search'];

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PRODUCTS_AMOUNT = 20;

const SET_CATEGORY = 'SET_CATEGORY';
const SET_ORDER = 'SET_ORDER';
const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE';
const SET_NEXT_PAGE = 'SET_NEXT_PAGE';

export const setCategory = (payload: CategoryType) => ({
  type: SET_CATEGORY,
  payload,
});
export const setOrder = (payload: OrderType) => ({
  type: SET_ORDER,
  payload,
});
export const setSearchValue = (payload: SearchValueType) => ({
  type: SET_SEARCH_VALUE,
  payload,
});
export const setNextPage = () => ({ type: SET_NEXT_PAGE });

export const INITIAL_FILTER_STATE: ProductsGetRequestQuery = {
  order: 'recent',
  page: DEFAULT_PAGE_NUMBER,
  limit: DEFAULT_PRODUCTS_AMOUNT,
};

const filterReducer = (state: ProductsGetRequestQuery, action) => {
  switch (action.type) {
    case SET_CATEGORY: {
      if (!state.category || state.category !== action.payload)
        return { ...state, category: action.payload };

      const { category, ...rest } = state;
      return { ...rest };
    }
    case SET_ORDER:
      return { ...state, order: action.payload };
    case SET_SEARCH_VALUE:
      return { ...state, search: action.payload };
    case SET_NEXT_PAGE:
      return { ...state };
    default:
      return { ...state };
  }
};

const productListModule = () => {
  const [filterState, dispatch] = useReducer(
    filterReducer,
    INITIAL_FILTER_STATE,
  );

  return { filterState, dispatch };
};

export default productListModule;
