const mongoose = require('mongoose');

const relacionarVmUserSchema = new mongoose.Schema({
    id_usuario: { type: String, required: true },
    id_vm: { type: String, required: true },
    proxmox_api: { type: String, required: true },
    proxmox_user: { type: String, required: true },
    proxmox_password: { type: String, required: true },
    proxmox_node: { type: String, required: true },
    proxmox_vm_id: { type: Number, required: true },
    plano: { type: String, required: true },
    dt_inicio_plano: { type: String, required: true }
}, {
    collection: 'relacionarVmUser'
});

module.exports = mongoose.model('RelacionarVmUser', relacionarVmUserSchema);