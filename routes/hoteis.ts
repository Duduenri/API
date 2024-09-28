import { Categoria, PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Schema de validação para 'Hotel'
const hoteisSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter, no mínimo, 3 caracteres" }),
  cidade: z.string().min(3, { message: "Cidade deve ter, no mínimo, 3 caracteres" }),
  preco: z.number().positive({ message: "Preço deve ser positivo" }),
  estrelas: z.number().int().min(1).max(5),
  quartos: z.number().int().min(1, { message: "Número de quartos deve ser no mínimo 1" }),
  categoria: z.nativeEnum(Categoria)
});

router.get("/", async (req, res) => {
    try {
      const hoteis = await prisma.hotel.findMany({
        orderBy: { id: 'desc' },
      })
      res.status(200).json(hoteis)
    } catch (error) {
      res.status(500).json({erro: error})
    }
  })


// Rota para listar todos os hotéis
router.get("/", async (req, res) => {
    try {
      const hoteis = await prisma.hotel.findMany({
        orderBy: { id: 'desc' },
      });
      res.status(200).json(hoteis);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });
  
  // Rota para criar um novo hotel
  router.post("/", async (req, res) => {
    const valida = hoteisSchema.safeParse(req.body);
    if (!valida.success) {
      res.status(400).json({ erro: valida.error });
      return;
    }
  
    try {
      const hotel = await prisma.hotel.create({
        data: valida.data
      });
      res.status(201).json(hotel);
    } catch (error) {
      res.status(400).json({ erro: error });
    }
  });
  
  // Rota para deletar um hotel pelo ID
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const hotel = await prisma.hotel.delete({
        where: { id: Number(id) }
      });
      res.status(200).json(hotel);
    } catch (error) {
      res.status(400).json({ erro: error });
    }
  });

  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const valida = hoteisSchema.safeParse(req.body);
    
    if (!valida.success) {
      res.status(400).json({ erro: valida.error });
      return;
    }
  
    try {
      const hotelAtualizado = await prisma.hotel.update({
        where: { id: Number(id) },
        data: valida.data
      });
      res.status(200).json(hotelAtualizado);
    } catch (error) {
      res.status(400).json({ erro: error });
    }
  });

  router.get("/ordenados", async (req, res) => {
    try {
      const hoteis = await prisma.hotel.findMany({
        select: {
          nome: true,
          cidade: true,
          preco: true
        },
        orderBy: {
          preco: 'asc'
        }
      });
      res.status(200).json(hoteis);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });

  router.get("/media-estrelas", async (req, res) => {
    try {
      const mediaEstrelas = await prisma.hotel.aggregate({
        _avg: {
          estrelas: true
        }
      });
      res.status(200).json({ mediaEstrelas: mediaEstrelas._avg.estrelas });
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });
  
  router.get("/total-quartos", async (req, res) => {
    try {
      const totalQuartos = await prisma.hotel.aggregate({
        _sum: {
          quartos: true
        }
      });
      res.status(200).json({ totalQuartos: totalQuartos._sum.quartos });
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });

  router.get("/categorias", async (req, res) => {
    try {
      const categorias = await prisma.hotel.groupBy({
        by: ['categoria'], // Agrupar pelos valores da categoria
        _count: {
          categoria: true // Contar o número de hotéis em cada categoria
        }
      });
      
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });

  router.get("/filtrar", async (req, res) => {
    try {
      const hoteisFiltrados = await prisma.hotel.findMany({
        where: {
          cidade: "Pelotas",
          estrelas: 3
        }
      });
      
      res.status(200).json(hoteisFiltrados);
    } catch (error) {
      res.status(500).json({ erro: error });
    }
  });


  export default router;