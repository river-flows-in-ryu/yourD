export const commonFetch = async (
  url: string,
  method: string,
  payload?: any
): Promise<any> => {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        withcredentials: "include",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.log("fetch request cancel");
      } else if (error instanceof TypeError) {
        console.log("fetch url error");
      } else if (error instanceof SyntaxError) {
        console.log("fetch syntax error");
      } else {
        console.log("unexpected error");
      }
      throw error;
    } else {
      console.log("unknown error");
      throw new Error("unknown error");
    }
  }
};
