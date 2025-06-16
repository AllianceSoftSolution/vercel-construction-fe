import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import apiClient from "../api/apiClient";
import { logout } from "../redux/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AuthValidator() {

  const navigate=useNavigation()
  const {isLoggedIn}=useSelector(state=>state.auth)

  useEffect(() => {
    if(!isLoggedIn){
      navigate("/")
    }
  }, []);

 
}
