import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';

// This service is responsible for hashing passwords, changing passwords, and resetting passwords.
@Injectable()
export class PasswordService {
  /* hashPassword is a method that takes a password and hashes it using bcrypt.
      Parameters:
      - password: string
      Returns:
        - hashed password: string
  */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  }

  /* comparePassword is a method that takes a password and a hashed password and compares them.
      Parameters:
      - password: string
      - hashedPassword: string
      Returns:
        - boolean
  */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(error);
    }
  }

  /* generateRandomPassword is a method that generates a random password using the generate-password library.
      Returns:
        - random password: string
  */
  generateRandomPassword(): string {
    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });
    return password;
  }
}
