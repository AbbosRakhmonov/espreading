const url = "http://localhost:5000";
export const submitForm = async (data) => {
  try {
    const { body, id } = data;

    const response = await fetch(`${url}/api/questions/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};
