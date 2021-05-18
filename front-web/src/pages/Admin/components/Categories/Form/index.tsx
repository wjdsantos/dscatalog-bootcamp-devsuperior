import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { makePrivateRequest, makeRequest } from 'core/utils/request';
import { useHistory, useParams } from 'react-router-dom';
import BaseForm from '../../BaseForm';

type ParamsType = {
    categoryId: string;
}

type FormState = {
    name: string;
}

const Form = () => {
    const { register, handleSubmit, errors, setValue } = useForm<FormState>(); 
    const history = useHistory();

    const { categoryId } = useParams<ParamsType>();

    const isEditing = categoryId !== 'create';
    const formTitle = isEditing ? 'Editar categoria' : 'cadastrar uma categoria';

    useEffect(() => {
        if (isEditing) {  //Reconhecendo que estou editando
            makeRequest({ url: `/categories/${categoryId}` })
            .then(response => {
                setValue('name', response.data.name);
            })
        }
    }, [categoryId, isEditing, setValue]);

    const onSubmit = (data: FormState) => {
        makePrivateRequest({ 
            url: isEditing ? `/categories/${categoryId}` : '/categories', 
            method: isEditing ? 'PUT' : 'POST', 
            data 
        })
            .then(() => {
                toast.info('Categoria salva com sucesso!');
                history.push('/admin/categories');
            })
            .catch(() => {
                toast.error('Erro ao salvar categoria!');
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseForm 
                title={formTitle}
            >
                <div className="row">
                    <div className="col-6 category-input">
                        <input
                            ref={register({ required: "Campo obrigatório" })}
                            name="name"
                            type="text" 
                            className="form-control input-base"
                            placeholder="Nome da categoria"
                        />
                        {errors.name && (
                            <div className="invalid-feedback d-block">
                                {errors.name.message}
                            </div>
                        )}
                    </div>
                </div>
            </BaseForm>
        </form>
    );
}

export default Form;