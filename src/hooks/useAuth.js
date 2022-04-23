import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [data, setData] = useState({});
  const userLog = JSON.parse(localStorage.getItem('userLog'));
  useEffect(() => {
    try {
      setData(userLog);
    } catch {
      setData({});
    }
  }, []);
  return { data };
};
