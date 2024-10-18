import { Col, Row, Input } from "antd"; // Import Input from antd
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ItemList from "../components/ItemList";
import DefaultLayout from "./../components/DefaultLayout";


const apiUrl = process.env.REACT_APP_API_URL;

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selecedCategory, setSelecedCategory] = useState("all"); // Default to "all"
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query

  const categories = [
    {
      name: "all", // Add an "all" category
      imageUrl: "https://cdn.shopify.com/s/files/1/0550/3497/0249/files/tdh.png?v=1727626324", // Example image for "all" category
    },
    {
      name: "Perfume",
      imageUrl: "https://cdn.shopify.com/s/files/1/0550/3497/0249/files/26.png?v=1727629052",
    },
    {
      name: "Home",
      imageUrl: "https://cdn.shopify.com/s/files/1/0550/3497/0249/files/pear_and_guava.png?v=1727628417",
    },
    {
      name: "Mists",
      imageUrl: "https://cdn.shopify.com/s/files/1/0550/3497/0249/files/noplacelikehome.png?v=1727631824",
    },
    // Add more categories if needed...
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(`/api/items/get-item`);
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);

  // Filter items by category and search query
  const filteredItems = itemsData.filter((item) => {
    const matchesCategory =
      selecedCategory === "all" || item.category === selecedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()); // Check if item name matches search query
    return matchesCategory && matchesSearch; // Both conditions must be true
  });

  return (
    <DefaultLayout>
      {/* Category selection */}
      <div className="d-flex">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`d-flex category ${
              selecedCategory === category.name && "category-active"
            }`}
            onClick={() => setSelecedCategory(category.name)}
          >
            <h4>{category.name}</h4>
            <img
              src={category.imageUrl}
              alt={category.name}
              height="40"
              width="60"
            />
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ margin: "20px 0" }}>
        <Input
          placeholder="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display filtered items */}
      <Row>
        {filteredItems.map((item) => (
          <Col xs={24} lg={6} md={12} sm={6} key={item.id}>
            <ItemList item={item} />
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
