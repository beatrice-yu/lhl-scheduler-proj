import { useState } from "react";

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (mode, replace = false) => {
    (replace) ? setHistory(prev => [...prev.slice(0, prev.length - 1), mode]) : setHistory(prev => [...prev, mode]);
    setMode(mode);
  };

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return { mode, transition, back };
};

export default useVisualMode;