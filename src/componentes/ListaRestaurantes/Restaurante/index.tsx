import axios from 'axios';
import { useEffect, useState } from 'react';
import IRestaurante from '../../../interfaces/IRestaurante';
import Prato from '../Prato';
import estilos from './Restaurante.module.scss';
import IPrato from '../../../interfaces/IPrato';
import { urlPratos } from '../../../urls';

interface RestauranteProps {
  restaurante: IRestaurante
}

const Restaurante = ({ restaurante }: RestauranteProps) => {
  const [pratos, setPratos] = useState<IPrato[]>([]);

  useEffect(() => {
    //get Pratos
    axios.get<IPrato[]>(urlPratos)
      .then(resposta => {
        const pratos = resposta.data;
        const pratosRestaurante = pratos.filter((prato) => {
          return prato.restaurante === restaurante.id;
        });
        setPratos(pratosRestaurante);
      })
      .catch(erro => {
        console.log(erro);
      });
    
  },[]);

  return (<section className={estilos.Restaurante}>
    <div className={estilos.Titulo}>
      <h2>{restaurante.nome}</h2>
    </div>
    <div>
      {pratos?.map(item => <Prato prato={item} key={item.id} />)}
    </div>
  </section>);
};

export default Restaurante;