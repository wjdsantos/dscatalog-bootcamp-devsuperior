import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductsResponse } from 'core/types/Product';
import Pagination from 'core/components/Pagination';
import { makeRequest } from 'core/utils/request';
import ProductFilters, { FilterForm } from 'core/components/ProductFilters';
import ProductCard from './components/ProductCard';
import ProductCardLoader from './components/Loaders/ProductCardLoader';
import './styles.scss';

const Catalog = () => {
    //Quando a lista de produtos estiver disponível, popular um estado no componente,
    //e listar os produtos dinâmicamente
    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);

    const getProducts = useCallback((filter?: FilterForm) => {
        //limitações do fetch:
        //muito verboso
        //não tem suporte nativo p/ ler o progresso de upload de arquivos (aquela barra de progresso)
        //não tem suporte nativo p/ enviar 'query strings' que são aqueles parâmetros na url
        //fetch('http://localhost:3000/products') - substituindo fetch por axios
        //  .then(response => response.json())
        //  .then(response => console.log(response));
        const params = {
            page: activePage,
            linesPerPage: 8,
            name: filter?.name,
            categoryId: filter?.categoryId
        }

        // iniciar o loader
        setIsLoading(true);
        makeRequest({ url:'/products', params})
            .then(response => setProductsResponse(response.data)) //Esse response.data é o axios que cria
            .finally(() => {
                // finalizar o loader
                setIsLoading(false);
            })
    }, [activePage])

    //console.log(productsResponse);

    //quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (
        <div className="catalog-container">
            <div className="d-flex justify-content-between">
                <h1 className="catalog-title">
                    Catálogo de produtos
                </h1>
                <ProductFilters onSearch={filter => getProducts(filter)} />
            </div>
            <div className="catalog-products">
                {isLoading ? <ProductCardLoader /> : (  //Operador ternário
                    productsResponse?.content.map(product => (
                        <Link to={`/products/${product.id}`} key={product.id}>
                            <ProductCard product={product}/>
                        </Link>
                    ))
                )}
            </div>
            {productsResponse && (
                <Pagination 
                    totalPages={productsResponse.totalPages} 
                    activePage={activePage} 
                    onChange={page => setActivePage(page)}
                />
            )}
        </div>
    );
}

export default Catalog;