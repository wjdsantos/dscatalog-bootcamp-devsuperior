import React, { useEffect, useState, useCallback } from 'react';
import Pagination from 'core/components/Pagination';
import { Category, ProductsResponse } from 'core/types/Product';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import CardLoader from '../Loaders/ProductCardLoader';
import ProductFilters from 'core/components/ProductFilters';

const List = () => {
    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>();

    const getProducts = useCallback(() =>{
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction: 'DESC',
            orderBy: 'id',
            name,
            categoryId: category?.id
        }

        // iniciar o loader
        setIsLoading(true);
        makeRequest({ url:'/products', params})
            .then(response => setProductsResponse(response.data)) //Esse response.data é o axios que cria
            .finally(() => {
                // finalizar o loader
                setIsLoading(false);
            })
    }, [activePage, name, category]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const handleCreate = () => {
        history.push('/admin/products/create');
    }
    
    const handleChangeName = (name: string) => {
        setActivePage(0);
        setName(name);
    }

    const handleChangeCategory = (category: Category) => {
        setActivePage(0);
        setCategory(category);
    }

    const clearFilters = () => {
        setActivePage(0);
        setCategory(undefined);
        setName('');
    }

    const onRemove = (productId: number) => {
        const confirm = window.confirm('Deseja realmente excluir este produto?');

        if (confirm) {
            makePrivateRequest({ url: `/products/${productId}`, method: 'DELETE' })
            .then(() => {
                toast.info('Produto removido com sucesso!');
                getProducts();
            })
            .catch(() => {
                toast.error('Erro ao remover produto!');
            })
        }
    }

    return (
        <div className="admin-products-list">
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                    ADICIONAR
                </button>
                <ProductFilters
                    name={name}
                    category={category}
                    handleChangeCategory={handleChangeCategory}
                    handleChangeName={handleChangeName}
                    clearFilters={clearFilters}
                />
            </div>
            
            <div className="admin-list-container">
                {isLoading ? <CardLoader /> : (
                    productsResponse?.content.map(product => (
                        <Card product={product} key={product.id} onRemove={onRemove} />
                    ))
                )}

                {productsResponse && (
                <Pagination 
                    totalPages={productsResponse.totalPages} 
                    activePage={activePage} 
                    onChange={page => setActivePage(page)}
                />
            )}
            </div>
        </div>
    )
}

export default List;