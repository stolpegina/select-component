import React, { FC, useEffect, useState } from "react";

import './select.styles.scss';

interface SelectProps {
    test: string;
}

interface IchangedItem {
    id: number;
    fruit: string;
    checked: boolean;
}


const Select: FC<SelectProps> = ({ test }) => {

    const [data, setData] = useState<{ id: number, fruit: string, checked: boolean }[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/data')
            .then(response => response.json())
            .then(data => setData(data));
    }, []);


    const clearInput = (allData: any[]) => {
        const arr = allData.map((elem) => ({ ...elem, checked: false }));
        setData(arr);
        console.log(arr);
    }

    const handleChange = (item: { id: number, fruit: string, checked: boolean }) => {
        console.log(item);
        const changedItem = { ...item, checked: !item.checked };

        fetch(`http://localhost:3001/data/${item.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changedItem)
        })
            .then(response => response.json())
            .then(dataResp => {
                const updatedData = data.map(el => el.id === item.id ? dataResp : el);
                setData(updatedData);
            });
    }

    return (
        <div>
            <div className="select">
                <div className="select__input">
                    {data.filter(item => item.checked).map(item =>
                        <div className="select__checked-elem" key={item.id}>
                            <span>{item.fruit}</span>
                            <span> x</span>
                        </div>)}
                </div>
                <span onClick={() => clearInput(data)}>X</span>
                <br />
            </div>
            <div className="select__list">
                {data.map(item => <div key={item.id} onClick={() => {
                    handleChange(item);
                }}>{item.fruit}</div>)}
            </div>
        </div>
    )
}

export default Select;
