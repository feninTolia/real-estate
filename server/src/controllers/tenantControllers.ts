import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response) => {
  try {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: { favorites: true },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving tenant: ${(error as Error)?.message}`,
    });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });

    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({
      message: `Error creating tenant: ${(error as Error)?.message}`,
    });
  }
};

export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const { cognitoId } = req.params;
    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: {
        name,
        email,
        phoneNumber,
      },
    });

    res.json(updatedTenant);
  } catch (error) {
    res.status(500).json({
      message: `Error updating tenant: ${(error as Error)?.message}`,
    });
  }
};
