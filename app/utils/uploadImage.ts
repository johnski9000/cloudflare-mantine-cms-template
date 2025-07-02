export const uploadImage = async (image: string | Blob) => {
  console.log("uploadImage called with image:", image);

  try {
    const formData = new FormData();
    formData.append("file", image);
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      return data.url;
    } else {
      return data.error;
    }
  } catch (error) {
    return error;
  }
};
