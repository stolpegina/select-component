import React, { FC, useState, useRef } from "react";
import { IData } from "../../types/types";

import "./select.styles.scss";

interface SelectProps {
    data: IData[];
    handleChange: (item: {
        id: number;
        name: string;
        checked: boolean;
    }) => void;
}

const Select: FC<SelectProps> = ({ data, handleChange }) => {
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(false);

    const inputEl = useRef<HTMLInputElement>(null);

    const clearInput = (allData: any[]) => {
        const arr = allData.filter(elem => elem.checked);
        arr.forEach(elem => handleChange(elem));
    };

    const filteredItems = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const showListClass = showList ? "select__list show_list" : "select__list";

    const setRef = () => {
        if (inputEl && inputEl.current) {
            inputEl.current.focus();
        }
    };

    return (
        <div>
            <div className="select">
                <div className="select__box" onClick={setRef}>
                    {data
                        .filter((item) => item.checked)
                        .map((item) => (
                            <div className="select__checked-elem" key={item.id}>
                                <span>{item.name}</span>
                                <span
                                    className="remove-button"
                                    onClick={() => {
                                        handleChange(item);
                                    }}
                                > &#215;</span>
                            </div>
                        ))}
                    <input
                        className="select__input"
                        ref={inputEl}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={() => setShowList(true)}
                        onFocus={() => setShowList(true)}
                        onBlur={() => setTimeout(() => setShowList(false), 500)}
                    />
                </div>
                <span className="remove-button" onClick={() => clearInput(data)}>
                    &#10006;
                </span>
            </div>
            <div className={showListClass}>
                {filteredItems.length ? (
                    filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onFocus={() => setShowList(true)}
                            onClick={() => {
                                handleChange(item);
                            }}
                        >
                            {item.name}
                        </div>
                    ))
                ) : (
                    <div>No result</div>
                )}
            </div>
        </div>
    );
};

export default Select;
