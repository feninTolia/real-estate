import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export const prisma = new PrismaClient();

export const getLeases = async (_: Request, res: Response) => {
  try {
    const leases = await prisma.lease.findMany({
      include: { tenant: true, property: true },
    });

    res.json(leases);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving leases: ${(error as Error)?.message}`,
    });
  }
};

export const getLeasePayments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payments = await prisma.payment.findMany({
      where: { leaseId: Number(id) },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving lease payments: ${(error as Error)?.message}`,
    });
  }
};
