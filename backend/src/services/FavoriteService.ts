import prismaClient from "../prisma";

interface FavoriteRequest {
  id?: string,
  companyId?: string;
  userId?: string;
}

class FavoriteService {
  async create({ companyId, userId }: FavoriteRequest) {
    try {
      const findFirst = await prismaClient.favorite.findFirst({
        where: { companyId: companyId, AND: { userId: userId } }
      })

      if (findFirst) {
        await prismaClient.favorite.delete({
          where: { id: findFirst.id }
        })
      } else {
        const favorite = await prismaClient.favorite.create({
          data: {
            company: { connect: { id: companyId } },
            user: { connect: { id: userId } }
          },
        });
        return favorite;
      }
    } catch (error) {
      throw new Error(`Favorite creation failed: ${error.message}`);
    }
  }


  async byUser({ userId }: FavoriteRequest) {
    try {
      const favorites = await prismaClient.favorite.findMany({
        where: { userId: userId },
        include: {
          user: true,
          company: true
        }
      });
      return favorites;
    } catch (error) {
      throw new Error(`Fetching favorites failed: ${error.message}`);
    }
  }

  async delete({ id }: FavoriteRequest) {
    try {
      const company = await prismaClient.favorite.delete({
        where: {
          id: id,
        }
      });

      if (!company) {
        throw new Error("Favorite not found");
      }

      return company;
    } catch (error) {
      throw new Error(`Favorite deletion failed: ${error.message}`);
    }
  }
}

export { FavoriteService };
