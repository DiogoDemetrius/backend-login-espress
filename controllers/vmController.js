const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

exports.startVM = async (req, res) => {
    const { PROXMOX_API, USERNAME, PASSWORD, NODE, VMID } = req.body;

    if (!PROXMOX_API || !USERNAME || !PASSWORD || !NODE || !VMID) {
        return res.status(400).json({ error: 'Todos os parâmetros são obrigatórios.' });
    }

    try {
        console.log('Iniciando autenticação...');
        const authResponse = await axios.post(
            `${PROXMOX_API}/access/ticket`,
            {
                username: USERNAME,
                password: PASSWORD,
            },
            { httpsAgent: agent }
        );

        const { data } = authResponse.data;
        const { ticket, CSRFPreventionToken } = data;

        console.log('Autenticado com sucesso!');

        console.log('Enviando solicitação para iniciar a VM...');
        const startResponse = await axios.post(
            `${PROXMOX_API}/nodes/${NODE}/qemu/${VMID}/status/start`,
            {},
            {
                headers: {
                    Cookie: `PVEAuthCookie=${ticket}`,
                    CSRFPreventionToken: CSRFPreventionToken,
                },
                httpsAgent: agent,
            }
        );

        console.log('Resposta ao iniciar a VM:', startResponse.data);
        res.json({ message: 'VM iniciada com sucesso.', details: startResponse.data });
    } catch (error) {
        console.error('Erro ao interagir com a API do Proxmox:', error.message);
        res.status(500).json({
            error: 'Erro ao interagir com a API do Proxmox.',
            details: error.response?.data || error.message,
        });
    }
};