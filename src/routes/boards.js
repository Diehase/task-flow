const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

// POST /api/boards  { name }
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
        members: {
          create: [{ userId, role: 'ADMIN' }]
        },
        // При желании можно создать дефолтные колонки
        columns: {
          create: [
            { name: 'To Do', order: 1 },
            { name: 'In Progress', order: 2 },
            { name: 'Done', order: 3 }
          ]
        }
      },
      include: { columns: true, members: true }
    });

    res.status(201).json(board);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/boards - все доски, где я участник
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const boards = await prisma.board.findMany({
      where: { members: { some: { userId } } },
      include: { columns: true, members: { include: { user: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(boards);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
