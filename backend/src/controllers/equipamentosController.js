import db from '../config/database.js';

export const listar = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipamentos ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM equipamentos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const criar = async (req, res) => {
  try {
    const { nome, marca, modelo, setor, estado } = req.body;

    if (!nome || !marca || !modelo || !setor || !estado) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const [result] = await db.query(
      'INSERT INTO equipamentos (nome, marca, modelo, setor, estado) VALUES (?, ?, ?, ?, ?)',
      [nome, marca, modelo, setor, estado]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      marca,
      modelo,
      setor,
      estado,
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, marca, modelo, setor, estado } = req.body;

    if (!nome || !marca || !modelo || !setor || !estado) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const [result] = await db.query(
      'UPDATE equipamentos SET nome = ?, marca = ?, modelo = ?, setor = ?, estado = ? WHERE id = ?',
      [nome, marca, modelo, setor, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado' });
    }

    res.json({ id: Number(id), nome, marca, modelo, setor, estado });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

export const deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM equipamentos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Equipamento não encontrado' });
    }

    res.json({ mensagem: 'Equipamento removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
