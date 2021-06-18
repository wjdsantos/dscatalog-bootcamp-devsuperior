import React, { useCallback, useEffect, useState } from 'react';
import Pagination from 'core/components/Pagination';
import { CategoriesResponse } from 'core/types/Categories';
import { makePrivateRequest } from 'core/utils/request';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import CardLoader from '../Loaders/CategoryCardLoader';
import { toast } from 'react-toastify';
import GeneralFilters from 'core/components/GeneralFilters';


//Criei essa props na tentativa de alterar os mesmo a partir do meu GeneralFilters
type Props = {
    direction?: String;
    orderby?: String;
}

const List = ({ direction, orderby }: Props) => {
    const [categoriesResponse, setCategoriesResponse] = useState<CategoriesResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [name, setName] = useState('');
    const [filter, setFilter] = useState('');
    const history = useHistory();

    const getCategories = useCallback(() =>{
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction: 'DESC', //{direction}
            orderBy: 'id', //{orderby}
            name
        }

        // iniciar o loader
        setIsLoading(true);
        makePrivateRequest({ url:'/categories', params})
            .then(response => setCategoriesResponse(response.data)) //Esse response.data é o axios que cria
            .finally(() => {
                // finalizar o loader
                setIsLoading(false);
            })
    }, [activePage, name]);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const handleCreate = () => {
        history.push('/admin/categories/create');
    }

    const handleChangeName = (name: string) => {
        setActivePage(0);
        setName(name);
    }

    const handleChangeCreated = (filter: string) => {
        setActivePage(0);
        setFilter(filter);
    }

    const clearFilters = () => {
        setActivePage(0);
        setFilter('');
        setName('');
    }

    const onRemove = (categoryId: number) => {
        const confirm = window.confirm('Deseja realmente excluir esta categoria?');

        if (confirm) {
            makePrivateRequest({ url: `/categories/${categoryId}`, method: 'DELETE' })
            .then(() => {
                toast.info('Categoria removida com sucesso!');
                getCategories();
            })
            .catch(() => {
                toast.error('Erro ao remover a categoria!');
            })
        }
    }

    return (
        <div className="admin-categories-list">
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                    ADICIONAR
                </button>
                <GeneralFilters
                    name={name}
                    filtro={filter}
                    handleChangeCreated={handleChangeCreated}
                    handleChangeName={handleChangeName}
                    clearFilters={clearFilters}
                />
            </div>
            <div className="admin-list-container">
                {isLoading ? <CardLoader /> : (
                    categoriesResponse?.content.map(category => (
                        <Card category={category} key={category.id} onRemove={onRemove} />
                    ))
                )}

                {categoriesResponse && (
                <Pagination 
                    totalPages={categoriesResponse.totalPages} 
                    activePage={activePage} 
                    onChange={page => setActivePage(page)}
                />
            )}
            </div>
        </div>
    );
}

export default List;