import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import http from '../../../http';
import IRestaurante from '../../../interfaces/IRestaurante';
import axios from 'axios';
import { urlRestaurantes } from '../../../urls';

const FormularioRestaurante = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [id, setId] = useState(0);
  const parametros = useParams();
  const useNav = useNavigate();

  useEffect(() => {
    if (parametros.id) {
      const url = `${urlRestaurantes}/search?id=${parametros.id}`;
      axios.get<IRestaurante[]>(url)
        .then(resposta => setNomeRestaurante(resposta.data[0].nome));
    }
    axios.get<IRestaurante[]>(urlRestaurantes)
      .then((resposta) => {
        const restaurantesIDs = resposta.data.map(restaurante => {
          return restaurante.id;
        });
        setId(Math.max(...restaurantesIDs));
      });
  }, [parametros]);

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (parametros.id) {
      axios.put(`${urlRestaurantes}/id/${parametros.id}`, {
        nome: nomeRestaurante
      })
        .then(() => {
          alert('Restaurante atualizado com sucesso');
          setNomeRestaurante('');
          useNav('/admin/restaurantes/novo/');
        });
    } else {
      axios.post(urlRestaurantes, [
        { nome: nomeRestaurante, id: id + 1 }
      ])
        .then(() => {
          alert('Restaurante cadastrado com sucesso');
          setNomeRestaurante('');
        });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexFlow: 1 }}>
        <Typography component='h1' variant='h6'>Formulário de Restaurantes</Typography>
        <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
          <TextField
            value={nomeRestaurante}
            onChange={evento => setNomeRestaurante(evento.target.value)}
            label='Nome do Restaurante'
            variant='standard'
            fullWidth
            required
          />
          <Button
            variant='outlined'
            type='submit'
            fullWidth
            sx={{ marginTop: 1 }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormularioRestaurante;