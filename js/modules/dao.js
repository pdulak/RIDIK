import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const Dao = () => {
    const disconnect = async () => {
        await prisma.$disconnect()
    }

    const countSysConfig = async () => {
        prisma.sysconfig.count()
            .then((data) => { return data })
            .catch((error) => { return -1 })
    }

    const checkIfSysConfigExists = async () => {
        const SysConfigElements = await prisma.sysconfig.count()
                                            .then((data) => { return data })
                                            .catch((error) => { return -1 });
        if (SysConfigElements >= 0) {
            return true
        } else {
            return false
        }
    }

    return {
        prisma,
        checkIfSysConfigExists,
        disconnect,
    }
}

export const dao = Dao();