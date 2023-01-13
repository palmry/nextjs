/**
 * State for tracking category/subcategory.
 * Need this so we can send the category data to Iterable.
 * We're not using props or context here to avoid rerenders,
 * which aren't necesarry when this changes and we want to avoid prop-drilling a ref.
 */

const state = {
  activeCategory: '',
  activeSubCategory: '',
}

export const setActiveCategory = category => {
  state.activeCategory = category
}

export const getActiveCategory = () => state.activeCategory

export const setActiveSubCategory = category => {
  state.activeSubCategory = category
}

export const getActiveSubCategory = () => state.activeSubCategory

export const clearAllActiveCategory = () => {
  state.activeCategory = ''
  state.activeSubCategory = ''
}
