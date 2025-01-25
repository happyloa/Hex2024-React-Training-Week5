import PropTypes from "prop-types"; // 用於檢查元件的 prop 類型

/**
 * Pagination 元件用於顯示分頁的導航按鈕。
 * 包含 "上一頁"、"下一頁" 按鈕和各分頁數字按鈕。
 *
 * @param {Object} pagination - 包含分頁資訊的物件。
 * @param {Function} changePage - 用於切換頁面的函式。
 */
function Pagination({ pagination, changePage }) {
  /**
   * 處理點擊事件，避免默認行為並調用切換頁面函式。
   *
   * @param {Object} event - 點擊事件。
   * @param {number} page - 要切換的頁面編號。
   */
  const handleClick = (event, page) => {
    event.preventDefault(); // 阻止默認行為 (例如超連結跳轉)
    changePage(page); // 調用父元件提供的函式，改變頁面
  };

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center my-4">
        {/* 上一頁按鈕 */}
        <li
          className={`page-item ${!pagination.has_pre && "disabled"}`} // 如果沒有上一頁，禁用按鈕
        >
          <a
            href="/" // 使用超連結結構，但阻止默認行為
            aria-label="Previous" // 無障礙：上一頁按鈕的描述
            className="page-link" // Bootstrap 分頁樣式
            onClick={
              (event) =>
                pagination.has_pre && // 僅當有上一頁時執行
                handleClick(event, pagination.current_page - 1) // 切換到前一頁
            }>
            <span aria-hidden="true">&laquo;</span> {/* 左雙箭頭符號 */}
          </a>
        </li>

        {/* 分頁數字按鈕 */}
        {[...new Array(pagination.total_pages)].map((_, i) => (
          <li
            className={`page-item ${
              i + 1 === pagination.current_page ? "active" : "" // 當前頁面時標記為 "active"
            }`}
            key={`${i}_page`} // 每個按鈕唯一的 key
          >
            <a
              className="page-link" // Bootstrap 分頁按鈕樣式
              href="/" // 超連結結構
              onClick={(event) => handleClick(event, i + 1)} // 切換到點擊的頁面
            >
              {i + 1} {/* 顯示頁面編號 */}
            </a>
          </li>
        ))}

        {/* 下一頁按鈕 */}
        <li
          className={`page-item ${!pagination.has_next && "disabled"}`} // 如果沒有下一頁，禁用按鈕
        >
          <a
            className="page-link" // Bootstrap 分頁樣式
            href="/" // 使用超連結結構，但阻止默認行為
            aria-label="Next" // 無障礙：下一頁按鈕的描述
            onClick={
              (event) =>
                pagination.has_next && // 僅當有下一頁時執行
                handleClick(event, pagination.current_page + 1) // 切換到下一頁
            }>
            <span aria-hidden="true">&raquo;</span> {/* 右雙箭頭符號 */}
          </a>
        </li>
      </ul>
    </nav>
  );
}

/**
 * PropTypes 驗證，用於檢查 Pagination 元件的 props。
 */
Pagination.propTypes = {
  pagination: PropTypes.shape({
    total_pages: PropTypes.number, // 總頁數
    current_page: PropTypes.number, // 當前頁面編號
    has_pre: PropTypes.bool, // 是否有上一頁
    has_next: PropTypes.bool, // 是否有下一頁
  }).isRequired,
  changePage: PropTypes.func.isRequired, // 用於切換頁面的函式
};

export default Pagination;
