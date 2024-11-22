import ProductTable from "../features/product/ProductTable";
import ProductTableOperation from "../features/product/ProductTableOperation";

import Row from "../ui/Row";

function Product() {
  return (
    <>
      <Row type="horizontal">
        <h1 className="text-xl md:text-2xl font-semibold leading-4 pb-2 md:pb-4">
          Products
        </h1>
        <ProductTableOperation />
      </Row>
      <Row>
        <ProductTable />
      </Row>
    </>
  );
}

export default Product;
