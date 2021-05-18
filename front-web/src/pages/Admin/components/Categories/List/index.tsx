import React, { useCallback, useEffect, useState } from 'react';
import Pagination from 'core/components/Pagination';
import { CategoriesResponse } from 'core/types/Categories';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import CardLoader from '../Loaders/CategoryCardLoader';
import { toast } from 'react-toastify';

const List = () => {
    const [categoriesResponse, setCategoriesResponse] = useState<CategoriesResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();

    const getCategories = useCallback(() =>{
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction: 'DESC',
            orderBy: 'id'
        }

        // iniciar o loader
        setIsLoading(true);
        makeRequest({ url:'/categories', params})
            .then(response => setCategoriesResponse(response.data)) //Esse response.data é o axios que cria
            .finally(() => {
                // finalizar o loader
                setIsLoading(false);
            })
    }, [activePage]);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const handleCreate = () => {
        history.push('/admin/categories/create');
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
            <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                ADICIONAR
            </button>
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