import PropTypes from "prop-types";

function PlaceOrderForm({ handleSubmit, onSubmit, register, errors }) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="col-md-8 bg-light p-4 rounded shadow-sm">
      <h4 className="text-center mb-4">填寫訂單資訊</h4>

      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-bold">
          收件人姓名
        </label>
        <input
          id="name"
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="請輸入姓名"
          {...register("name", { required: "請輸入收件人姓名。" })}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

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
            minLength: {
              value: 8,
              message: "電話號碼至少需要 8 碼。",
            },
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

      <div className="mb-3">
        <label htmlFor="message" className="form-label fw-bold">
          留言
        </label>
        <textarea
          id="message"
          className="form-control"
          placeholder="如果有特殊需求，可以在這裡填寫"
          rows="3"
          {...register("message")}
        />
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary w-50">
          送出訂單
        </button>
      </div>
    </form>
  );
}

PlaceOrderForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default PlaceOrderForm;
