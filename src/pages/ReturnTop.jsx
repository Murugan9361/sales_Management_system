import React from 'react'
import { useLocation } from "react-router-dom";
const ReturnTop = () => {
 const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return null;
}

export default ReturnTop;

 
