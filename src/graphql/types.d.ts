export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Long type */
  Long: any
  _FieldSet: any
}

export type BooleanResult = {
  __typename?: 'BooleanResult'
  result?: Maybe<Scalars['Boolean']>
}

export type Category = {
  __typename?: 'Category'
  categoryId?: Maybe<Scalars['Int']>
  categoryName?: Maybe<Scalars['String']>
  commodityTypeId?: Maybe<Scalars['Int']>
  commodityTypeName?: Maybe<Scalars['String']>
  ordering?: Maybe<Scalars['Int']>
}

export type CategoryInput = {
  /**  商品分类id */
  categoryId?: Maybe<Scalars['Int']>
  /**  商品分类名称 */
  categoryName: Scalars['String']
  /**  商品类型id */
  commodityTypeId: Scalars['Int']
  /**  排序 */
  ordering: Scalars['Int']
}

export type CategoryPage = {
  __typename?: 'CategoryPage'
  records?: Maybe<Array<Maybe<Category>>>
  pageCurrent?: Maybe<Scalars['Int']>
  pageSize?: Maybe<Scalars['Int']>
  totalRecords?: Maybe<Scalars['Long']>
}

export type CommodityType = {
  __typename?: 'CommodityType'
  commodityTypeId?: Maybe<Scalars['Int']>
  commodityTypeName?: Maybe<Scalars['String']>
}

export type CommodityTypeInput = {
  /**  分页参数 */
  page: Page
  /**  商品类型id */
  commodityTypeId?: Maybe<Scalars['Int']>
  /**  商品分类名称（模糊查询） */
  categoryName?: Maybe<Scalars['String']>
}

export enum ErrorDetail {
  /**
   * Unknown error.
   *
   * This error should only be returned when no other error detail applies.
   * If a client sees an unknown errorDetail, it will be interpreted as UNKNOWN.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Unknown = 'UNKNOWN',
  /**
   * The requested field is not found in the schema.
   *
   * This differs from `NOT_FOUND` in that `NOT_FOUND` should be used when a
   * query is valid, but is unable to return a result (if, for example, a
   * specific video id doesn't exist). `FIELD_NOT_FOUND` is intended to be
   * returned by the server to signify that the requested field is not known to exist.
   * This may be returned in lieu of failing the entire query.
   * See also `PERMISSION_DENIED` for cases where the
   * requested field is invalid only for the given user or class of users.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: BAD_REQUEST
   */
  FieldNotFound = 'FIELD_NOT_FOUND',
  /**
   * The provided cursor is not valid.
   *
   * The most common usage for this error is when a client is paginating
   * through a list that uses stateful cursors. In that case, the provided
   * cursor may be expired.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: NOT_FOUND
   */
  InvalidCursor = 'INVALID_CURSOR',
  /**
   * The operation is not implemented or is not currently supported/enabled.
   *
   * HTTP Mapping: 501 Not Implemented
   * Error Type: BAD_REQUEST
   */
  Unimplemented = 'UNIMPLEMENTED',
  /**
   * The client specified an invalid argument.
   *
   * Note that this differs from `FAILED_PRECONDITION`.
   * `INVALID_ARGUMENT` indicates arguments that are problematic
   * regardless of the state of the system (e.g., a malformed file name).
   *
   * HTTP Mapping: 400 Bad Request
   * Error Type: BAD_REQUEST
   */
  InvalidArgument = 'INVALID_ARGUMENT',
  /**
   * The deadline expired before the operation could complete.
   *
   * For operations that change the state of the system, this error
   * may be returned even if the operation has completed successfully.
   * For example, a successful response from a server could have been
   * delayed long enough for the deadline to expire.
   *
   * HTTP Mapping: 504 Gateway Timeout
   * Error Type: UNAVAILABLE
   */
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  /**
   * Service Error.
   *
   * There is a problem with an upstream service.
   *
   * This may be returned if a gateway receives an unknown error from a service
   * or if a service is unreachable.
   * If a request times out which waiting on a response from a service,
   * `DEADLINE_EXCEEDED` may be returned instead.
   * If a service returns a more specific error Type, the specific error Type may
   * be returned instead.
   *
   * HTTP Mapping: 502 Bad Gateway
   * Error Type: UNAVAILABLE
   */
  ServiceError = 'SERVICE_ERROR',
  /**
   * Request throttled based on server CPU limits
   *
   * HTTP Mapping: 503 Unavailable.
   * Error Type: UNAVAILABLE
   */
  ThrottledCpu = 'THROTTLED_CPU',
  /**
   * Request throttled based on server concurrency limits.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 429 Too Many Requests or 420 Enhance Your Calm
   * Error Type: UNAVAILABLE
   */
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  /**
   * Request failed due to network errors.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  TcpFailure = 'TCP_FAILURE',
  /**
   * Unable to perform operation because a required resource is missing.
   *
   * Example: Client is attempting to refresh a list, but the specified
   * list is expired. This requires an action by the client to get a new list.
   *
   * If the user is simply trying GET a resource that is not found,
   * use the NOT_FOUND error type. FAILED_PRECONDITION.MISSING_RESOURCE
   * is to be used particularly when the user is performing an operation
   * that requires a particular resource to exist.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   * Error Type: FAILED_PRECONDITION
   */
  MissingResource = 'MISSING_RESOURCE',
}

