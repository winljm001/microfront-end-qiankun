import { gql } from '@apollo/client'

/* 获取商品类型下拉选项 */
export const getCommodityType = gql`
  query getCommodityType {
    commodityList {
      label
      value
    }
  }
`
/* 获取商品分类管理页面列表数据categoryList
  """ 分页参数"""
   page: Page! ------> Page {
                              offset: Int
                             pageCurrent: Int
                              pageSize: Int
                                }
   """ 商品类型id"""
   commodityTypeId: Int

   """ 商品分类名称（模糊查询）"""
   categoryName: String */

export const getCategoryList = gql`
  query getCategoryList($commodityTypeInput: CommodityTypeInput) {
    categoryList(commodityTypeInput: $commodityTypeInput) {
      records {
        categoryId
        categoryName
        commodityTypeName
        ordering
        commodityTypeId
      }
      pageCurrent
      pageSize
      totalRecords
    }
  }
`

/* 删除商品分类，返回是否删除boolean
 """ categoryId """ */
export const requestDeleteCategory = gql`
  mutation requestDeleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId) {
      result
    }
  }
`

/* 编辑或者新增商品分类，不传Id则为新增，传入Id则是编辑
  """ 商品分类id"""
   categoryId: Int

   """ 商品分类名称"""
   categoryName: String!

   """ 商品类型id"""
   commodityTypeId: Int!

   """ 排序"""
   ordering: Int! */
export const requestModifyCategory = gql`
  mutation requestModifyCategory($categoryInput: CategoryInput) {
    modifyCategory(categoryInput: $categoryInput) {
      id
    }
  }
`

/* 获取详情数据 */
export const getSelectCategoryById = gql`
  query getSelectCategoryById($categoryId: Int) {
    selectCategoryById(categoryId: $categoryId) {
      categoryId
      categoryName
      commodityTypeId
      commodityTypeName
      ordering
    }
  }
`

/* 获取排序默认值 */
export const getCategoryCount = gql`
  query getCategoryCount {
    categoryCount {
      size
    }
  }
`

/* 获取分类详情-品种list */
export const getSelectVarietyByCategoryId = gql`
  query getSelectVarietyByCategoryId($categoryId: Int) {
    selectVarietyByCategoryId(categoryId: $categoryId) {
      varietyId
      varietyName
    }
  }
`

/* 获取分类详情-产地list */
export const getSelectPlaceByCategoryId = gql`
  query getSelectPlaceByCategoryId($categoryId: Int) {
    selectPlaceByCategoryId(categoryId: $categoryId) {
      placeId
      placeName
    }
  }
`
/* 获取产地list */
export const getSelectPlaceTree = gql`
  query getSelectPlaceTree {
    selectPlaceTree {
      placeId
      placeName
      placePid
    }
  }
`
/* 获取分类详情数据 */
export const getCategorDetail = gql`
  query getCategorDetail($categoryId: Int) {
    selectCategoryById(categoryId: $categoryId) {
      categoryId
      categoryName
      commodityTypeId
      commodityTypeName
      ordering
    }
    selectVarietyByCategoryId(categoryId: $categoryId) {
      varietyId
      varietyName
    }
    selectPlaceByCategoryId(categoryId: $categoryId) {
      placeId
      placeName
    }
  }
`
/* 获取分类详情-修改新增品种 */
export const requestModifyCategoryVariety = gql`
  mutation requestModifyCategoryVariety($varietyInput: VarietyInput) {
    modifyCategoryVariety(varietyInput: $varietyInput) {
      id
    }
  }
`
/* 获取分类详情-删除品种 */
export const requestDeleteCategoryVariety = gql`
  mutation deleteCategoryVariety($varietyId: Int!) {
    deleteCategoryVariety(varietyId: $varietyId) {
      result
    }
  }
`
/* 获取分类详情-修改新增产地 */
export const requestModifyCategoryPlace = gql`
  mutation requestModifyCategoryPlace($placeInput: PlaceInput) {
    modifyCategoryPlace(placeInput: $placeInput) {
      id
    }
  }
`
/* 获取分类详情-修改新增产地 */
export const requestDeleteCategoryPlace = gql`
  mutation requestDeleteCategoryPlace($placeInput: PlaceInput) {
    deleteCategoryPlace(placeInput: $placeInput) {
      result
    }
  }
`
