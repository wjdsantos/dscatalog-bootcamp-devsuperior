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
    
    const options = [
        { value: 'ASC', label: 'Mais Antigos' },
        { value: 'DESC', label: 'Mais Novos' },
        ]

    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    
    useEffect(() => {
        setIsLoadingCategories(true);
        makePrivateRequest({ url: '/categories'})
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
                key={`select-${category?.created}`}
                isLoading={isLoadingCategories} 
                value={options}
                options={options}
                getOptionLabel={option => option.label}
                getOptionValue={option => option.value}
                //getOptionLabel={(option: Category) => option.name}
                //getOptionValue={(option: Category) => String(option.id)}
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