import { Col, Row, Button } from "react-bootstrap";
import TopSales from "../components/TopSales";

// заглушки
import productsJson from "../data/products.json";
import categoriesJson from "../data/categories.json";
//
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

const Main = () => {
  // all products
  const products = JSON.parse(JSON.stringify(productsJson));
  // all categories
  const categories = JSON.parse(JSON.stringify(categoriesJson));

  // top-sales ids
  const topSaleIds = [66, 65, 73];

  // хиты продаж
  const topSales = products.filter((product) =>
    topSaleIds.includes(product.id)
  );

  // offset (сколько показывать и сколько загружать дополнительно)
  const offset = 6;
  // const moreCount = 6; // вместо запросов

  // Для запросов по выбранной категории (или категория "все")
  const [productsArray, setProductsArray] = useState(products);

  // Pagination
  const [page, setPage] = useState(1);

  const [end, setEnd] = useState(6);

  const [productsArrayPage, setProductsArrayPage] = useState(
    // products.slice(0, offset)
    []
  );

  // categories states
  const [activeKey, setActiveKey] = useState("all");
  const handleSelect = (eventKey, e) => {
    setActiveKey(eventKey);
    console.log(eventKey);
    console.log(e.target);

    if (eventKey === "all") {
      console.log(`get request: http://localhost:7070/api/items`);
      setPage(1);
      setEnd(offset);
      setProductsArray([...products]);
      setProductsArrayPage([...products].slice(0, offset));
    } else {
      console.log(
        `get request: http://localhost:7070/api/items?categoryId=${eventKey}`
      );
      const productsByCategory = products.filter(
        (product) => product.category === Number(eventKey)
      );
      setPage(1);
      setEnd(offset);
      setProductsArray(productsByCategory);
      setProductsArrayPage(productsByCategory.slice(0, offset));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // setEnd(end + 6);
      setProductsArrayPage(productsArray.slice(0, end));
    }, 500);
  }, [page]);

  return (
    <main className="container">
      <Row>
        <Col>
          <TopSales products={topSales} />

          <section className="catalog">
            <h2 className="text-center">Каталог</h2>
            <Categories
              categories={categories}
              activeKey={activeKey}
              handleSelect={handleSelect}
            />
            <Row className="row">
              {productsArrayPage.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cardClassName="catalog-item-card"
                  basePath="catalog/"
                />
              ))}
            </Row>
            {productsArray.length - productsArrayPage.length > offset &&
              productsArrayPage.length > 0 && (
                <div className="text-center">
                  <Button
                    variant="outline-primary"
                    className="btn-outline-primary"
                    onClick={() => {
                      setPage(page + 1);
                      setEnd(end + 6);
                    }}
                  >
                    Загрузить ещё
                  </Button>
                </div>
              )}
          </section>
        </Col>
      </Row>
    </main>
  );
};

export default Main;
