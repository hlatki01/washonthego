import { Request, Response } from "express";
import { UserService } from "../../src/services/UserService";
import EmailService from "../services/EmailService";
import prismaClient from "../prisma";
const fs = require('fs');

const userService = new UserService();
const emailService = new EmailService();


class UserController {
  async auth(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const auth = await userService.auth({ email, password });
      res.json(auth);
    } catch (error) {
      console.error("Error in auth:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const { companyId } = req

      console.log(req.body);


      const newUser = await userService.create({ name, email, password, role, companyId });
      res.json(newUser);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const { userId, file } = req

      if (!file) {
        throw new Error("Please upload a file");
      }

      if (file) {
        const fileToDelete = await prismaClient.user.findUnique({
          where: { id: userId }
        })

        if(fileToDelete){
          
          const filePath = `./storage/${fileToDelete.photo}`;

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
              // Handle the error (send an error response to the client, etc.)
            } else {
              console.log("File deleted successfully");
            }
          });
        }

      }

      const { filename: photo } = req.file;

      const updatedUser = await userService.update({ userId, name, email, password, role, photo });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async one(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const user = await userService.one({ userId });
      res.json(user);
    } catch (error) {
      console.error("Error in one:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const user = await userService.me(userId);
      res.json(user);
    } catch (error) {
      console.error("Error in me:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const deletedUser = await userService.delete({ userId });
      res.json(deletedUser);
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "" + error });
    }
  }

  async generateResetToken(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const resetToken = await userService.generateResetToken(email);

      const emailText = `Your password reset token is: ${resetToken}`;
      await emailService.sendEmail(email, 'Password Reset', emailText);

      res.json({ message: 'Reset token sent successfully' });
    } catch (error) {
      console.error('Error in generateResetToken:', error);
      res.status(500).json({ error: '' + error });
    }
  }

  async resetPassword(req: Request, res: Response) {
    console.log(req.body);

    try {
      const { resetToken, newPassword } = req.body;
      await userService.resetPassword(resetToken, newPassword);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      res.status(500).json({ error: '' + error });
    }
  }

}

export { UserController };
