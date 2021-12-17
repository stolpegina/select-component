import React, { useEffect, useState } from 'react';

import Select from './components/select/select.component';
import { IData } from './types/types';

const App = () => {

  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);


  const handleChange = (item: {
    id: number;
    name: string;
    checked: boolean;
  }) => {
    const changedItem = { ...item, checked: !item.checked };

    fetch(`http://localhost:3001/data/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedItem),
    })
      .then((response) => response.json())
      .then((dataResp) => {
        const updatedData = data.map((el) =>
          el.id === item.id ? dataResp : el
        );
        setData(updatedData);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="App">
      <Select data={data} handleChange={(item) => handleChange(item)} />
    </div>
  );
}

export default App;
