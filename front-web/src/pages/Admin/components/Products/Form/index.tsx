import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useHistory, useParams } from 'react-router';
import BaseForm from '../../BaseForm';
import { Category } from 'core/types/Product';
import './styles.scss';
import PriceField from './PriceField';

export type FormState = {
    name: string;
    price: string;
    description: string;
    imgUrl: string;
    categories: Category[];
}

type ParamsType = {
    productId: string;
}

const Form = () => {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<FormState>();
    const history = useHistory();
    const { productId } = useParams<ParamsType>();
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const isEditing = productId !== 'create';
    const formTitle = isEditing ? 'Editar produto' : 'cadastrar um produto';


    useEffect(() => {
        if (isEditing) {  //Reconhecendo que estou editando
            makeRequest({ url: `/products/${productId}` })
            .then(response => {
                setValue('name', response.data.name);
                setValue('price', response.data.price);
                setValue('description', response.data.description);
                setValue('imgUrl', response.data.imgUrl);
            })
        }
    }, [productId, isEditing, setValue]);

    useEffect(() => {
        setIsLoadingCategories(true);
        makeRequest({ url: '/categories'})
            .then(response => setCategories(response.data.content))
            .finally(() => setIsLoadingCategories(false))
    }, []);

    const onSubmit = (data: FormState) => {
        console.log(data)
        /* makePrivateRequest({ 
            url: isEditing ? `/products/${productId}` : '/products', 
            method: isEditing ? 'PUT' : 'POST',
            data 
        })
            .then(() => {
                toast.info('Produto salvo com sucesso!');
                history.push('/admin/products');
            })
            .catch(() => {
                toast.error('Erro ao salvar produto!');
            }) */
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseForm 
                title={formTitle}
            >
                <div className="row">
                    <div className="col-6">
                        <div className="margin-bottom-30">
                            <input 
                                {...register('name', {
                                    required: "Campo obrigatório",
                                    minLength: {
                                        value: 5,
                                        message: "O campo deve ter ao menos 5 caracteres"
                                        },
                                    maxLength: {
                                        value: 60,
                                        message: "O campo deve ter no maximo 60 caracteres"
                                        }    
                                    })
                                }
                                type="text"
                                className="form-control input-base" 
                                placeholder="Nome do produto"
                            />
                            {errors.name && (
                                <div className="invalid-feedback d-block">
                                  {errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="margin-bottom-30">
                            <Controller
                                //as={Select}
                                render={({ field }) => <Select
                                    {...field}
                                    options={categories} 
                                />}
                                name="categories"
                                rules={{ required: "Campo obrigatório" }}
                                control={control}
                                getOptionLabel={(option: Category) => option.name}
                                getOptionValue={(option: Category) => String(option.id)}
                                classNamePrefix="categories-select"
                                placeholder="Categorias"
                                isMulti
                            />
                        </div>
                        <div className="margin-bottom-30">
                            <PriceField control={control} />
                            {errors.price && (
                                <div className="invalid-feedback d-block">
                                  {errors.price.message}
                                </div>
                            )}
                        </div>
                        <div className="margin-bottom-30">
                            <input 
                                {...register('imgUrl', { required: "Campo obrigatório" })}
                                type="text"
                                className="form-control input-base" 
                                placeholder="Imagem do produto"
                            />
                            {errors.imgUrl && (
                                <div className="invalid-feedback d-block">
                                  {errors.imgUrl.message}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col6">
                        <textarea 
                            {...register('description', { required: "Campo obrigatório" })}
                            className="form-control input-base"
                            placeholder="Descrição"
                            cols={40} 
                            rows={10} 
                        />
                        {errors.description && (
                            <div className="invalid-feedback d-block">
                                {errors.description.message}
                            </div>
                        )}
                    </div>
                </div>
            </BaseForm>
        </form>
    )
}

export default Form;