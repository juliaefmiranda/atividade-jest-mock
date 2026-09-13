import axios from 'axios';

export const BASE_URL = 'https://api.frankfurter.app';

export async function buscarCotacao(base, destino) {        //base: moeda que temos //destino: moeda que queremos descobrir o valor
    const { data } = await axios.get(
        `${BASE_URL}/latest?from=${base}&to=${destino}`
    );

    if (!data || !data.rates || !data.rates[destino]) {
        throw new Error('Cotação indisponível');
    }

    return data.rates[destino];
}