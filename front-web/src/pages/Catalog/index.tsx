import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductsResponse } from '../../core/types/Product';
import { makeRequest } from '../../core/utils/request';
import ProductCard from './components/ProductCard';
import './styles.scss';

const Catalog = () => {
    //Quando a lista de produtos estiver disponível, popular um estado no componente,
    //e listar os produtos dinâmicamente
    const [productsResponse, setProductsResponse] = useState<ProductsResponse>();

    console.log(productsResponse);

    //quando o componente iniciar, buscar a lista de produtos
    useEffect(() => {
        //limitações do fetch:
        //muito verboso
        //não tem suporte nativo p/ ler o progresso de upload de arquivos (aquela barra de progresso)
        //não tem suporte nativo p/ enviar 'query strings' que são aqueles parâmetros na url
        //fetch('http://localhost:3000/products') - substituindo fetch por axios
        //  .then(response => response.json())
        //  .then(response => console.log(response));
        const params = {
            page: 0,
            linesPerPage: 8
        }
        makeRequest({ url:'/products', params})
            .then(response => setProductsResponse(response.data)); //Esse response.data é o axios que cria
    }, []);

    return (
        <div className="catalog-container">
            <h1 className="catalog-title">
                Catálogo de produtos
            </h1>
            <div className="catalog-products">
                {productsResponse?.content.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id}>
                        <ProductCard product={product}/>
                    </Link>
                ))}

            </div>
        </div>
    );
}

export default Catalog;