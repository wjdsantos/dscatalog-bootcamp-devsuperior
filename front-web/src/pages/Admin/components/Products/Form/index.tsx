import React, { useState } from 'react';
import { makePrivateRequest } from 'core/utils/request';
import BaseForm from '../../BaseForm';
import './styles.scss';

type FormState = {
    name: string;
    price: string;
    category: string;
    description: string;
}

type FormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
const Form = () => {
    const [formData, setFormData] = useState<FormState>({
        name: '',
        price: '',
        category: '',
        description: ''
    });

//    const [price, setPrice] = useState('');
//    const [category, setCategory] = useState('');

    const handdleOnChange = (event: FormEvent) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData(data => ({ ...data, [name]: value }));
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            ...formData,
            imgUrl: 'https://images1.kabum.com.br/produtos/fotos/128561/console-microsoft-xbox-series-s-500gb-branco-rrs-00006_1601067301_g.jpg',
            categories: [{id: formData.category }]
        }

        makePrivateRequest({ url: '/products', method: 'POST', data: payload})
            .then(() => {
                setFormData({ name: '', category: '', price: '', description: '' })
            })
    }
    return (
        <form onSubmit={handleSubmit}>
            <BaseForm title="cadastrar um produto">
                <div className="row">
                    <div className="col-6">
                        <input 
                            value={formData.name}
                            name="name"
                            type="text"
                            className="form-control mb-5" 
                            onChange={handdleOnChange}
                            placeholder="Nome do produto"
                        />
                        <select 
                            value={formData.category}
                            className="form-control mb-5"
                            onChange={handdleOnChange}
                            name="category"
                        >
                            <option value="1">Livros</option>
                            <option value="3">Computadores</option>
                            <option value="2">Eletrônicos</option>
                        </select>
                        <input 
                            value={formData.price}
                            name="price"
                            type="text"
                            className="form-control" 
                            onChange={handdleOnChange}
                            placeholder="Preço"
                        />
                    </div>
                    <div className="col6">
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handdleOnChange}
                            className="form-control"
                            cols={50} 
                            rows={10} 
                        />
                    </div>
                </div>
            </BaseForm>
        </form>
    )
}

export default Form;