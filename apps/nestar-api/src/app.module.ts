import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';

@Module({
	imports: [
		ConfigModule.forRoot(),
		GraphQLModule.forRoot({
			driver: ApolloDriver,
			playground: true,
			uploads: false,
			autoSchemaFile: true,
			// formatError: (error: T) => {
			// 	const graphQLFormattedError = {
			// 		code: error?.extensions.code,
			// 		message:
			// 			error?.extensions?.exception?.response?.message ||
			// 			error?.extensions?.response?.message ||
			// 			error?.message,
			// 	};
			// 	console.log('GRAPHQL GLOBAL ERR:', graphQLFormattedError);
			// 	return graphQLFormattedError;
			// },
			formatError: (error: T) => {
				const res = error?.extensions?.originalError || error?.extensions?.response;
				const rawMsg = res?.message || error?.message;

				const graphQLFormattedError = {
					code: error?.extensions?.code || 'BAD_REQUEST',
					message: Array.isArray(rawMsg) ? rawMsg.join('; ') : rawMsg,
				};

				console.log('GRAPHQL GLOBAL ERR:', graphQLFormattedError);
				return graphQLFormattedError;
			},
		}),
		ComponentsModule,
		DatabaseModule,
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}
