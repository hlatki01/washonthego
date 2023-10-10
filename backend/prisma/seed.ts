const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Create a new company
        const company = await prisma.company.create({
            data: {
                name: 'Lavacar do Zezé',
                email: 'falecom@meubot.chat',
                phone: '(42)99101-1118',
                logo: 'company-logo.png',
            },
        });

        // Create a new address associated with the company
        const address = await prisma.address.create({
            data: {
                companyId: company.id,
                road: 'Rua Jany Nunes Stoklos',
                number: '135',
                neighborhood: 'Nhapindazal',
                city: 'Irati',
                postalCode: '84500614',
                country: 'BR'
            }
        });

        // Create a new user associated with the company
        const user = await prisma.user.create({
            data: {
                name: 'Luis Hlatki',
                email: 'luis@guilhermeh.me',
                password: await hash('123', 8),
                role: 'ADMIN',
                companyId: company.id,
            },
        });
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
