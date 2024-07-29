import { useEffect, useRef, useState } from "react"

export default function SearchBar({ placeholder }) {
    const [keyword, setKeyWord] = useState("");
    const searchBarRef = useRef();

    useEffect(() => {
        const handleSearch = (event) => {
            if (event.key === "Enter") {
                if (keyword === "")
                    return;

                window.location.href = `./search?q=` + keyword
            }
        }

        const element = searchBarRef.current;

        element.addEventListener("keydown", handleSearch)

        return () => {
            element.removeEventListener('keydown', handleSearch);
        }
    }, [keyword])

    return (
        <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass" />
            <input ref={searchBarRef} type="text" name="" id="" placeholder={placeholder} value={keyword} onChange={(e) => { setKeyWord(e.target.value) }} />
        </div>
    )
}