import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const observer = useRef();

  const lastItemRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading]
  );

  useEffect(() => {
    setLoading(true);
    axios("https://randomuser.me/api/", {
      method: "GET",
      params: {
        page,
        results: 20,
        inc: "phone,name"
      }
    })
      .then(res => setData(prev => [...prev, ...res.data.results]))
      .catch(e => console.log(e));
    setLoading(false);
  }, [page]);

  return (
    <div className="container">
      <div className="itemList">
        {data &&
          data.map((d, i) => {
            if (data.length === i + 1) {
              return (
                <div key={i} ref={lastItemRef} className="item">
                  {" "}
                  <p>{`${d.name.first} ${d.name.last}`}</p> <p>{d.phone}</p>
                </div>
              );
            } else {
              return (
                <div key={i} className="item">
                  {" "}
                  <p>{`${d.name.first} ${d.name.last}`}</p>
                  <p>{d.phone}</p>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default App;
