import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import http from '../../../http';
import IPrato from '../../../interfaces/IPrato';
import { urlPratos } from '../../../urls';

const AdministracaoPratos = () => {
  const [pratos, setPratos] = useState<IPrato[]>([]);

  useEffect(() => {
    axios.get<IPrato[]>(urlPratos)
      .then(resposta => {
        setPratos(resposta.data);
      })
      .catch(erro => {
        console.log(erro);
      });
  }, []);

  const excluir = (pratoAhSerExcluido: IPrato) => {
    axios.delete(`${urlPratos}/id/${pratoAhSerExcluido.id}`)
      .then(() => {
        alert('Prato excluído com sucesso');
        const listaPrato = pratos.filter(prato => prato.id !== pratoAhSerExcluido.id);
        setPratos([...listaPrato]);
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
              Tag
            </TableCell>
            <TableCell>
             Imagem
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
          {pratos?.map(prato => (
            <TableRow key={prato.id}>
              <TableCell>
                {prato.nome}
              </TableCell>
              <TableCell>
                {prato.tag}
              </TableCell>
              <TableCell>
                [ <a href={prato.imagem} target='blank' rel='noreferrer'>ver imagem</a> ] 
              </TableCell>
              <TableCell>
                [ <Link to={`/admin/pratos/${prato.id}`}>editar</Link> ]
              </TableCell>
              <TableCell>
                <Button variant='outlined' color='error' onClick={() => excluir(prato)}>
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

export default AdministracaoPratos;