import PropTypes from "prop-types";
import ReactLoading from "react-loading";
import { currency } from "../utils/filter";

function ProductList({
  products,
  openModal,
  addCart,
  loadingProductId,
  loadingCartId,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th scope="col" className="text-center">
              圖片
            </th>
            <th scope="col">產品名稱</th>
            <th scope="col" className="text-end">
              價錢
            </th>
            <th scope="col" className="text-center">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="text-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="img-thumbnail"
                  style={{ maxWidth: "150px", maxHeight: "100px" }}
                />
              </td>
              <td className="fw-bold">{product.title}</td>
              <td className="text-end">
                <div className="text-muted">
                  <del>原價：{currency(product.origin_price)} 元</del>
                </div>
                <div className="text-danger fw-bold">
                  特價：{currency(product.price)} 元
                </div>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => openModal(product.id)}
                    disabled={loadingProductId === product.id}>
                    {loadingProductId === product.id ? (
                      <ReactLoading
                        type="spin"
                        color="#6c757d"
                        height={20}
                        width={20}
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id, 1)}
                    disabled={loadingCartId === product.id}>
                    {loadingCartId === product.id ? (
                      <ReactLoading
                        type="spin"
                        color="#dc3545"
                        height={20}
                        width={20}
                      />
                    ) : (
                      "加入購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      origin_price: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  openModal: PropTypes.func.isRequired,
  addCart: PropTypes.func.isRequired,
  loadingProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loadingCartId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ProductList;
