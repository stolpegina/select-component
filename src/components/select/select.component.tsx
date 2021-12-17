import React, { FC, useState, useRef, useEffect } from "react";
import { IData } from "../../types/types";
import useDebounce from "../../use-debounce";

import "./select.styles.scss";

interface SelectProps {
    data: IData[];
    handleChange: (item: {
        id: number;
        name: string;
        checked: boolean;
    }) => void;
    searchByName: (search: string) => any;
    searchResult: any;
}

const Select: FC<SelectProps> = ({ data, handleChange, searchByName, searchResult }) => {
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(false);

    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState([]);

    const inputEl = useRef<HTMLInputElement>(null);

    const debouncedSearchTerm = useDebounce(search, 2000);

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                setIsSearching(true);
                searchByName(debouncedSearchTerm).then((result: React.SetStateAction<never[]>) => {
                    setIsSearching(false);
                    setResults(result);
                });
            } else {
                setResults([]);
            }
        },
        [debouncedSearchTerm]
    )

    const clearInput = (allData: any[]) => {
        const arr = allData.filter(elem => elem.checked);
        arr.forEach(elem => handleChange(elem));
    };

    const setRef = () => {
        if (inputEl && inputEl.current) {
            inputEl.current.focus();
        }
    };

    const getSearchResult = () => {
        const filteredItems = data.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        return results.length ? results : filteredItems;
    }

    return (
        <div>
            <div className="select">
                {isSearching && <div className="search__animation"></div>}
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
                    <span
                        className="select__arrow"
                        onClick={() => setShowList(!showList)}>
                        &#8744;
                    </span>
                </div>
                <span className="remove-button" onClick={() => clearInput(data)}>
                    &#10006;
                </span>
            </div>
            <div className={showList ? "select__list show_list" : "select__list"}>
                {getSearchResult().length ? (
                    getSearchResult().map((item) => (
                        <div
                            className={item.checked ? 'select__checked-item' : ''}
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
