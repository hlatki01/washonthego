import { Request, Response } from "express";
import { FavoriteService } from "../services/FavoriteService";

const favoriteService = new FavoriteService();

class FavoriteController {
  async create(req: Request, res: Response) {
    try {
      const { companyId } = req.body;
      const { userId } = req
      const favorite = await favoriteService.create({
        userId,
        companyId
      });
      res.json(favorite);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "An error occurred while creating the favorite." });
    }
  }


  async byUser(req: Request, res: Response) {
    try {     
      const { userId } = req.params;
      const favorite = await favoriteService.byUser({ userId });
      res.json(favorite);
    } catch (error) {
      console.error("Error in one:", error);
      res.status(500).json({ error: "An error occurred while fetching the favorite." });
    }
  }



  async delete(req: Request, res: Response) {
    console.log(req.body);
    
    try {
      const { id } = req.body;
      const favorite = await favoriteService.delete({ id });
      res.json(favorite);
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "An error occurred while deleting the favorite." });
    }
  }
}

export { FavoriteController };
