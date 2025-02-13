const axios = require('axios');
const https = require('https');
const mongoose = require('mongoose');
const RelacionarVmUser = require('../models/RelacionarVmUser');
const ProxmoxClient = require('../utils/proxmoxClient');

const agent = new https.Agent({
    rejectUnauthorized: false
});

const vmController = {
    startVM: async (req, res) => {
        try {
            const userId = req.user?.id || req.body.userId;
            
            if (!userId) {
                return res.status(400).json({ error: "ID do usuário não fornecido" });
            }

            console.log('ID do usuário recebido:', userId);
            console.log('Tipo do ID do usuário:', typeof userId);
            
            // Buscar todos os registros para debug
            const todasVMs = await RelacionarVmUser.find({});
            console.log('Todas as VMs no banco:', JSON.stringify(todasVMs, null, 2));
            console.log('Total de VMs encontradas:', todasVMs.length);
            
            // Tentar buscar com diferentes formatos do ID
            console.log('Tentando buscar com o ID exato...');
            const vmDetails = await RelacionarVmUser.findOne({ id_usuario: userId });
            
            if (!vmDetails) {
                console.log('Tentando buscar sem case sensitive...');
                const vmDetailsInsensitive = await RelacionarVmUser.findOne({
                    id_usuario: { $regex: new RegExp('^' + userId + '$', 'i') }
                });
                
                if (!vmDetailsInsensitive) {
                    console.log('VMs disponíveis com seus IDs:');
                    todasVMs.forEach(vm => {
                        console.log(`VM ID: ${vm.id_usuario}, tipo: ${typeof vm.id_usuario}`);
                        console.log('Comparação:', vm.id_usuario === userId);
                    });
                    
                    return res.status(404).json({ 
                        error: "Detalhes da VM não encontrados para este usuário.",
                        debug: {
                            userId,
                            availableIds: todasVMs.map(vm => vm.id_usuario)
                        }
                    });
                }
                
                vmDetails = vmDetailsInsensitive;
            }

            // Configurar cliente Proxmox
            const proxmox = new ProxmoxClient({
                host: new URL(vmDetails.proxmox_api).hostname,
                port: new URL(vmDetails.proxmox_api).port || '8002',
                user: vmDetails.proxmox_user,
                password: vmDetails.proxmox_password
            });

            // Iniciar a VM
            await proxmox.post(`/nodes/${vmDetails.proxmox_node}/qemu/${vmDetails.proxmox_vm_id}/status/start`);
            
            res.json({ success: true, message: "Máquina virtual ativada com sucesso" });
        } catch (error) {
            console.error('Erro completo:', error);
            res.status(500).json({ error: "Erro ao ativar a máquina virtual" });
        }
    }
};

module.exports = vmController;