import { Transporte, PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Schema de validação para 'Viagem'
const viagemSchema = z.object({
  destino: z.string().min(3, { message: "Destino deve ter, no mínimo, 3 caracteres" }),
  transporte: z.nativeEnum(Transporte),
  dataSaida: z.string().date().optional(),
  duracao: z.number().min(1, { message: "Duração deve ser, no mínimo, 1 dia" }),
  preco: z.number().positive({ message: "Deve ser no minimo 1" }),
  hotel: z.string().optional(),
  estrelas: z.number().optional()
});

router.get("/", async (req, res) => {
  try {
    const viagens = await prisma.viagem.findMany({
      orderBy: { id: 'desc' },
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({erro: error})
  }
})

router.post("/", async (req, res) => {

  const valida = viagemSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const viagem = await prisma.viagem.create({
      data: {...valida.data, // 
        dataSaida: valida.data.dataSaida+"T00:00:00Z"} //um horario so pra completsar
})
    res.status(201).json(viagem)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const viagem = await prisma.viagem.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(viagem)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = viagemSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  try {
    const viagem = await prisma.viagem.update({
      where: { id: Number(id) },
      data: {...valida.data,
        dataSaida: valida.data.dataSaida+"T00:00:00Z"} //
    })
    res.status(200).json(viagem)
  } catch (error) {
    res.status(400).json({ error })
  }
})

// // quando quisermos alterar apenas algum/alguns atributo(s)
// router.patch("/:id", async (req, res) => {
//   const { id } = req.params

//   const partialCarroSchema = carroSchema.partial()

//   const valida = partialCarroSchema.safeParse(req.body)
//   if (!valida.success) {
//     res.status(400).json({ erro: valida.error })
//     return
//   }

//   try {
//     const carro = await prisma.carro.update({
//       where: { id: Number(id) },
//       data: valida.data
//     })
//     res.status(200).json(carro)
//   } catch (error) {
//     res.status(400).json({ error })
//   }
// })

router.get("/transporte/:transp", async (req, res) => {
  const { transp } = req.params
  try {
    const viagens = await prisma.viagem.findMany({
      where: { transporte:  transp as Transporte }
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/preco/:max", async (req, res) => {
  const { max } = req.params
  try {
    const viagens = await prisma.viagem.findMany({
      where: { preco:  {lte: Number(max)} } //lte é less than equal tipo menos ou igual
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/destino/ordem", async (req, res) => {
  try {
    const viagens = await prisma.viagem.findMany({
      orderBy: { destino: 'asc'},
      select: {
        destino: true,
        preco: true,
        duracao: true
      }
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/resumo/media", async (req, res) => {
  try {
    const viagens = await prisma.viagem.aggregate({
      _avg: {
        preco: true,
        duracao: true
      }
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({erro: error})
  }
})

router.get("/resumo/transporte", async (req, res) => {
  try {
    const viagens = await prisma.viagem.groupBy({
      by: "transporte",
      _count: { //count para contar os elementos em cada TRANSPORTE
        transporte: true,
      },
    })
    res.status(200).json(viagens)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

//export default router
