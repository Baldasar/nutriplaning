const LocalStorageHelper = () => {
  const clear = () => {
    localStorage.clear();
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  const getItem = (key: string) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const setItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return { clear, removeItem, getItem, setItem };
};

export default LocalStorageHelper;
