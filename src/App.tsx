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

  const handleChange = async (updatedData: IData | IData[]) => {
    const dataCopy = [...data];
    const updatedItems = Array.isArray(updatedData) ? updatedData : [updatedData];

    for (const item of updatedItems) {
      const index = data.findIndex(({ id }) => id === item.id)
      dataCopy.splice(index, 1, item);
    }

    setData(dataCopy);
  };

  const searchByName = (query: string) => {
    return fetch(`http://localhost:3001/data?q=${query}`, {
      method: "GET"
    }).then(response => response.json());
  }

  return (
    <div className="App">
      <Select
        data={data}
        handleChange={handleChange}
        searchByName={searchByName}
      />
    </div>
  );
}

export default App;