export enum ErrorType {
  /**
   * Unknown error.
   *
   * For example, this error may be returned when
   * an error code received from another address space belongs to
   * an error space that is not known in this address space.  Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * If a client sees an unknown errorType, it will be interpreted as UNKNOWN.
   * Unknown errors MUST NOT trigger any special behavior. These MAY be treated
   * by an implementation as being equivalent to INTERNAL.
   *
   * When possible, a more specific error should be provided.
   *
   * HTTP Mapping: 520 Unknown Error
   */
  Unknown = 'UNKNOWN',
  /**
   * Internal error.
   *
   * An unexpected internal error was encountered. This means that some
   * invariants expected by the underlying system have been broken.
   * This error code is reserved for serious errors.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Internal = 'INTERNAL',
  /**
   * The requested entity was not found.
   *
   * This could apply to a resource that has never existed (e.g. bad resource id),
   * or a resource that no longer exists (e.g. cache expired.)
   *
   * Note to server developers: if a request is denied for an entire class
   * of users, such as gradual feature rollout or undocumented allowlist,
   * `NOT_FOUND` may be used. If a request is denied for some users within
   * a class of users, such as user-based access control, `PERMISSION_DENIED`
   * must be used.
   *
   * HTTP Mapping: 404 Not Found
   */
  NotFound = 'NOT_FOUND',
  /**
   * The request does not have valid authentication credentials.
   *
   * This is intended to be returned only for routes that require
   * authentication.
   *
   * HTTP Mapping: 401 Unauthorized
   */
  Unauthenticated = 'UNAUTHENTICATED',
  /**
   * The caller does not have permission to execute the specified
   * operation.
   *
   * `PERMISSION_DENIED` must not be used for rejections
   * caused by exhausting some resource or quota.
   * `PERMISSION_DENIED` must not be used if the caller
   * cannot be identified (use `UNAUTHENTICATED`
   * instead for those errors).
   *
   * This error Type does not imply the
   * request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   *
   * HTTP Mapping: 403 Forbidden
   */
  PermissionDenied = 'PERMISSION_DENIED',
  /**
   * Bad Request.
   *
   * There is a problem with the request.
   * Retrying the same request is not likely to succeed.
   * An example would be a query or argument that cannot be deserialized.
   *
   * HTTP Mapping: 400 Bad Request
   */
  BadRequest = 'BAD_REQUEST',
  /**
   * Currently Unavailable.
   *
   * The service is currently unavailable.  This is most likely a
   * transient condition, which can be corrected by retrying with
   * a backoff.
   *
   * HTTP Mapping: 503 Unavailable
   */
  Unavailable = 'UNAVAILABLE',
  /**
   * The operation was rejected because the system is not in a state
   * required for the operation's execution.  For example, the directory
   * to be deleted is non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * Service implementers can use the following guidelines to decide
   * between `FAILED_PRECONDITION` and `UNAVAILABLE`:
   *
   * - Use `UNAVAILABLE` if the client can retry just the failing call.
   * - Use `FAILED_PRECONDITION` if the client should not retry until
   * the system state has been explicitly fixed.  E.g., if an "rmdir"
   *      fails because the directory is non-empty, `FAILED_PRECONDITION`
   * should be returned since the client should not retry unless
   * the files are deleted from the directory.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   */
  FailedPrecondition = 'FAILED_PRECONDITION',
}

export type IntResult = {
  __typename?: 'IntResult'
  id?: Maybe<Scalars['Int']>
}

/** 用户账户密码输入 */
export type LoginInput = {
  /** 用户名 */
  username?: Maybe<Scalars['String']>
  /** 密码 */
  password?: Maybe<Scalars['String']>
}

export type LongResult = {
  __typename?: 'LongResult'
  size?: Maybe<Scalars['Long']>
}

