import PropTypes from "prop-types"; // PropTypes 用於元件屬性的類型檢查
import ReactLoading from "react-loading"; // ReactLoading 用於顯示加載狀態的指示器
import { currency } from "../utils/filter"; // 自訂的 `currency` 函式，用於格式化貨幣

/**
 * ProductList 元件負責展示產品清單，包括圖片、名稱、價錢以及操作按鈕。
 *
 * @param {Array} products - 產品清單，每個產品為一個物件，包含 id, title, imageUrl, origin_price, price 等屬性。
 * @param {Function} openModal - 用於打開產品詳細資料的 Modal。
 * @param {Function} addCart - 用於將產品加入購物車的函式。
 * @param {String|Number} loadingProductId - 當前正在載入詳細資料的產品 ID，用於顯示加載狀態。
 * @param {String|Number} loadingCartId - 當前正在加入購物車的產品 ID，用於顯示加載狀態。
 */
function ProductList({
  products,
  openModal,
  addCart,
  loadingProductId,
  loadingCartId,
}) {
  return (
    <div className="table-responsive text-nowrap">
      {/* 使用 Bootstrap 提供的 `table-responsive` 類，使表格在小螢幕上可以左右滑動 */}
      <table className="table table-striped align-middle">
        {/* 表格標題行 */}
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
              {/* 圖片欄位 */}
              <td className="text-center">
                <img
                  src={product.imageUrl} // 產品圖片的 URL
                  alt={product.title} // 替代文字，顯示產品名稱
                  className="img-thumbnail" // 使用 Bootstrap 的縮略圖樣式
                  style={{ maxWidth: "150px", maxHeight: "100px" }} // 設定圖片大小限制
                />
              </td>

              {/* 產品名稱欄位 */}
              <td className="fw-bold">{product.title}</td>

              {/* 價錢欄位 */}
              <td className="text-end">
                <div className="text-muted">
                  {/* 原價，使用刪除線標示 */}
                  <del>原價：{currency(product.origin_price)} 元</del>
                </div>
                <div className="text-danger fw-bold">
                  {/* 特價，顯示為紅色加粗 */}
                  特價：{currency(product.price)} 元
                </div>
              </td>

              {/* 操作按鈕欄位 */}
              <td className="text-center">
                <div className="btn-group btn-group-sm">
                  {/* 查看更多按鈕 */}
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => openModal(product.id)} // 點擊時打開 Modal，顯示產品詳細資料
                    disabled={loadingProductId === product.id}>
                    {" "}
                    {/* 如果產品正在加載，禁用按鈕 */}
                    {loadingProductId === product.id ? (
                      <ReactLoading
                        type="spin" // 加載效果的類型
                        color="#6c757d" // 顏色
                        height={20} // 高度
                        width={20} // 寬度
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>

                  {/* 加入購物車按鈕 */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id, 1)} // 點擊時將產品加入購物車
                    disabled={loadingCartId === product.id}>
                    {" "}
                    {/* 如果產品正在加入購物車，禁用按鈕 */}
                    {loadingCartId === product.id ? (
                      <ReactLoading
                        type="spin" // 加載效果的類型
                        color="#dc3545" // 顏色
                        height={20} // 高度
                        width={20} // 寬度
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

/**
 * 設定元件的 PropTypes，進行類型檢查。
 */
ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // 產品 ID，字串或數字類型
      title: PropTypes.string.isRequired, // 產品名稱
      imageUrl: PropTypes.string.isRequired, // 產品圖片的 URL
      origin_price: PropTypes.number.isRequired, // 產品原價
      price: PropTypes.number.isRequired, // 產品特價
    })
  ).isRequired,
  openModal: PropTypes.func.isRequired, // 打開產品詳細資料的函式
  addCart: PropTypes.func.isRequired, // 加入購物車的函式
  loadingProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 當前正在加載的產品 ID
  loadingCartId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 當前正在加入購物車的產品 ID
};

export default ProductList;
