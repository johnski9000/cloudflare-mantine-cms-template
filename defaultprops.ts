export const igniteString = (value) => {
  return {
    type: "string",
    value: value,
  };
};
export const igniteNumber = (value) => {
  return {
    type: "number",
    value: value,
  };
};
export const igniteBoolean = (value) => {
  return {
    type: "boolean",
    value: value,
  };
};
export const igniteImage = (value) => {
  return {
    type: "image",
    value: value,
    format: "image",
  };
};
export const igniteArray = (value) => {
  return {
    type: "array",
    value: value,
  };
};
