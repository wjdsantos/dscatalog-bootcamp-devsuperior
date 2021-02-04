import React, { useState } from 'react';
import BaseForm from '../../BaseForm';
import './styles.scss';

const Form = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handdleOnChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
       setName(event.target.value);
    }

    const handdleOnChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
     }

     const handdleOnChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
     }

    return (
        <BaseForm title="cadastrar um produto">
            <h1 className="my-5">
               Nome: {name} <br />
               preço: {price} <br />
               Categoria: {category}
            </h1>
            <div className="row">
                <div className="col-6">
                    <input 
                        value={name}
                        type="text"
                        className="form-control mb-5" 
                        onChange={handdleOnChangeName}
                        placeholder="Nome do produto"
                    />
                    <select value={category} className="form-control mb-5" onChange={handdleOnChangeCategory}>
                        <option value="livros">Livros</option>
                        <option value="computadores">Computadores</option>
                        <option value="eletronicos">Eletrônicos</option>
                    </select>
                     <input 
                        value={price}
                        type="text"
                        className="form-control" 
                        onChange={handdleOnChangePrice}
                        placeholder="Preço"
                    />
                </div>
            </div>
        </BaseForm>
    )
}

export default Form;