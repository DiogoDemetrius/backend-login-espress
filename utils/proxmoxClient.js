const axios = require('axios');
const https = require('https');

class ProxmoxClient {
    constructor(config) {
        this.config = config;
        this.token = null;
        this.csrfToken = null;
        
        this.axiosInstance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            baseURL: `https://${config.host}:${config.port}/api2/json`
        });
    }

    async authenticate() {
        try {
            const response = await this.axiosInstance.post('/access/ticket', {
                username: this.config.user,
                password: this.config.password
            });

            const { ticket, CSRFPreventionToken } = response.data.data;
            this.token = ticket;
            this.csrfToken = CSRFPreventionToken;
        } catch (error) {
            console.error('Erro na autenticação Proxmox:', error);
            throw error;
        }
    }

    async post(endpoint, data = {}) {
        if (!this.token) {
            await this.authenticate();
        }

        try {
            const response = await this.axiosInstance.post(endpoint, data, {
                headers: {
                    'Cookie': `PVEAuthCookie=${this.token}`,
                    'CSRFPreventionToken': this.csrfToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro na requisição Proxmox:', error);
            throw error;
        }
    }
}

module.exports = ProxmoxClient; 