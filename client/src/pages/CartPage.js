import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const [discount, setDiscount] = useState(0); // State to hold discount amount
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        _id: record._id,
        quantity: record.quantity + 1,
      },
    });
  };

  const handleDecrement = (record) => {
    if (record.quantity > 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: {
          _id: record._id,
          quantity: record.quantity - 1,
        },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp += item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  // Handle form submission
  const handleSubmit = async (value) => {
    try {
      const totalAfterDiscount = subTotal - discount; // Calculate total after discount
  
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        discount, // Include discount in the object
        totalAmount: totalAfterDiscount > 0 ? totalAfterDiscount : 0, // Ensure total is non-negative
        userId: JSON.parse(localStorage.getItem("user"))._id,
        date: new Date().toISOString(), // Add current timestamp
      };
  
      await axios.post("/api/bills/add-bills", newObject);
      message.success("Bill Generated");
  
      // Dispatch action to clear the cart
      dispatch({ type: "CLEAR_CART" });
  
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };
    

  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          SUB TOTAL : PKR <b>{subTotal}</b>/-
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>
      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="customerNumber"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="paymentMode"
            label="Payment Method"
            rules={[
              { required: true, message: "Please select payment method" },
            ]}
          >
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount"
          >
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))} // Update discount state
              placeholder="Enter discount amount"
            />
          </Form.Item>

          <div className="bill-it">
            <h5>
              Sub Total : <b>{subTotal}</b>
            </h5>
            <h5>
              Discount : <b>{discount}</b>
            </h5>
            <h5>
              GRAND TOTAL :{" "}
              <b>{subTotal - discount > 0 ? subTotal - discount : 0}</b>
            </h5>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
