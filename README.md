# Sistema de Gerenciamento de VMs

## Descrição
Sistema para gerenciamento de máquinas virtuais com autenticação de usuários e integração com Proxmox. O sistema permite que usuários autenticados possam iniciar e gerenciar suas máquinas virtuais de forma segura através de uma API RESTful.

## Funcionalidades Principais
- Sistema completo de autenticação de usuários
- Gerenciamento de máquinas virtuais via Proxmox
- Sistema de recuperação de senha
- API RESTful documentada
- Integração segura com Proxmox VE
- Sistema de logs e monitoramento
- Gestão de permissões e acessos

## Tecnologias Utilizadas
- Node.js
- Express.js
- MongoDB (com Mongoose)
- JWT para autenticação
- Axios para requisições HTTP
- Proxmox VE API
- Nodemailer para envio de emails
- Bcrypt para criptografia
- Winston para logs

## Pré-requisitos
- Node.js (versão 14 ou superior)
- MongoDB
- Servidor Proxmox VE configurado
- NPM ou Yarn
- Servidor SMTP para envio de emails

## Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# Servidor
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/vm-manager
MONGODB_USER=seu_usuario
MONGODB_PASS=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret
JWT_EXPIRATION=24h

# Email
EMAIL_SERVICE=seu_servico_email
EMAIL_USER=seu_email
EMAIL_PASS=sua_senha_email
EMAIL_FROM=noreply@seudominio.com

# Proxmox
PROXMOX_API_URL=https://seu-servidor-proxmox:8006/api2/json
PROXMOX_USER=root@pam
PROXMOX_DEFAULT_NODE=node1
PROXMOX_VERIFY_SSL=false

# Logs
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

4. Inicie o servidor
```bash
npm start
```

Para ambiente de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto
```
├── config/
│   ├── database.js         # Configuração do MongoDB
│   ├── email.js           # Configuração do serviço de email
│   ├── logger.js          # Configuração do sistema de logs
│   └── proxmox.js         # Configuração da API do Proxmox
├── controllers/
│   ├── authController.js   # Controlador de autenticação
│   └── vmController.js     # Controlador de VMs
├── docs/
│   └── API.md             # Documentação detalhada da API
├── logs/
│   └── app.log            # Arquivo de logs da aplicação
├── middlewares/
│   ├── authMiddleware.js  # Middleware de autenticação
│   ├── errorHandler.js    # Tratamento global de erros
│   ├── requestLogger.js   # Logger de requisições
│   └── validator.js       # Validação de dados
├── models/
│   ├── User.js           # Modelo de usuário
│   ├── RelacionarVmUser.js # Modelo de relação usuário-VM
│   └── Log.js            # Modelo para logs
├── routes/
│   ├── authRoutes.js     # Rotas de autenticação
│   └── vmRoutes.js       # Rotas de gerenciamento de VMs
├── utils/
│   ├── proxmoxClient.js  # Cliente para API do Proxmox
│   ├── emailService.js   # Serviço de envio de emails
│   ├── tokenService.js   # Serviço de geração de tokens
│   └── validators/       # Validadores de dados
├── tests/
│   ├── unit/            # Testes unitários
│   └── integration/     # Testes de integração
├── .env                  # Variáveis de ambiente
├── .gitignore           # Arquivos ignorados pelo git
├── .eslintrc.js         # Configuração do ESLint
├── .prettierrc          # Configuração do Prettier
├── jest.config.js       # Configuração dos testes
├── package.json         # Dependências e scripts
└── server.js            # Ponto de entrada da aplicação
```

## Scripts Disponíveis
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  }
}
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/forgot-password` - Solicitar recuperação de senha
- `POST /api/auth/reset-password` - Resetar senha
- `DELETE /api/auth/delete-user/:userId` - Deletar usuário
- `PUT /api/auth/update-profile` - Atualizar perfil do usuário

### Máquinas Virtuais
- `POST /api/vm/start-vm` - Iniciar uma máquina virtual
- `POST /api/vm/stop-vm` - Parar uma máquina virtual
- `GET /api/vm/status/:vmId` - Verificar status da VM
- `GET /api/vm/list` - Listar VMs do usuário

## Segurança
- Autenticação via JWT (JSON Web Tokens)
- Senhas criptografadas com bcrypt
- Validação de dados em todas as requisições
- Proteção contra ataques comuns (XSS, CSRF)
- Conexão segura com Proxmox via HTTPS
- Rate limiting para prevenção de ataques de força bruta
- Sanitização de inputs
- Headers de segurança (Helmet)

## Integração com Proxmox
O sistema se integra com o Proxmox VE através de sua API REST, permitindo:
- Inicialização de VMs
- Verificação de status
- Gerenciamento seguro de credenciais
- Comunicação via HTTPS
- Monitoramento de recursos
- Gestão de snapshots

## Modelos de Dados

### Usuário (User)
```javascript
{
  username: String,
  email: String,
  password: String, // Hash bcrypt
  resetToken: String,
  resetTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### Relação VM-Usuário (RelacionarVmUser)
```javascript
{
  id_usuario: String,
  proxmox_api: String,
  proxmox_user: String,
  proxmox_password: String,
  proxmox_node: String,
  proxmox_vm_id: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Sistema de Logs
- Logs de acesso
- Logs de operações em VMs
- Logs de erros
- Rotação automática de logs
- Níveis diferentes de log (info, warn, error)

## Contribuição
1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Testes
```bash
# Executar todos os testes
npm test

# Executar testes com watch mode
npm run test:watch

# Executar testes de uma funcionalidade específica
npm test -- -t "auth"
```

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte
Para suporte:
- Abra uma issue no repositório
- Entre em contato através do email de suporte
- Consulte a documentação em docs/API.md

## Roadmap
- [ ] Implementação de websockets para status em tempo real
- [ ] Dashboard de monitoramento
- [ ] Backup automático de VMs
- [ ] Suporte a múltiplos hypervisors
- [ ] Interface web de administração 