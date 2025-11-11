import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ExpenseModule} from "./expense/expense.module";
//import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env}`],
            //validationSchema: configValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'mysql',
                    logging: true,
                    autoLoadEntities: true,
                    synchronize: false,
                    replication: {
                        master: {
                            // host: configService.get(ConfigParameters.DB_WRITE_HOST),
                            // port: configService.get(ConfigParameters.DB_PORT),
                            // username: configService.get(ConfigParameters.DB_USER),
                            // password: configService.get(ConfigParameters.DB_PASSWORD),
                            // database: configService.get(ConfigParameters.DB_NAME),
                        },
                        slaves: [
                            {
                                // host: configService.get(ConfigParameters.DB_READ_HOST),
                                // port: configService.get(ConfigParameters.DB_PORT),
                                // username: configService.get(ConfigParameters.DB_USER),
                                // password: configService.get(ConfigParameters.DB_PASSWORD),
                                // database: configService.get(ConfigParameters.DB_NAME),
                            },
                        ],
                    },
                };
            },
        }),
        ExpenseModule,
        //AssigneeModule,
        //AuthModule,
    ],
})
export class AppModule {}
