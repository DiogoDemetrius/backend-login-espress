const User = require('../models/User');
const { generateToken } = require('../utils/tokenService');
const { sendEmail } = require('../utils/emailService');

// Criar usuário
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (await User.findOne({ email })) return res.status(400).json({ message: 'Email já cadastrado' });

        const newUser = await User.create({ username, email, password });
        res.status(201).json({ user: newUser, token: generateToken(newUser) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        res.json({ user, token: generateToken(user) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Recuperação de senha
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

        const resetToken = Math.random().toString(36).substr(2);
        user.resetToken = resetToken;
        user.resetTokenExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        await sendEmail(user.email, 'Recuperação de Senha', `Use esse token para redefinir sua senha: ${resetToken}`);

        res.json({ message: 'Email enviado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Resetar senha
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: 'Token inválido ou expirado' });

        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
