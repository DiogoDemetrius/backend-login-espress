# Documentação da API

## Índice
1. [Informações Gerais](#informações-gerais)
2. [Autenticação](#autenticação)
3. [Endpoints de Usuário](#endpoints-de-usuário)
4. [Endpoints de VM](#endpoints-de-vm)
5. [Códigos de Erro](#códigos-de-erro)
6. [Modelos de Dados](#modelos-de-dados)

## Informações Gerais

### Base URL
```
https://seu-dominio.com/api
```

### Headers Padrão
```http
Content-Type: application/json
Authorization: Bearer <seu_token_jwt>
```

### Formato de Respostas
Todas as respostas seguem o formato:
```json
{
  "success": boolean,
  "data": object | array | null,
  "error": string | null,
  "message": string | null
}
```

## Autenticação

### Registrar Usuário
```http
POST /auth/register
```

**Corpo da Requisição:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "createdAt": "date"
    },
    "token": "string"
  }
}
```

**Códigos de Resposta:**
- `201`: Usuário criado com sucesso
- `400`: Dados inválidos
- `409`: Email já cadastrado

### Login
```http
POST /auth/login
```

**Corpo da Requisição:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "lastLogin": "date"
    },
    "token": "string"
  }
}
```

**Códigos de Resposta:**
- `200`: Login bem-sucedido
- `401`: Credenciais inválidas

### Recuperação de Senha
```http
POST /auth/forgot-password
```

**Corpo da Requisição:**
```json
{
  "email": "string"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Email de recuperação enviado"
}
```

**Códigos de Resposta:**
- `200`: Email enviado com sucesso
- `404`: Usuário não encontrado

### Reset de Senha
```http
POST /auth/reset-password
```

**Corpo da Requisição:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Códigos de Resposta:**
- `200`: Senha alterada com sucesso
- `400`: Token inválido ou expirado

### Deletar Usuário
```http
DELETE /auth/delete-user/:userId
```

**Parâmetros de URL:**
- `userId`: ID do usuário a ser deletado

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso"
}
```

**Códigos de Resposta:**
- `200`: Usuário deletado com sucesso
- `404`: Usuário não encontrado
- `403`: Sem permissão para deletar

## Endpoints de VM

### Iniciar VM
```http
POST /vm/start-vm
```

**Corpo da Requisição:**
```json
{
  "userId": "string"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Máquina virtual iniciada com sucesso",
  "data": {
    "vmId": "number",
    "status": "string",
    "startTime": "date"
  }
}
```

**Códigos de Resposta:**
- `200`: VM iniciada com sucesso
- `400`: Dados inválidos
- `404`: VM não encontrada
- `500`: Erro ao iniciar VM

### Parar VM
```http
POST /vm/stop-vm
```

**Corpo da Requisição:**
```json
{
  "userId": "string",
  "vmId": "number"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Máquina virtual parada com sucesso"
}
```

### Status da VM
```http
GET /vm/status/:vmId
```

**Parâmetros de URL:**
- `vmId`: ID da máquina virtual

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "vmId": "number",
    "status": "string",
    "uptime": "number",
    "cpu": "number",
    "memory": {
      "total": "number",
      "used": "number"
    },
    "disk": {
      "total": "number",
      "used": "number"
    }
  }
}
```

### Listar VMs do Usuário
```http
GET /vm/list
```

**Parâmetros de Query:**
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `status` (opcional): Filtrar por status

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "vms": [
      {
        "vmId": "number",
        "node": "string",
        "status": "string",
        "name": "string",
        "uptime": "number"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "pages": "number"
    }
  }
}
```

## Códigos de Erro

### Erros Gerais
- `400`: Requisição inválida
- `401`: Não autorizado
- `403`: Proibido
- `404`: Não encontrado
- `429`: Muitas requisições
- `500`: Erro interno do servidor

### Erros Específicos
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": object
  }
}
```

## Modelos de Dados

### Usuário
```javascript
{
  id: "string",
  username: "string",
  email: "string",
  password: "string (hash)",
  resetToken: "string?",
  resetTokenExpires: "date?",
  createdAt: "date",
  updatedAt: "date",
  lastLogin: "date",
  isActive: "boolean"
}
```

### Relação VM-Usuário
```javascript
{
  id_usuario: "string",
  proxmox_api: "string",
  proxmox_user: "string",
  proxmox_password: "string",
  proxmox_node: "string",
  proxmox_vm_id: "number",
  createdAt: "date",
  updatedAt: "date"
}
```

### Log
```javascript
{
  id: "string",
  level: "string",
  message: "string",
  timestamp: "date",
  userId: "string?",
  vmId: "number?",
  action: "string",
  details: "object"
}
```

## Rate Limiting
- 100 requisições por minuto por IP
- Headers de resposta incluem:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Notas de Versão
- Versão atual: 1.0.0
- Última atualização: [DATA]
- Próximas atualizações planejadas disponíveis no [Roadmap](../README.md#roadmap) 