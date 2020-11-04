import * as actionTypes from "../actionTypes";


export const BlogIndexAction = ({categories, featured, popular, shop, tags}) => {
    return {
        type: actionTypes.BLOG_INDEX,
        payload: {
            blog_categories: categories,
            blog_featured: featured,
            blog_popular: popular,
            blog_shop: shop,
            blog_tags: tags,
        }
    }
};


export const BlogDetailAction = ({post, blog_posts}) => {
    return {
        type: actionTypes.BLOG_DETAIL,
        payload: {
            blog_posts: {...blog_posts, [post.slug]: post}
        }
    }
};

export const BlogAddCommentAction = ({post, blog_posts}) => {
    return {
        type: actionTypes.BLOG_ADD_COMMENT,
        payload: {
            blog_posts: {...blog_posts, [post.slug]: post}
        }
    }
};

export const BlogUpdateCommentAction = ({post, blog_posts, comment}) => {
    return {
        type: actionTypes.BLOG_UPDATE_COMMENT,
        payload: {
            blog_posts: {...blog_posts, [post.slug]: {...post, comment}}
        }
    }
};

export const BlogDeleteCommentAction = ({post, blog_posts}) => {
    return {
        type: actionTypes.BLOG_DELETE_COMMENT,
        payload: {
            blog_posts: {...blog_posts, [post.slug]: post}
        }
    }
};



export const blogResultsAction = (res, total_results, page, num_pages) => {
  return {
    type: actionTypes.BLOG_SET_SEARCH_RESULTS,
    payload: {
      blogSearchResults: {
        items: res,
        num_pages: num_pages,
        current_page: page,
        totalCount: total_results
      }
    }
  };
};