require('dotenv').config()

/** Mã dùng chung */
export const PWD_SALT_ROUNDS = process.env.PWD_SALT_ROUNDS || 12
export const ERROR_NOT_FOUND_DATA = process.env.ERROR_NOT_FOUND_DATA || 'Không tìm thấy dữ liệu!'
export const ERROR_IS_DELETED_DATA = process.env.ERROR_IS_DELETED_DATA || 'Dữ liệu đã bị xóa!'
export const ERROR_NOT_FOUND_STORY = process.env.ERROR_NOT_FOUND_STORY || 'Không tìm thấy truyện!'
export const ERROR_NOT_FOUND_USER = process.env.ERROR_NOT_FOUND_USER || 'Không tìm thấy người dùng!'
export const ERROR_NOT_FOUND_COMMENT = process.env.ERROR_NOT_FOUND_COMMENT || 'Không tìm thấy bình luận!'
export const ERROR_CODE_TAKEN = process.env.ERROR_CODE_TAKEN || 'Mã đã được sử dụng!'
export const ERROR_NAME_TAKEN =process.env.ERROR_NAME_TAKEN || 'Tên đã được sử dụng!'
export const ERROR_USERNAME_DUPLICATE = process.env.ERROR_USERNAME_DUPLICATE || 'Tài khoản đã được sử dụng!'
export const ERROR_YOU_DO_NOT_HAVE_PERMISSION = process.env.ERROR_YOU_DO_NOT_HAVE_PERMISSION || 'Bạn không có quyền!'
export const ERROR_PHONE_TAKEN = process.env.ERROR_PHONE_TAKEN || 'Số Điện Thoại đã được sử dụng!'
export const ERROR_EMAIL_TAKEN =process.env.ERROR_EMAIL_TAKEN ||  'Email đã được sử dụng!'
export const ERROR_USERNAME_TAKEN = process.env.ERROR_USERNAME_TAKEN || 'Tên đăng nhập đã được sử dụng!'

export const CREATE_SUCCESS = process.env.CREATE_SUCCESS || 'Thêm mới thành công.'
export const UPDATE_SUCCESS = process.env.UPDATE_SUCCESS || 'Cập nhật thành công.'
export const ACCEPT_SUCCESS = process.env.ACCEPT_SUCCESS || 'Duyệt thành công.'
export const UPDATE_ACTIVE_SUCCESS = process.env.UPDATE_ACTIVE_SUCCESS || 'Cập nhật trạng thái thành công.'
export const DELETE_SUCCESS = process.env.DELETE_SUCCESS || 'Xoá thành công.'
export const IMPORT_SUCCESS = process.env.IMPORT_SUCCESS || 'Import thành công.'
export const ACTION_SUCCESS = process.env.ACTION_SUCCESS || 'Thao tác thành công.'

export const DEFAULT_CONNECTION_NAME =process.env.DEFAULT_CONNECTION_NAME ||  'default'
export const DATA_SOURCE = process.env.DATA_SOURCE || 'DATA_SOURCE'
export const TYPEORM_EX_CUSTOM_REPOSITORY = process.env.TYPEORM_EX_CUSTOM_REPOSITORY || 'TYPEORM_EX_CUSTOM_REPOSITORY'
export const AUTHOR_ERROR = process.env.AUTHOR_ERROR || 'Không có quyền truy cập!'

/** user error */
export const ERROR_CHECK_PASSWORD = process.env.ERROR_CHECK_PASSWORD || 'Mật khẩu không đúng!'
export const ERROR_LOCK_ACCOUNT = process.env.ERROR_LOCK_ACCOUNT || 'Tài khoản đã bị khóa'
export const ERROR_VERIFY_ACCOUNT = process.env.ERROR_VERIFY_ACCOUNT || "Tài khoản chưa được xác minh'"
export const ERROR_INPUT_EMAIL_USERNAME = process.env.ERROR_INPUT_EMAIL_USERNAME || 'Hãy nhập email hoặc username'
export const ERROR_INPUT_EMAIL_PASSWORD = process.env.ERROR_INPUT_EMAIL_PASSWORD || 'Hãy nhập mật khẩu'
export const ERROR_CREATE_USER = process.env.ERROR_CREATE_USER || 'Đã xảy ra lỗi khi thiết lập tài khoản người dùng'
export const ERROR_CHECK_VERIFY_CODE = process.env.ERROR_CHECK_VERIFY_CODE || 'Mã xác thực không chính xác'
export const ERROR_TIME_VERIFY_CODE = process.env.ERROR_TIME_VERIFY_CODE || 'Mã đã hết hạn'

/** srory error */
export const ERROR_INPUT_CATEGORY = process.env.ERROR_INPUT_CATEGORY || 'Hãy chọn một danh mục'
export const ERROR_VAL_STORYTYPE = process.env.ERROR_VAL_STORYTYPE || 'Loại truyện không hợp lệ'
export const ERROR_NOT_FOUND_CATEGORY = process.env.ERROR_NOT_FOUND_CATEGORY || 'Danh mục không tồn tại hoặc đã bị ngưng hoạt động'

/** category error */
export const ERROR_DELETE_CATEGORY = process.env.ERROR_DELETE_CATEGORY || 'Danh mục có truyện đang hoạt động, không thể xóa'

/** chapter error */
export const ERROR_CHAPTER_NUMBER_TAKEN = process.env.ERROR_CHAPTER_NUMBER_TAKEN || 'Số thứ tự chapter đã tồn tại'


export * from './enumData'
