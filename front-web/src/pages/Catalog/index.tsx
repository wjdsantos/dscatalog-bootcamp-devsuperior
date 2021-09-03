import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, ProductsResponse } from 'core/types/Product';
import Pagination from 'core/components/Pagination';
import { makeRequest } from 'core/utils/request';
import ProductFilters from 'core/components/ProductFilters';
import ProductCard from './components/ProductCard';
import ProductCardLoader from './components/Loaders/ProductCardLoader';
import './styles.scss';

const Catalog = () => {
    //Quando a lista de produtos estiver disponível, popular um estado no componente,
    //e listar os produtos dinâmicamente
    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category>();

    const getProducts = useCallback(() => {
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
    }, [activePage, name, category])

    //console.log(productsResponse);

    //quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {
        getProducts();
    }, [getProducts]);

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

    return (
        <div className="catalog-container">
            <div className="filter-container">
                <h1 className="catalog-title">
                    Catálogo de produtos
                </h1>
                <ProductFilters
                    name={name}
                    category={category}
                    handleChangeCategory={handleChangeCategory}
                    handleChangeName={handleChangeName}
                    clearFilters={clearFilters}
                />
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