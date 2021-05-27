import React, { useEffect, useState, useCallback } from 'react';
import Pagination from 'core/components/Pagination';
import { UsersResponse } from 'core/types/Users';
import { makePrivateRequest } from 'core/utils/request';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Card from '../Card';
import CardLoader from '../Loaders/UserCardLoader';

const List = () => {
    const [usersResponse, setUsersResponse] = useState<UsersResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const history = useHistory();

    const getUsers = useCallback(() =>{
        const params = {
            page: activePage,
            linesPerPage: 4,
            direction: 'DESC',
            orderBy: 'id'
        }

        // iniciar o loader
        setIsLoading(true);
        makePrivateRequest({ url:'/users', params})
            .then(response => setUsersResponse(response.data)) //Esse response.data é o axios que cria
            .finally(() => {
                // finalizar o loader
                setIsLoading(false);
            })
    }, [activePage]);

    console.log(usersResponse);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleCreate = () => {
        history.push('/admin/users/create');
    }
    
    const onRemove = (userId: number) => {
        const confirm = window.confirm('Deseja realmente excluir este usuário?');

        if (confirm) {
            makePrivateRequest({ url: `/users/${userId}`, method: 'DELETE' })
            .then(() => {
                toast.info('Usuário removido com sucesso!');
                getUsers();
            })
            .catch(() => {
                toast.error('Erro ao remover usuário!');
            })
        }
    }

    return (
        <div className="admin-users-list">
            <button className="btn btn-primary btn-lg" onClick={handleCreate}>
                ADICIONAR
            </button>
            <div className="admin-list-container">
                {isLoading ? <CardLoader /> : (
                    usersResponse?.content.map(user => (
                        <Card user={user} key={user.id} onRemove={onRemove} />
                    ))
                )}

                {usersResponse && (
                <Pagination 
                    totalPages={usersResponse.totalPages} 
                    activePage={activePage} 
                    onChange={page => setActivePage(page)}
                />
            )}
            </div>
        </div>
    )
}

export default List;