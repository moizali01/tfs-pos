import { EyeOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import DefaultLayout from "../components/DefaultLayout";
import "../styles/InvoiceStyles.css";

const apiUrl = process.env.REACT_APP_API_URL;

const BillsPage = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch bills and sort them in descending order by date
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(`${apiUrl}/api/bills/get-bills`);

      // Sort bills by date in descending order
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBillsData(sortedData);
      dispatch({ type: "HIDE_LOADING" });
      console.log(sortedData);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  //useEffect
  useEffect(() => {
    getAllBills();
    //eslint-disable-next-line
  }, []);

  //print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //table data
  const columns = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    { title: "Contact No", dataIndex: "customerNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record) => {
        const discount = record.subTotal - record.totalAmount;
        return `PKR ${discount.toFixed(2)}`;
      },
    },
    { title: "Total Amount", dataIndex: "totalAmount" },
    {
      title: "Order Date",
      dataIndex: "date",
      render: (date) => {
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Karachi',
          hour12: false,
        };
        return new Date(date).toLocaleString('en-US', options);
      },
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];
  
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Invoice list</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* ============ invoice modal start ==============  */}
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="info">
                <h2>TFS Studio</h2>
                <p> Contact : +92-3120436566 <br/> 63-A, Faisal Town, Lahore</p>
              </div>
            </center>
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name: <b>{selectedBill.customerName}</b>
                  <br />
                  Phone:  <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date :{" "}
                  <b>
                    {new Date(selectedBill.date).toLocaleDateString("en-GB")}
                  </b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item table-header">
                        <p><b>Item</b></p>
                      </td>
                      <td className="Hours table-header">
                        <p><b>Qty</b></p>
                      </td>
                      <td className="Rate table-header">
                        <p><b>Price</b></p>
                      </td>
                      <td className="Rate table-header">
                        <p><b>Total</b></p>
                      </td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <tr className="service" key={item._id}>
                        <td className="tableitem">
                          <p className="itemtext">{item.name}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.quantity}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.price}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{item.quantity * item.price}</p>
                        </td>
                      </tr>
                    ))}
                    {/* Discount Row */}
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate table-header">
                        <p className="discount-label">Discount</p>
                      </td>
                      <td className="payment">
                        <p className="discount-value">
                          PKR {(selectedBill.subTotal - selectedBill.totalAmount).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                    {/* Grand Total Row */}
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate table-header">
                        <p className="grand-total-label"><b>Grand Total</b></p>
                      </td>
                      <td className="payment">
                        <p className="grand-total-value">
                          <b>PKR {selectedBill.totalAmount}</b>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong>
                  <b> thefragrancesquare.com</b>
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;