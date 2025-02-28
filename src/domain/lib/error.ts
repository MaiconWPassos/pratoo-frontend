import axios from "axios";

export function exceptionValidation(error: any) {
  if (axios.isAxiosError(error) && error.response) {
    // Is this the correct way?
    return {
      message: error.response?.data.message as string,
      status: error.response.status,
    };
  } else {
    return { message: error.message as string, status: 500 };
  }
}
