const data = {
  level: 0,
};

export const get = (key: keyof typeof data) => data[key];

export const incrementLevel = () => data.level++;
