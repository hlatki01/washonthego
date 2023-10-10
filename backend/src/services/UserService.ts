import prismaClient from "../prisma";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

interface AuthRequest {
  email: string;
  password: string;
}

enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface UserRequest {
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Roles;
  companyId?: string;
  photo?: string
}

class UserService {
  async auth({ email, password }: AuthRequest) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new Error("Usuário/senha incorretos.");
      }

      if (user.deleted) {
        throw new Error("Your user was deleted, contact support.");
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("User/password incorrect");
      }

      const token = sign(
        {
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: "15d",
        }
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        company: user.companyId,
      };
    } catch (error) {
      throw new Error(`Falha ao autenticar: ${error.message}`);
    }
  }

  async create({ name, email, password, role, companyId }: UserRequest) {
    try {
      if (!name || !email || !password) {
        throw new Error("All fields are mandatory");
      }

      const userAlreadyExists = await prismaClient.user.findFirst({
        where: {
          email: email,
        },
      });

      if (userAlreadyExists) {
        throw new Error("User already exists");
      }

      const passwordHash = await hash(password, 8);

      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          companyId,
          role
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  async update({
    userId,
    name,
    email,
    password,
    role,
    photo
  }: UserRequest) {
    try {
      if (!email) {
        throw new Error("Email incorrect");
      }

      const getUserInfo = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!getUserInfo) {
        throw new Error("User not found");
      }

      const updateData: any = {}; // Create an empty object to store the fields that need to be updated

      if (name) {
        updateData.name = name;
      }

      if (role) {
        updateData.role = role;
      }

      if (email) {
        // Check for email uniqueness if email is provided in the request
        const userAlreadyExists = await prismaClient.user.findFirst({
          where: {
            email: email,
          },
        });

        if (userAlreadyExists && userAlreadyExists.id !== getUserInfo.id) {
          throw new Error("User with this email already exists");
        }

        updateData.email = email;
      }

      if (password) {
        const passwordHash = await hash(password, 8);
        updateData.password = passwordHash;
      }

      if (photo) {
        updateData.photo = photo;
      }

      const user = await prismaClient.user.update({
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          photo: true
        },
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`User update failed: ${error.message}`);
    }
  }

  async one({ userId }: UserRequest) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
          deleted: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          deleted: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Fetching user failed: ${error.message}`);
    }
  }

  async delete({ userId }: UserRequest) {
    try {
      const user = await prismaClient.user.update({
        data: {
          deleted: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }

  async me(userId: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          role: true,
          photo: true
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error(`Fetching user profile failed: ${error.message}`);
    }
  }

  async generateResetToken(email: string) {

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // Token expires in 1 hour

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const passwordHash = await hash(newPassword, 8);

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}

export { UserService };