export type Mutation = {
  __typename?: 'Mutation'
  /**  修改或者新增商品分类，其中id为空则是保存，id不为空则是修改 */
  modifyCategory?: Maybe<IntResult>
  /**  删除商品分类接口 */
  deleteCategory?: Maybe<BooleanResult>
  /**  新增或修改品种 */
  modifyCategoryVariety?: Maybe<IntResult>
  /**  删除品种 */
  deleteCategoryVariety?: Maybe<BooleanResult>
  /**  新增或修改场地关联关系 */
  modifyCategoryPlace?: Maybe<IntResult>
  /**  删除场地关联关系 */
  deleteCategoryPlace?: Maybe<BooleanResult>
  modifyPlace?: Maybe<IntResult>
  deletePlace?: Maybe<BooleanResult>
  login?: Maybe<UserLoginResponse>
}

export type MutationModifyCategoryArgs = {
  categoryInput?: Maybe<CategoryInput>
}

export type MutationDeleteCategoryArgs = {
  categoryId: Scalars['Int']
}

export type MutationModifyCategoryVarietyArgs = {
  varietyInput?: Maybe<VarietyInput>
}

export type MutationDeleteCategoryVarietyArgs = {
  varietyId: Scalars['Int']
}

export type MutationModifyCategoryPlaceArgs = {
  placeInput?: Maybe<PlaceInput>
}

export type MutationDeleteCategoryPlaceArgs = {
  placeInput?: Maybe<PlaceInput>
}

export type MutationModifyPlaceArgs = {
  placeInput?: Maybe<PlaceInput>
}

export type MutationDeletePlaceArgs = {
  placeId: Scalars['Int']
}

export type MutationLoginArgs = {
  loginInput?: Maybe<LoginInput>
}

export type Option = {
  __typename?: 'Option'
  label?: Maybe<Scalars['String']>
  value?: Maybe<Scalars['Int']>
}

export type Page = {
  offset?: Maybe<Scalars['Int']>
  pageCurrent?: Maybe<Scalars['Int']>
  pageSize?: Maybe<Scalars['Int']>
}

export type Place = {
  __typename?: 'Place'
  placeId?: Maybe<Scalars['Int']>
  placeName?: Maybe<Scalars['String']>
  placePid?: Maybe<Scalars['Int']>
}

export type PlaceInput = {
  placeId?: Maybe<Scalars['Int']>
  placePid?: Maybe<Scalars['Int']>
  placeName?: Maybe<Scalars['String']>
  categoryId?: Maybe<Scalars['Int']>
}

export type Query = {
  __typename?: 'Query'
  /**  基础管理-商品分类-|商品分类列表| */
  categoryList?: Maybe<CategoryPage>
  /**  基础管理-商品分类-|商品类型接口| */
  commodityList?: Maybe<Array<Maybe<Option>>>
  /**  根据categoryId 获取详情 */
  selectCategoryById?: Maybe<Category>
  categoryCount?: Maybe<LongResult>
  selectVarietyByCategoryId?: Maybe<Array<Maybe<Variety>>>
  selectPlaceByCategoryId?: Maybe<Array<Maybe<Place>>>
  /**  获取产地树形列表 */
  selectPlaceTree?: Maybe<Array<Maybe<Place>>>
  _service?: Maybe<_Service>
}

export type QueryCategoryListArgs = {
  commodityTypeInput?: Maybe<CommodityTypeInput>
}

export type QuerySelectCategoryByIdArgs = {
  categoryId?: Maybe<Scalars['Int']>
}

export type QuerySelectVarietyByCategoryIdArgs = {
  categoryId?: Maybe<Scalars['Int']>
}

export type QuerySelectPlaceByCategoryIdArgs = {
  categoryId?: Maybe<Scalars['Int']>
}

/** 用户账户密码返回 */
export type UserLoginResponse = {
  __typename?: 'UserLoginResponse'
  /** 用户id */
  userId?: Maybe<Scalars['Int']>
  /** 用户名称 */
  userName?: Maybe<Scalars['String']>
  token?: Maybe<Scalars['String']>
  /** 组织名称 */
  organizationName?: Maybe<Scalars['String']>
  /** 组织id */
  organizationId?: Maybe<Scalars['Int']>
}

export type Variety = {
  __typename?: 'Variety'
  varietyId?: Maybe<Scalars['Int']>
  varietyName?: Maybe<Scalars['String']>
}

export type VarietyInput = {
  varietyId?: Maybe<Scalars['Int']>
  varietyName: Scalars['String']
  categoryId?: Maybe<Scalars['Int']>
}

export type _Service = {
  __typename?: '_Service'
  sdl: Scalars['String']
}
