import { afterEach, expect, jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({
    default: { get: jest.fn() },
}));

const axios = (await import('axios')).default;
const { buscarCotacao, BASE_URL } = await import('../src/conversao.js');


describe('Conversor de Moedas - Mock de Módulo', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Deve retornar a cotação quando a API responder corretamente', async () => {
        axios.get.mockResolvedValue({
            data: { amount: 1, base: 'EUR', rates: { BRL: 7.903 } },
        });

        await expect(buscarCotacao('EUR', 'BRL')).resolves.toBe(7.903);
    });

    it('Deve realizar a consulta usando o endereço correto da API', async () => {
        axios.get.mockResolvedValue({
            data: { rates: { BRL: 7.903 } },
        });

        await buscarCotacao('EUR', 'BRL');

        expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/latest?from=EUR&to=BRL`);
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('Deve rejeitar quando ocorrer erro de conexão', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        await expect(
            buscarCotacao('EUR', 'BRL'))
            .rejects.toThrow('Network error');
    });

    it('Deve retornar erro quando a API não fornecer a cotação', async () => {
        axios.get.mockResolvedValue({
            data: { rates: {} },
        });

        await expect(
            buscarCotacao('EUR', 'BRL')
        ).rejects.toThrow('Cotação indisponível');
    });
});

//Usamos o mock para que o teste não dependa da internet.

/* Se o Axios não está fazendo uma requisição real, de onde vem o JSON utilizado pelo teste?
 
Resposta: O JSON vem do próprio teste através do mockResolvedValue(), que simula a resposta que a API real retornaria. */