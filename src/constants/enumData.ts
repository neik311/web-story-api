export const enumData = {
  StatusFilter: {
    All: { value: 0, code: 'all', name: 'Tất cả' },
    Active: { value: 1, code: 'active', name: 'Đang hoạt động' },
    InActive: { value: 2, code: 'inactive', name: 'Ngưng hoạt động' },
  },

  /** Kiểu truyện */
  StoryType: {
    word: { code: 'word', name: 'Truyện chữ' },
    comic: { code: 'comic', name: 'Truyện tranh' },
  },

  /** Quyền user */
  Role: {
    User: { code: 'user', name: 'Người dùng' },
    Admin: { code: 'admin', name: 'Quản trị viên' },
    Owner: { code: 'owner', name: 'Chủ sở hữu' },
  },

  /** Loại xác thực */
  VerifyEmailType: {
    Register: { code: 'register', name: 'Đăng ký' },
    ForgotPassword: { code: 'forgotPassword', name: 'Quên mật khẩu' },
  },
}
