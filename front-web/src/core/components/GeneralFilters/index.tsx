import React, { useEffect, useState } from 'react';
import { ReactComponent as SearchIcon } from 'core/assets/images/search-icon.svg';
import Select from 'react-select';
import { makePrivateRequest } from 'core/utils/request';
import { Category } from 'core/types/Categories';
import './styles.scss';

type Props = {
    name?: string;
    handleChangeName: (name: string) => void;
    handleChangeCreated: (direction: string) => void;
    clearFilters: () => void;
    category?: Category;
    filtro?: string;
}

const GeneralFilters = ({name, 
    handleChangeName,
    handleChangeCreated,
    clearFilters,
    category
    }: Props) => {
    
    const params = {
        linesPerPage: 4,
        direction: 'DESC', //{direction}
        orderBy: 'id', //{orderby}
        name
    }

    const options = [
        { value: 'ASC', label: 'Mais Antigos', id: 1 },
        { value: 'DESC', label: 'Mais Novos', id: 2 }
        ]

    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    
    useEffect(() => {
        setIsLoadingCategories(true);
        makePrivateRequest({ url: '/categories', params})
            .then(response => setCategories(response.data.content))
            .finally(() => setIsLoadingCategories(false))
    }, []);

    return (
        <div className="card-base category-filters-container">
            <div className="input-search-category">
                <input 
                  type="text"
                  value={name}
                  className="form-control"
                  placeholder="Pesquisar nome"
                  onChange={event => handleChangeName(event.target.value)}
                />
                <SearchIcon />
            </div>
            <Select
                name="filtro"
                key={`select-${options?.values}`}
                isLoading={isLoadingCategories} 
                value={options}
                options={options}
                getOptionLabel={option => option.label}
                getOptionValue={option => option.value}
                className="filter-select-container-category"
                classNamePrefix="category-select"
                placeholder="Mais Antigo/Novo"
                inputId="categories"
                onChange={value => handleChangeCreated}
                isClearable
            />
            <button
                className="btn btn-outline-secondary border-radius-10"
                onClick={clearFilters}
            >
                LIMPAR FILTRO
            </button>
        </div>
    )
}

export default GeneralFilters;