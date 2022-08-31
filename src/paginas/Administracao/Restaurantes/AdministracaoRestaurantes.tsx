import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import http from '../../../http';
import IRestaurante from '../../../interfaces/IRestaurante';
import axios from 'axios';
import { urlRestaurantes } from '../../../urls';

const AdministracaoRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    axios.get<IRestaurante[]>(urlRestaurantes)
      .then(resposta => {
        setRestaurantes(resposta.data);
      })
      .catch(erro => {
        console.log(erro);
      });
  }, []);

  const excluir = (restauranteASerExcluido: IRestaurante) => {
    axios.delete(`${urlRestaurantes}/id/${restauranteASerExcluido.id}`)
      .then(() => {
        alert('Restaurante excluído com sucesso');
        const listaRestaurante = restaurantes.filter(restaurante => restaurante.id !== restauranteASerExcluido.id);
        setRestaurantes([...listaRestaurante]);
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Nome
            </TableCell>
            <TableCell>
              Editar
            </TableCell>
            <TableCell>
              Excluir
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes?.map(restaurante => (
            <TableRow key={restaurante.id}>
              <TableCell>
                {restaurante.nome}
              </TableCell>
              <TableCell>
                [ <Link to={`/admin/restaurantes/${restaurante.id}`}>editar</Link> ]
              </TableCell>
              <TableCell>
                <Button variant='outlined' color='error' onClick={() => excluir(restaurante)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdministracaoRestaurantes;