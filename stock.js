import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const useStock = () => {
  const [stock, setStock] = useState(() => {
    const savedStock = localStorage.getItem("stockData");
    return savedStock ? JSON.parse(savedStock) : {};
  });

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const stockCollection = collection(db, "products");
        const stockSnapshot = await getDocs(stockCollection);
        let stockData = {};

        stockSnapshot.forEach((doc) => {
          stockData[doc.id] = doc.data().variants; // Assuming "variants" holds stock info
        });

        setStock(stockData);
        localStorage.setItem("stockData", JSON.stringify(stockData));
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };

    fetchStock();
  }, []);

  return stock;
};

export default useStock;
