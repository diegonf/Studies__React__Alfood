import { Box, Button, FormControl, TextField, Typography, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import http from '../../../http';
import IPrato from '../../../interfaces/IPrato';
import IRestaurante from '../../../interfaces/IRestaurante';
import ITag from '../../../interfaces/ITag';
import { urlPratos, urlRestaurantes } from '../../../urls';

const FormularioPrato = () => {
  const [nomePrato, setNomePrato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tag, setTag] = useState('');
  const [restaurante, setRestaurante] = useState('');
  const [imagem, setImagem] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [id, setId] = useState(0);
  const parametros = useParams();
  const useNav = useNavigate();

  useEffect(() => {
    const url = `${urlPratos}?sheet=tags`;
    axios.get<ITag[]>(url)
      .then(resposta => {
        setTags(resposta.data);
      });
    axios.get<IRestaurante[]>(`${urlRestaurantes}`)
      .then(resposta => {
        setRestaurantes(resposta.data);
      });
    axios.get<IPrato[]>(urlPratos)
      .then((resposta) => {
        const pratosIDs = resposta.data.map(prato => {
          return prato.id;
        });
        setId(Math.max(...pratosIDs));
      });
  }, []);

  useEffect(() => {
    if (parametros.id) {
      const url = `${urlPratos}/search?id=${parametros.id}`;
      axios.get<IPrato[]>(url)
        .then(resposta => {
          setNomePrato(resposta.data[0].nome);
          setDescricao(resposta.data[0].descricao);
          setTag(resposta.data[0].tag);
          setImagem(resposta.data[0].imagem);
          setRestaurante(resposta.data[0].restaurante.toString());
        });
    }
  }, [parametros, restaurantes]);

  // const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
  //   if (evento.target.files?.length) {
  //     setImagem(evento.target.files[0]);
  //   } else {
  //     setImagem(null);
  //   }
  // };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (parametros.id) {
      axios.put(`${urlPratos}/id/${parametros.id}`, {
        nome: nomePrato,
        tag: tag,
        imagem: imagem,
        descricao: descricao,
        restaurante: restaurante
      })
        .then(() => {
          alert('Prato atualizado com sucesso');
          setNomePrato('');
          setDescricao('');
          setTag('');
          setRestaurante('');
          setImagem('');
          useNav('/admin/pratos/novo/');
        })
        .catch(erro => console.log(erro));

    }
    else {
      axios.post(urlPratos, [{
        id: id + 1,
        nome: nomePrato,
        tag: tag,
        imagem: imagem,
        descricao: descricao,
        restaurante: restaurante
      }])
        .then(() => {
          alert('Prato cadastrado com sucesso');
          setNomePrato('');
          setDescricao('');
          setTag('');
          setRestaurante('');
          setImagem('');
        })
        .catch(erro => console.log(erro));
    }
    // const formData = new FormData();

    // formData.append('nome', nomePrato);
    // formData.append('descricao', descricao);
    // formData.append('tag', tag);
    // formData.append('restaurante', restaurante);
    // formData.append('imagem', imagem);

    // http.request({
    //   url: 'pratos/',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   data: formData
    // })
    //   .then(() => {
    //     alert('Prato cadastrado com sucesso');
    //     setNomePrato('');
    //     setDescricao('');
    //     setTag('');
    //     setRestaurante('');
    //   })
    //   .catch(erro => console.log(erro));

  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexFlow: 1 }}>
        <Typography component='h1' variant='h6'>Formulário de Pratos</Typography>
        <Box component='form' sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
          <TextField
            value={nomePrato}
            onChange={evento => setNomePrato(evento.target.value)}
            label='Nome do Prato'
            variant='standard'
            fullWidth
            required
            margin='dense'
          />
          <TextField
            value={descricao}
            onChange={evento => setDescricao(evento.target.value)}
            label='Descrição do Prato'
            variant='standard'
            fullWidth
            required
            margin='dense'
          />
          <TextField
            value={imagem}
            onChange={evento => setImagem(evento.target.value)}
            label='Link da Imagem'
            variant='standard'
            fullWidth
            required
            margin='dense'
          />

          <FormControl margin='dense' fullWidth>
            <InputLabel id='select-tag'>Tag</InputLabel>
            <Select labelId='select-tag' value={tag} onChange={evento => setTag(evento.target.value)}>
              {tags.map(tag =>
                <MenuItem key={tag.id} value={tag.value}>
                  {tag.value}
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl margin='dense' fullWidth>
            <InputLabel id='select-restaurante'>Restaurante</InputLabel>
            <Select labelId='select-restaurante' value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
              {restaurantes.map(restaurante =>
                <MenuItem key={restaurante.id} value={restaurante.id}>
                  {restaurante.nome}
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {/* <input type="file" onChange={selecionarArquivo} /> */}

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

export default FormularioPrato;