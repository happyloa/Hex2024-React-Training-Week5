import PropTypes from "prop-types";

function Pagination({ pagination, changePage }) {
  const handleClick = (event, page) => {
    event.preventDefault();
    changePage(page);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center my-4">
        {/* Previous Button */}
        <li className={`page-item ${!pagination.has_pre && "disabled"}`}>
          <a
            href="/"
            aria-label="Previous"
            className="page-link"
            onClick={(event) =>
              pagination.has_pre &&
              handleClick(event, pagination.current_page - 1)
            }>
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        {/* Page Numbers */}
        {[...new Array(pagination.total_pages)].map((_, i) => (
          <li
            className={`page-item ${
              i + 1 === pagination.current_page ? "active" : ""
            }`}
            key={`${i}_page`}>
            <a
              className="page-link"
              href="/"
              onClick={(event) => handleClick(event, i + 1)}>
              {i + 1}
            </a>
          </li>
        ))}

        {/* Next Button */}
        <li className={`page-item ${!pagination.has_next && "disabled"}`}>
          <a
            className="page-link"
            href="/"
            aria-label="Next"
            onClick={(event) =>
              pagination.has_next &&
              handleClick(event, pagination.current_page + 1)
            }>
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    total_pages: PropTypes.number,
    current_page: PropTypes.number,
    has_pre: PropTypes.bool,
    has_next: PropTypes.bool,
  }).isRequired,
  changePage: PropTypes.func.isRequired,
};

export default Pagination;
