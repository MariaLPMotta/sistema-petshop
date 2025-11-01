const db = require('../config/db.config');

exports.getAllFuncionario = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Funcionario WHERE Removido = FALSE");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFuncionarioById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Funcionario WHERE ID = ? AND Removido = FALSE", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Funcionário não encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createFuncionario = async (req, res) => {
    const { Nome, Cargo, DataContratacao, Salario } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO Funcionario (Nome, Cargo, DataContratacao, Salario) VALUES (?, ?, ?, ?)",
            [Nome, Cargo, DataContratacao, Salario]
        );
        res.status(201).json({ id: result.insertId, Nome, Cargo, DataContratacao, Salario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFuncionario = async (req, res) => {
    const { Nome, Cargo, DataContratacao, Salario } = req.body;
    try {
        const [result] = await db.query(
            "UPDATE Funcionario SET Nome = ?, Cargo = ?, DataContratacao = ?, Salario = ? WHERE ID = ? AND Removido = FALSE",
            [Nome, Cargo, DataContratacao, Salario, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Funcionário não encontrado" });
        res.json({ message: "Funcionário atualizado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFuncionario = async (req, res) => {
    try {
        const [result] = await db.query("UPDATE Funcionario SET Removido = TRUE WHERE ID = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Funcionário não encontrado" });
        res.json({ message: "Funcionário removido com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
