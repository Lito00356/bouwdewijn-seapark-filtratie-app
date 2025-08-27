export const API = "/api/";

export async function fetchData(url) {
  try {
    const response = await fetch(`${API}${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch:`, error);
    throw error;
  }
}

export function getCurrentEndpoint() {
  const pathParts = window.location.pathname.split("/");
  let endpoint = pathParts[pathParts.length - 1];

  if (endpoint === "departments") {
    return endpoint;
  } else if (endpoint === "history") {
    endpoint = "departments";
    return endpoint;
  } else if (endpoint !== "users") {
    endpoint = "users";
    return endpoint;
  }
}

// export function getCurrentEndpoint() {
//   const pathParts = window.location.pathname.split("/");
//   let endpoint = pathParts[pathParts.length - 1];

//   if (endpoint !== "users") {
//     endpoint = "users";
//   }
//   return endpoint;
// }
