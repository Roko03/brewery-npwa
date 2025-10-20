export const POST_REQUEST_PARAMETERS = {
  method: "POST",
  headers: {
    Accept: "application/json, */*",
    "Content-Type": "application/json",
  },
};

export const PATCH_REQUEST_PARAMETERS = {
  method: "PATCH",
  headers: {
    Accept: "application/json, */*",
    "Content-Type": "application/json",
  },
};

export const DELETE_REQUEST_PARAMETERS = {
  method: "DELETE",
  headers: {
    Accept: "*/*",
  },
};

export const PUT_REQUEST_PARAMETERS = {
  method: "PUT",
  headers: {
    Accept: "application/json, */*",
    "Content-Type": "application/json",
  },
};

export const PAGE_NUMBER = 1;
export const PAGE_SIZE = 20;

export const authHeaders = () => {
  const headers = new Headers();
  const token = localStorage.getItem(AuthKeys.TOKEN);

  if (token) {
    const { token: accessToken } = JSON.parse(token);

    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
};
