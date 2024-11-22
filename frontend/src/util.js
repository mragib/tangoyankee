import axios from "axios";
import { Colors } from "./static";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function changeForSelectArray(data) {
  return data.map((item) => {
    return {
      label: capitalizeFirstLetter(item.name),
      value: item.id,
    };
  });
}

export function changeForDatabaseArray(data) {
  return data.map((item) => {
    return {
      name: item.label,
      id: item.value,
    };
  });
}

export function changeForSelectObject(data) {
  return data
    ? {
        label: capitalizeFirstLetter(data.name),
        value: data.id,
      }
    : null;
}

export function changeForDatabaseObject(data) {
  return {
    name: data.label,
    id: data.value,
  };
}

export function changeCustomerDatabaseObject(data) {
  return {
    phone: data.label,
    id: data.value,
  };
}

export function changeCustomerSelectObject(data) {
  return {
    value: data.id,
    label: data.phone,
  };
}
export function getIsoDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",

    currencyDisplay: "symbol",
  })
    .format(value)
    .replace("BDT", "\u09F3");

export function randomColor() {
  const keys = Object.keys(Colors.names);
  return keys[Math.floor(Math.random() * keys.length)];
}

export async function addAndEdit({ id, newData, url }) {
  try {
    if (!id) {
      const res = await axios.post(url, newData);

      if (res.status !== 201) {
        throw new Error(res.data.message);
      }
      return res.data;
    }
    if (id) {
      const res = await axios.patch(`${url}/${id}`, newData);

      if (res.status !== 200) throw new Error("Something went wrong!🔥");
      return res.data;
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function fetchData({ url }) {
  try {
    const res = await axios.get(url);

    if (res.status !== 200) {
      throw new Error(res.data.message);
    }
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function deleteData({ url, id }) {
  try {
    const res = await axios.delete(`${url}/${id}`);

    if (res.status !== 200) throw new Error("Something went wrong!🔥");
    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export function getTotalAmount(array) {
  const totalAmount = array?.reduce((acc, { quantity, unitPrice }) => {
    const quantityValue = parseFloat(quantity || 0);
    const unitPriceValue = parseFloat(unitPrice || 0);
    let x = quantityValue * unitPriceValue;
    return acc + x;
  }, 0);

  return Math.ceil(totalAmount);
}
