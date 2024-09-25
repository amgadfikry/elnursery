import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
	.setTitle('Elnursery APIs documentaion')
	.setDescription('The full description for elnursery project APIs routes')
	.setVersion('1.0')
	.build();
