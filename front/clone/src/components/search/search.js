import React from 'react';

const Input = styled.input`
    width: 100% !important;
    border-bottom: 1px solid #a5a5a5!important;   
    box-shadow: none !important;
    border-radius: 3px;
    margin-top: 5px !important;
    text-indent: 5px;
    font-size: 20px !important;
    transition: 0.3s !important;
    word-wrap: break-word;
    opacity: 0.7;
    &:focus{    
        opacity: 1;
    }
`
const Btn = styled.button`
    margin: 20px;
    width: 25%;
    font-weight: 600;
    color: #585858;
    transition: 0.3s;
    text-transform: capitalize;
    box-shadow: none !important;
    &:hover{
        color: black;
    }
    &:focus{
        color: black;
    }
`
const Search = () => {
    return (
        <div>
            <div className="modal-content" style={{ color: 'black' }}>
                <Input
                    type="text"
                    className="form"
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {searchResult.length
                    ? <div className="collection" style={{ border: 'none' }}>
                        {renderSearchResult()}
                    </div>

                    : <ProgressBar />
                }
            </div>

            <div className="modal-footer">
                <Btn
                    className="modal-close btn waves-effect waves-light #ffffff white"
                    type="button"
                    tyle={{ textTransform: 'capitalize', fontWeight: '500' }}
                    onClick={() => closeModal()}
                >
                    Cancle
                        </Btn>
            </div>
        </div>
    );
}

export default Search;
