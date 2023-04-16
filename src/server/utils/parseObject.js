const parseObject = (rawData) => {
  try {
    return JSON.parse(rawData);
  } catch {
    return undefined;
  }
};

export default parseObject;
