import * as actionTypes from "../actionTypes";

export const setResultsAction = (res, total_results, page, num_pages) => {
  return {
    type: actionTypes.SET_SEARCH_RESULTS,
    payload: {
      searchResults: {
        items: res,
        num_pages: num_pages,
        current_page: page,
        totalCount: total_results
      }
    }
  };
};

export const setPageAction = (res, page) => {
  return {
    type: actionTypes.SET_SEARCH_PAGE,
    payload: {
      searchResults: {
        ...res,
        current_page: page
      }
    }
  };
};
