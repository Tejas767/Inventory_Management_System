


// import toast from "react-hot-toast";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // Add a flag to prevent multiple refresh requests

// let isRefreshing = false;

// let failedQueue = [];

// const processQueue = (error, token = null) => {

//   failedQueue.forEach(prom => {

//     if (error) {

//       prom.reject(error);

//     } else {

//       prom.resolve(token);

//     }

//   });

//   failedQueue = [];

// };

// export const apiClient = async (endpoint, options = {}) => {

//   const config = {

//     ...options,

//     credentials: "include",

//     headers: {

//       "Content-Type": "application/json",

//       ...options.headers,

//     },

//   };

//   try {

//     let response = await fetch(`${API_URL}${endpoint}`, config);

//     // If Access Token expired

//     if (response.status === 401) {

//       // Check if this is already a refresh request to avoid infinite loop

//       if (endpoint === '/auth/refresh') {

//         // Refresh token failed, force logout

//         await handleLogout();

//         throw new Error("Session expired");

//       }

//       // Try to refresh the token

//       try {

//         // If already refreshing, wait for it to complete

//         if (isRefreshing) {

//           // Wait for the refresh to complete

//           await new Promise((resolve, reject) => {

//             failedQueue.push({ resolve, reject });

//           });

//           // Retry the original request

//           response = await fetch(`${API_URL}${endpoint}`, config);

//           return response;

//         }

//         isRefreshing = true;

//         // Attempt to refresh

//         const refreshRes = await fetch(`${API_URL}/auth/refresh`, {

//           method: "POST",

//           credentials: "include",

//           headers: {

//             "Content-Type": "application/json",

//           },

//         });

//         if (refreshRes.ok) {

//           // Refresh successful

//           processQueue(null);

//           // Retry original request

//           response = await fetch(`${API_URL}${endpoint}`, config);

//           return response;

//         } else {

//           // Refresh failed

//           processQueue(new Error("Refresh failed"));

//           await handleLogout();

//           throw new Error("Session expired");

//         }

//       } catch (refreshError) {

//         processQueue(refreshError);

//         throw refreshError;

//       } finally {

//         isRefreshing = false;

//       }

//     }

//     return response;

//   } catch (error) {

//     console.error("API Error:", error.message);

//     throw error;

//   }

// };

// // Central Logout Function

// const handleLogout = async () => {

//   try {

//     await fetch(`${API_URL}/auth/logout`, {

//       method: "POST",

//       credentials: "include",

//     });

//   } catch (e) {

//     console.error(e);

//   }

//   localStorage.removeItem("user");

//   toast.error("Session expired");

//   window.location.replace("/login");

// };


 
import toast from "react-hot-toast";
 
const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
// Add a flag to prevent multiple refresh requests
 
let isRefreshing = false;
 
let failedQueue = [];
 
const processQueue = (error, token = null) => {
 
  failedQueue.forEach(prom => {
 
    if (error) {
 
      prom.reject(error);
 
    } else {
 
      prom.resolve(token);
 
    }
 
  });
 
  failedQueue = [];
 
};
 
export const apiClient = async (endpoint, options = {}) => {
 
  const config = {
 
    ...options,
 
    credentials: "include",
 
    headers: {
 
      "Content-Type": "application/json",
 
      ...options.headers,
 
    },
 
  };
 
  try {
 
    let response = await fetch(`${API_URL}${endpoint}`, config);
 
    // If Access Token expired
 
    if (response.status === 401) {
 
      // Check if this is already a refresh request to avoid infinite loop
 
      if (endpoint === '/auth/refresh') {
 
        // Refresh token failed, force logout
 
        await handleLogout();
 
        throw new Error("Session expired");
 
      }
 
      // Try to refresh the token
 
      try {
 
        // If already refreshing, wait for it to complete
 
        if (isRefreshing) {
 
          // Wait for the refresh to complete
 
          await new Promise((resolve, reject) => {
 
            failedQueue.push({ resolve, reject });
 
          });
 
          // Retry the original request
 
          response = await fetch(`${API_URL}${endpoint}`, config);
 
          return response;
 
        }
 
        isRefreshing = true;
 
        // Attempt to refresh
 
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
 
          method: "POST",
 
          credentials: "include",
 
          headers: {
 
            "Content-Type": "application/json",
 
          },
 
        });
 
        if (refreshRes.ok) {
 
          // Refresh successful
 
          processQueue(null);
 
          // Retry original request
 
          response = await fetch(`${API_URL}${endpoint}`, config);
 
          return response;
 
        } else {
 
          // Refresh failed
 
          processQueue(new Error("Refresh failed"));
 
          await handleLogout();
 
          throw new Error("Session expired");
 
        }
 
      } catch (refreshError) {
 
        processQueue(refreshError);
 
        throw refreshError;
 
      } finally {
 
        isRefreshing = false;
 
      }
 
    }
 
    return response;
 
  } catch (error) {
 
    console.error("API Error:", error.message);
 
    throw error;
 
  }
 
};
 
// Central Logout Function
 
const handleLogout = async () => {
 
  try {
 
    await fetch(`${API_URL}/auth/logout`, {
 
      method: "POST",
 
      credentials: "include",
 
    });
 
  } catch (e) {
 
    console.error(e);
 
  }
 
  localStorage.removeItem("user");
 
  toast.error("Session expired");
 
  window.location.replace("/login");
 
};
 
 