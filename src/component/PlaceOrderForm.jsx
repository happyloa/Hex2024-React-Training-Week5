import PropTypes from "prop-types";

/**
 * PlaceOrderForm 元件：用於用戶提交訂單資訊的表單。
 *
 * @param {Function} handleSubmit - React Hook Form 提供的處理表單提交的函式。
 * @param {Function} onSubmit - 表單提交時的回調函式，用戶點擊送出後觸發。
 * @param {Function} register - React Hook Form 提供的函式，用於註冊輸入框。
 * @param {Object} errors - React Hook Form 提供的錯誤物件，用於顯示輸入框的驗證錯誤。
 */
function PlaceOrderForm({ handleSubmit, onSubmit, register, errors }) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)} // 綁定表單提交事件
      className="col-md-8 bg-light p-4 rounded shadow-sm" // 使用 Bootstrap 樣式進行排版
    >
      {/* 表單標題 */}
      <h4 className="text-center mb-4">填寫訂單資訊</h4>

      {/* 收件人姓名 */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-bold">
          收件人姓名
        </label>
        <input
          id="name"
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`} // 根據錯誤狀態動態添加樣式
          placeholder="請輸入姓名"
          {...register("name", { required: "請輸入收件人姓名。" })} // 註冊輸入框並添加驗證規則
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div> // 顯示驗證錯誤
        )}
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          placeholder="請輸入 Email"
          {...register("email", {
            required: "請輸入 Email。",
            pattern: { value: /^\S+@\S+$/i, message: "Email 格式不正確。" },
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      {/* 收件人電話 */}
      <div className="mb-3">
        <label htmlFor="tel" className="form-label fw-bold">
          收件人電話
        </label>
        <input
          id="tel"
          type="tel"
          className={`form-control ${errors.tel ? "is-invalid" : ""}`}
          placeholder="請輸入電話"
          {...register("tel", {
            required: "請輸入收件人電話。",
            minLength: { value: 8, message: "電話號碼至少需要 8 碼。" },
            pattern: {
              value: /^\d+$/,
              message: "電話號碼格式不正確，僅限數字。",
            },
          })}
        />
        {errors.tel && (
          <div className="invalid-feedback">{errors.tel.message}</div>
        )}
      </div>

      {/* 收件人地址 */}
      <div className="mb-3">
        <label htmlFor="address" className="form-label fw-bold">
          收件人地址
        </label>
        <input
          id="address"
          type="text"
          className={`form-control ${errors.address ? "is-invalid" : ""}`}
          placeholder="請輸入地址"
          {...register("address", { required: "請輸入收件人地址。" })}
        />
        {errors.address && (
          <div className="invalid-feedback">{errors.address.message}</div>
        )}
      </div>

      {/* 留言區 */}
      <div className="mb-3">
        <label htmlFor="message" className="form-label fw-bold">
          留言
        </label>
        <textarea
          id="message"
          className="form-control"
          placeholder="如果有特殊需求，可以在這裡填寫"
          rows="3"
          {...register("message")} // 留言是可選的，沒有驗證規則
        />
      </div>

      {/* 提交按鈕 */}
      <div className="text-center">
        <button type="submit" className="btn btn-primary w-50">
          送出訂單
        </button>
      </div>
    </form>
  );
}

// PropTypes 驗證，用於檢查元件的 props 是否正確
PlaceOrderForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // 必須傳入 React Hook Form 的 handleSubmit 函式
  onSubmit: PropTypes.func.isRequired, // 必須傳入表單提交時的回調函式
  register: PropTypes.func.isRequired, // 必須傳入 React Hook Form 的 register 函式
  errors: PropTypes.object.isRequired, // 必須傳入 React Hook Form 的 errors 物件
};

export default PlaceOrderForm;
