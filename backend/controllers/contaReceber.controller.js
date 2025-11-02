const db = require('../config/db.config');

exports.getAllContasReceber = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT cr.*, c.Nome AS NomeCliente
            FROM ContaReceber cr
            JOIN Cliente c ON cr.ID_Cliente = c.ID
            WHERE cr.Removido = FALSE AND c.Removido = FALSE
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContaReceberById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT cr.*, c.Nome AS NomeCliente
            FROM ContaReceber cr
            JOIN Cliente c ON cr.ID_Cliente = c.ID
            WHERE cr.ID = ? AND cr.Removido = FALSE
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Conta a receber não encontrada" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createContaReceber = async (req, res) => {
    const { Descricao, DataLancamento, Valor, ID_Cliente } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO ContaReceber (Descricao, DataLancamento, Valor, Status, ID_Cliente) VALUES (?, ?, ?, 'PENDENTE', ?)",
            [Descricao, DataLancamento, Valor, ID_Cliente]
        );
        res.status(201).json({ id: result.insertId, Descricao, DataLancamento, Valor, ID_Cliente });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateContaReceber = async (req, res) => {
    const { Descricao, DataLancamento, Valor, Status } = req.body;
    try {
        const [result] = await db.query(
            "UPDATE ContaReceber SET Descricao = ?, DataLancamento = ?, Valor = ?, Status = ? WHERE ID = ? AND Removido = FALSE",
            [Descricao, DataLancamento, Valor, Status, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: "Conta a receber não encontrada" });
        res.json({ message: "Conta a receber atualizada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteContaReceber = async (req, res) => {
    try {
        const [result] = await db.query("UPDATE ContaReceber SET Removido = TRUE WHERE ID = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Conta a receber não encontrada" });
        res.json({ message: "Conta a receber removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
