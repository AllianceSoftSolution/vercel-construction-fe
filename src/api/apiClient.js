import { create } from "apisauce";
import { store } from "../redux/store";
// const baseURL = import.meta.env.VITE_BASE_URL;
// const baseURL = "http://localhost:5000/api/";
const baseURL = "http://localhost:5000/api/";  
// const baseURL = "http://radc-be-env.eba-emmvfm8c.eu-north-1.elasticbeanstalk.com/api/";

const apiClient = create({
  baseURL: baseURL,
});

apiClient.addRequestTransform((request) => {
  const authToken = store?.getState()?.auth?.token;
  if (!authToken) return;
  request.headers.authorization = "Bearer " + authToken;
});

apiClient?.addResponseTransform((response) => {
  // Handle response errors
  if (response.status === 401) {
    if (store?.getState()?.auth?.token) {
      //   store.dispatch(logout())
    }
  } else if (response.status === 403) {
    // toast.error('Restricted Route!!');
  }
});

function setAuthToken(token) {
  apiClient.setHeader("authorization", `Bearer ${token}`);
}

// Get all users
export const getAllUsers = async () => {
  return await apiClient.get("/auth/users");
};

export { setAuthToken };
export default apiClient;
