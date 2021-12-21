import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import { IData } from "../../types/types";
import useDebounce from "../../use-debounce";

import "./select.styles.scss";

import { ReactComponent as CloseSvg } from '../../images/icons/close_icon.svg';
import { ReactComponent as DownArrowSvg } from '../../images/icons/down_arrow_icon.svg';

interface SelectProps {
    data: IData[];
    handleChange: (item: IData | IData[]) => void;
    searchByName: (search: string) => Promise<IData[]>;
    modeOne?: boolean;
}

const Select: FC<SelectProps> = ({ data, handleChange, searchByName, modeOne }) => {
    const [search, setSearch] = useState("");
    const [showList, setShowList] = useState(false);

    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<IData[]>([]);

    const searchResult = useMemo(() => {
        if (results.length) return results;

        const filteredItems = data.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        return filteredItems;
    }, [results, data, search]);

    const inputEl = useRef<HTMLInputElement>(null);

    const selectedItems = useMemo(() => data.filter(item => item.checked), [data]);

    const debouncedSearchTerm = useDebounce(search, 2000);

    useEffect(
        () => {
            if (!debouncedSearchTerm) {
                return setResults([]);
            }

            setIsSearching(true);
            searchByName(debouncedSearchTerm).then((result) => {
                setIsSearching(false);
                setResults(result);
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [debouncedSearchTerm]
    )

    const clearInput = () => {
        const arr = selectedItems.map(item => ({ ...item, checked: false }));
        handleChange(arr)
    };

    const onChange = (item: IData) => {
        const updatedItem = { ...item, checked: !item.checked }

        if (!modeOne) {
            return handleChange(updatedItem);
        }

        const uncheckedItems = selectedItems
            .filter(({ id }) => id !== item.id)
            .map(item => ({ ...item, checked: false }))
        return handleChange([updatedItem, ...uncheckedItems]);
    }

    const setInputFocus = () => {
        inputEl.current?.focus();
    };

    return (
        <div className="select-block">
            <div className="select-block__container">
                {isSearching && <div className="select-block__search_animation"></div>}
                <div className="select-block__box" onClick={setInputFocus}>
                    {selectedItems
                        .map((item) => (
                            <div className="select-block_checked" key={item.id}>
                                <span>{item.name}</span>
                                <span
                                    className="select-block__remove-button"
                                    onClick={() => onChange(item)}
                                > <CloseSvg /></span>
                            </div>
                        ))}
                    <input
                        className="select-block__input"
                        ref={inputEl}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={() => setShowList(true)}
                        onFocus={() => setShowList(true)}
                        onBlur={() => setTimeout(() => setShowList(false), 500)}
                    />
                    <span
                        className="select-block__arrow"
                        onClick={() => setShowList(!showList)}>
                        <DownArrowSvg />
                    </span>
                </div>
                <span className="select-block__remove-button" onClick={() => clearInput()}>
                    <CloseSvg />
                </span>
            </div>
            <div className={showList ? "select-block__dropdown select-block__dropdown_show" : "select-block__dropdown"}>
                {searchResult.length ? (
                    searchResult.map((item) => (
                        <div
                            className={item.checked ? 'select-block_checked' : ''}
                            key={item.id}
                            onFocus={() => setShowList(true)}
                            onClick={() => onChange(item)}
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
